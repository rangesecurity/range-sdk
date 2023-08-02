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
    onBlock?: {
        callback: (block: IRangeBlock, network: IRangeNetwork) => Promise<IRangeEvent[]>
        filter?: { networks: IRangeNetwork[] }
    },
    onTransaction?: {
        callback: (transaction: IRangeTransaction, network: IRangeNetwork) => Promise<IRangeEvent[]>
        filter?: { networks: IRangeNetwork[], success?: boolean }
    },
    onMessage?: {
        callback: (message: IRangeMessage, network: IRangeNetwork) => Promise<IRangeEvent[]>
        filter?: { networks: IRangeNetwork[], types?: string[], success?: boolean }
    }
}

class RangeSDK {
    opts: Options
    queue: WorkPackageQueue
    private cosmosClients: Partial<Record<Network, CosmosClient>>

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
    }

    async init() {
        await this.queue.connect()
        this.queue.consume((msg, channel) => this.processTask(msg, channel));
    }

    async processTask(msg: ConsumeMessage, channel: Channel) {
        try {
            const taskObj = JSON.parse(String(msg.content))

            const allEvents = await Promise.all([
                this.processBlock(taskObj),
                this.processTx(taskObj),
                this.processMessage(taskObj),
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

    async processBlock(task: any): Promise<IRangeEvent[]> {
        if (!this.opts.onBlock) {
            return []
        }
        if (this.opts.onBlock.filter?.networks) {
            if (!this.opts.onBlock.filter?.networks.includes(task.network)) {
                return []
            }
        }

        const events = await this.opts.onBlock.callback(task.block, task.network)
        return events;
    }

    async processTx(task: any): Promise<IRangeEvent[]> {
        if (!this.opts.onTransaction) {
            return []
        }
        if (this.opts.onTransaction.filter?.networks) {
            if (!this.opts.onTransaction.filter?.networks.includes(task.network)) {
                return []
            }
        }

        let filteredTxs = task.block.transactions;


        if (this.opts.onTransaction.filter?.success !== undefined) {
            filteredTxs = filteredTxs.filter((tx: any) => tx.success === this.opts.onTransaction!.filter?.success)
        }


        const allEvents = await Promise.all(filteredTxs.map(async (tx: any) => {
            const events = await this.opts.onTransaction!.callback(tx, task.network)
            return events;
        }))

        return allEvents.flat();
    }

    async processMessage(task: any): Promise<IRangeEvent[]> {
        if (!this.opts.onMessage) {
            return []
        }
        if (this.opts.onMessage.filter?.networks) {
            if (!this.opts.onMessage.filter?.networks.includes(task.network)) {
                return []
            }
        }

        let allTransactions = task.block.transactions;

        if (this.opts.onMessage.filter?.success !== undefined) {
            allTransactions = allTransactions.filter((tx: any) => tx.success === this.opts.onMessage!.filter?.success)
        }

        let allMessages = allTransactions.flatMap((tx: any) => tx.messages)

        if (this.opts.onMessage.filter?.types) {
            allMessages = allMessages.filter((m: any) => this.opts.onMessage!.filter?.types?.includes(m.type))
        }

        const res = await Promise.all(
            allMessages.map(async (m: any) => {
                const events = await this.opts.onMessage!.callback(m, task.network)
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
