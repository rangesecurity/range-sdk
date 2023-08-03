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

export interface OnBlock {
    callback: (block: IRangeBlock, network: IRangeNetwork) => Promise<IRangeEvent[]>
    filter?: {}
}
export interface OnTransaction {
    callback: (transaction: IRangeTransaction, network: IRangeNetwork) => Promise<IRangeEvent[]>
    filter?: { success?: boolean }
}
export interface OnMessage {
    callback: (message: IRangeMessage, network: IRangeNetwork) => Promise<IRangeEvent[]>
    filter?: {
        success?: boolean,
        types?: string[],
        involved_account_addresses?: string[]
    }
}

export interface Options {
    token: string
    networks: IRangeNetwork[],
    endpoints?: Partial<Record<Network, string>>,
    onBlocks?: OnBlock[],
    onTransactions?: OnTransaction[],
    onMessages?: OnMessage[]
}

class RangeSDK {
    private opts: Options
    private queue: WorkPackageQueue
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

    private async processTask(msg: ConsumeMessage, channel: Channel) {
        try {
            const taskObj: { block: any, network: Network } = JSON.parse(String(msg.content)) // TODO: Can we use zod here? or it will be an overhead

            console.assert(this.opts.networks.includes(taskObj.network))

            const allEvents = await Promise.all([
                this.processBlocks(taskObj.block, taskObj.network),
                this.processTxs(taskObj.block, taskObj.network),
                this.processMessages(taskObj.block, taskObj.network),
            ])

            const events = allEvents.flat();

            if (events.length > 0) {
                channel.sendToQueue(msg.properties.replyTo, toBuffer({ success: true, events }));
            }

            channel.ack(msg)
        } catch (e) {
            channel.sendToQueue(msg.properties.replyTo, toBuffer({ success: false, }));
            console.error(e)
            channel.nack(msg);
        }
    }

    private async processBlocks(block: any, network: Network): Promise<IRangeEvent[]> {
        if (!this.opts.onBlocks || this.opts.onBlocks.length === 0) {
            return []
        }

        const allEvents = await Promise.all(
            this.opts.onBlocks.map(async (onBlock) => {
                const events = await onBlock.callback(block, network)
                return events;
            })
        )

        return allEvents.flat();
    }

    private async processTxs(block: any, network: Network): Promise<IRangeEvent[]> {
        if (!this.opts.onTransactions || this.opts.onTransactions.length === 0) {
            return []
        }


        const allEvents = await Promise.all(
            this.opts.onTransactions.map(async (onTx) => {
                let filteredTxs = block.transactions;

                if (onTx.filter?.success !== undefined) {
                    filteredTxs = filteredTxs.filter((tx: any) => tx.success === onTx!.filter?.success)
                }

                const events = await Promise.all(filteredTxs.map(async (tx: any) => {
                    const events = await onTx.callback(tx, network)
                    return events;
                }))

                return events.flat();
            })
        );

        return allEvents.flat();
    }

    private async processMessages(block: any, network: Network): Promise<IRangeEvent[]> {
        if (!this.opts.onMessages || this.opts.onMessages.length === 0) {
            return []
        }

        const allEvents = await Promise.all(
            this.opts.onMessages.map(async (onMessage) => {
                let filteredTxs = block.transactions;
                if (onMessage.filter?.success !== undefined) {
                    filteredTxs = filteredTxs.filter((tx: any) => tx.success === onMessage.filter?.success)
                }

                let allMessages = filteredTxs.flatMap((tx: any) => tx.messages)
                if (onMessage.filter?.types) {
                    allMessages = allMessages.filter((m: any) => onMessage.filter?.types?.includes(m.type))
                }

                if (onMessage.filter?.involved_account_addresses) {
                    allMessages = allMessages.filter((m: any) => m.involved_account_addresses.some(
                        (addr: string) => onMessage.filter?.involved_account_addresses?.includes(addr)
                    ));
                }


                const allEvents = await Promise.all(
                    allMessages.map(async (m: any) => {
                        const events = await onMessage.callback(m, network)
                        return events;
                    })
                )

                return allEvents.flat();
            })
        )

        return allEvents.flat();
    }

    getCosmosClient(network: Network): CosmosClient {
        const client = this.cosmosClients[network]
        assert(client, `Cosmos client for network ${network} not found`)
        return client!
    }
}

export { RangeSDK } 
