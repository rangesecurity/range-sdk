import { IRangeNetwork } from './types/IRangeNetwork'
import { IRangeBlock } from './types/chain/IRangeBlock'
import { IRangeResult } from './types/IRangeEvent'
import { IRangeMessage } from './types/chain/IRangeMessage'
import { IRangeTransaction } from './types/chain/IRangeTransaction'
import { Network } from './network'
import { CosmosClient } from './cosmos/CosmosClient'
import { assert } from 'console'
import fs from 'fs'
import { KafkaClient } from './connections/KafkaClient'
import { env } from './env'
import { WorkPackageQueue } from './connections/WorkPackageQueue'

export interface OnBlock {
	callback: (block: IRangeBlock, network: IRangeNetwork) => Promise<IRangeResult[]>
	filter?: {}
}
export interface OnTransaction {
	callback: (transaction: IRangeTransaction, network: IRangeNetwork) => Promise<IRangeResult[]>
	filter?: { success?: boolean }
}
export interface OnMessage {
	callback: (message: IRangeMessage, network: IRangeNetwork) => Promise<IRangeResult[]>
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

	networkConfigFile?: string
}

const DEFAULT_NETWORK_CONFIG_PATH = './networkConfig.json';

class RangeSDK extends KafkaClient<IRangeBlock>{
	private opts: Options
	private replyQueue: WorkPackageQueue
	private cosmosClients: Partial<Record<IRangeNetwork, CosmosClient>>

	networkConfig: Record<string, number | null>

	constructor(options: Options) {
		super(env.KAFKA_TOPICS)
		// tbd: Later we fetch the config from the scheduler
		// instead of defining it in .env. This will allow
		// the scheduler to filter events beforehand and it will
		// serve as auth layer. await axios.post(..., { token, options })

		this.opts = options
		this.replyQueue = new WorkPackageQueue(env.AMQP_HOST)

		if (this.opts.networkConfigFile) {
			// Load the file and assign to this.networkConfig
			try {
				const configFile = fs.readFileSync(this.opts.networkConfigFile, 'utf-8');
				this.networkConfig = JSON.parse(configFile);
			} catch (err) {
				throw new Error(`Error loading network config file: ${err}`);
			}
		} else {
			// Check if a local networkConfig file is available or not
			if (fs.existsSync(DEFAULT_NETWORK_CONFIG_PATH)) {
				// Load the local config file and assign to this.networkConfig
				try {
					const localConfigFile = fs.readFileSync(DEFAULT_NETWORK_CONFIG_PATH, 'utf-8');
					this.networkConfig = JSON.parse(localConfigFile);
					console.log('networkConfig.json successfully loaded!');
				} catch (err) {
					throw new Error(`Error loading local network config file: ${err}`);
				}
			} else {
				// Create a local network config file with null values
				const defaultConfig = this.opts.networks.reduce((acc, network) => {
					acc[network] = null;
					return acc;
				}, {} as Record<Network, null>);
				try {
					fs.writeFileSync(DEFAULT_NETWORK_CONFIG_PATH, JSON.stringify(defaultConfig, null, 2), 'utf-8');
					this.networkConfig = defaultConfig;
					console.log('Created networkConfig.json with default values');
				} catch (err) {
					throw new Error(`Error creating networkConfig.json: ${err}`);
				}
			}
		}

		this.cosmosClients = {};
		if (this.opts.endpoints) {
			for (const key of Object.keys(this.opts.endpoints)) {
				const networkKey = key as Network;
				const endpoint = this.opts.endpoints[networkKey];
				assert(endpoint, `Endpoint for network ${networkKey} is not defined`)
				this.cosmosClients[networkKey] = new CosmosClient(endpoint!);
			}
		}
	}

	async processMessage(block: IRangeBlock) {
		try {
			const allEvents = await Promise.all([
				this.processBlocks(block),
				this.processTxs(block),
				this.processTxMessages(block),
			])

			const events = allEvents.flat();

			if (events.length > 0) {
				this.replyQueue.reply(events);
			}

		} catch (e) {
			console.error(e)
		}
	}

	private async processBlocks(block: IRangeBlock): Promise<IRangeResult[]> {
		if (!this.opts.onBlocks || this.opts.onBlocks.length === 0) {
			return []
		}

		const allEvents = await Promise.all(
			this.opts.onBlocks.map(async (onBlock) => {
				try {
					const events = await onBlock.callback(block, block.network)
					return events;
				} catch (error) {
					return [{
						network: block.network,
						blockNumber: block.height,
						details: { error: String(error) }
					}]
				}
			})
		)

		return allEvents.flat();
	}

	private async processTxs(block: any): Promise<IRangeResult[]> {
		if (!this.opts.onTransactions || this.opts.onTransactions.length === 0) {
			return []
		}


		const allEvents = await Promise.all(
			this.opts.onTransactions.map(async (onTx) => {
				let filteredTxs = block.transactions;

				if (onTx.filter?.success !== undefined) {
					filteredTxs = filteredTxs.filter((tx: any) => tx.success === onTx.filter?.success)
				}

				const events = await Promise.all(filteredTxs.map(async (tx: any) => {
					try {
						const events = await onTx.callback(tx, block.network)
						return events;
					} catch (error) {
						return [{
							network: block.network,
							blockNumber: block.height,
							details: { error: String(error) }
						}]
					}

				}))

				return events.flat();
			})
		);

		return allEvents.flat();
	}

	private async processTxMessages(block: any): Promise<IRangeResult[]> {
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
						try {
							const events = await onMessage.callback(m, block.network)
							return events;
						} catch (error) {
							return [{
								network: block.network,
								blockNumber: block.height,
								details: { error: String(error) }
							}]
						}
					})
				)

				return allEvents.flat();
			})
		)

		return allEvents.flat();
	}

	getCosmosClient(network: Network): CosmosClient {
		// TODO: we can add our proxy client here
		const client = this.cosmosClients[network]
		assert(client, `Cosmos client for network ${network} not found`)
		return client!
	}
}

export { RangeSDK } 
