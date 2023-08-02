import { env } from './env'
import { WorkPackageQueue } from './models/WorkPackageQueue'
import { IRangeNetwork } from './types/IRangeNetwork'
import { IRangeBlock } from './types/IRangeBlock'
import { IRangeEvent } from './types/IRangeEvent'
import { Channel, ConsumeMessage } from 'amqplib'
import { IRangeMessage } from './types/IRangeMessage'
import { IRangeTransaction } from './types/IRangeTransaction'
import { toBuffer } from './utils/toBuffer'
import { Network } from './network'
import { CosmosClient } from './cosmos/CosmosClient'
import { assert } from 'console'

interface Options {
    token: string
    endpoints?: Partial<Record<Network, string>>,
    networks: IRangeNetwork[],
    onBlock?: {
        callback: (block: IRangeBlock, network: IRangeNetwork) => Promise<IRangeEvent[]>
        filter?: {}
    },
    onTransaction?: {
        callback: (transaction: IRangeTransaction, network: IRangeNetwork) => Promise<IRangeEvent[]>
        filter?: { success?: boolean }
    },
    onMessage?: {
        callback: (message: IRangeMessage, network: IRangeNetwork) => Promise<IRangeEvent[]>
        filter?: {
            types?: string[], success?: boolean,
            involved_account_addresses?: string[]
        }
    }
}

class RangeSDK {
    opts: Options
    queue: WorkPackageQueue
    private cosmosClients: Partial<Record<Network, CosmosClient>>
    private involved_account_addresses?: Set<string>

    constructor(options: Options) {
        // tbd: Later we fetch the config from the scheduler
        // instead of defining it in .env. This will allow
        // the scheduler to filter events beforehand and it will
        // serve as auth layer. await axios.post(..., { token, options })

        this.opts = options
        this.queue = new WorkPackageQueue(env.AMQP_HOST)
        this.cosmosClients = {}

        if (this.opts.endpoints) {
            for (const key of Object.keys(this.opts.endpoints)) {
                const networkKey = key as Network;
                const endpoint = this.opts.endpoints[networkKey];
                assert(endpoint, `Endpoint for network ${networkKey} is not defined`)
                this.cosmosClients[networkKey] = new CosmosClient(endpoint!);
            }
        }

        if (this.opts.onMessage?.filter?.involved_account_addresses && this.opts.onMessage?.filter?.involved_account_addresses.length > 0) {
            this.involved_account_addresses = new Set(this.opts.onMessage?.filter?.involved_account_addresses);
        }
    }

    async init() {
        await this.queue.connect()
        this.queue.consume((msg, channel) => this.processTask(msg, channel));
    }

    async processTask(msg: ConsumeMessage, channel: Channel) {
        try {
            const taskObj: { block: any, network: Network } = JSON.parse(String(msg.content)) // Can we use zod here? or it will be an overhead

            console.assert(this.opts.networks.includes(taskObj.network))

            const allEvents = await Promise.all([
                this.processBlock(taskObj.block, taskObj.network),
                this.processTx(taskObj.block, taskObj.network),
                this.processMessage(taskObj.block, taskObj.network),
            ])

            const events = allEvents.flat();

            if (events.length > 0) {
                channel.sendToQueue(msg.properties.replyTo, toBuffer(events));
            }

        } catch (e) {
            console.error(e)
        } finally {
            channel.ack(msg)
        }
    }

    async processBlock(block: any, network: Network): Promise<IRangeEvent[]> {
        if (!this.opts.onBlock) {
            return []
        }

        const events = await this.opts.onBlock.callback(block, network)
        return events;
    }

    async processTx(block: any, network: Network): Promise<IRangeEvent[]> {
        if (!this.opts.onTransaction) {
            return []
        }

        let filteredTxs = block.transactions;


        if (this.opts.onTransaction.filter?.success !== undefined) {
            filteredTxs = filteredTxs.filter((tx: any) => tx.success === this.opts.onTransaction!.filter?.success)
        }


        const allEvents = await Promise.all(filteredTxs.map(async (tx: any) => {
            const events = await this.opts.onTransaction!.callback(tx, network)
            return events;
        }))

        return allEvents.flat();
    }

    async processMessage(block: any, network: Network): Promise<IRangeEvent[]> {
        if (!this.opts.onMessage) {
            return []
        }

        let allTransactions = block.transactions;

        if (this.opts.onMessage.filter?.success !== undefined) {
            allTransactions = allTransactions.filter((tx: any) => tx.success === this.opts.onMessage!.filter?.success)
        }

        let allMessages = allTransactions.flatMap((tx: any) => tx.messages)

        if (this.opts.onMessage.filter?.types) {
            allMessages = allMessages.filter((m: any) => this.opts.onMessage!.filter?.types?.includes(m.type))
        }

        if (this.involved_account_addresses) {
            allMessages = allMessages.filter((m: any) => {
                return m.involved_account_addresses.some(
                    (addr: string) => {
                        return this.involved_account_addresses?.has(addr)
                    }
                )
            });
        }

        const res = await Promise.all(
            allMessages.map(async (m: any) => {
                const events = await this.opts.onMessage!.callback(m, network)
                return events;
            })
        )

        const events = res.flat();

        return events;
    }

    getCosmosClient(network: Network): CosmosClient {
        const client = this.cosmosClients[network]
        assert(client, `Cosmos client for network ${network} not found`)
        return client!
    }
}

export { RangeSDK } 
