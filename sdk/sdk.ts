import { env } from './env'
import { WorkPackageQueue } from './models/WorkPackageQueue'
import { IRangeNetwork } from './types/IRangeNetwork'
import { IRangeBlock } from './types/chain/IRangeBlock'
import { IRangeResult } from './types/IRangeEvent'
import { Channel, ConsumeMessage } from 'amqplib'
import { IRangeMessage } from './types/chain/IRangeMessage'
import { IRangeTransaction } from './types/chain/IRangeTransaction'
import { toBuffer } from './utils/toBuffer'
import { Network } from './network'
import { CosmosClient } from './cosmos/CosmosClient'
import { assert } from 'console'
import fs from 'fs'

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

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

class RangeSDK {
	private opts: Options
	private queue: WorkPackageQueue
	private cosmosClients: Partial<Record<Network, CosmosClient>>

	networkConfig: Record<string, number | null>

	constructor(options: Options) {
		// tbd: Later we fetch the config from the scheduler
		// instead of defining it in .env. This will allow
		// the scheduler to filter events beforehand and it will
		// serve as auth layer. await axios.post(..., { token, options })

		this.opts = options
		this.queue = new WorkPackageQueue(env.AMQP_HOST)
		this.cosmosClients = {}


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
		// await this.queue.connect()
		// this.queue.consume((msg, channel) => this.processTask(msg, channel));

		this.processTask2();
	}

	async requestBlock(network: Network, height: number | null): Promise<IRangeBlock | null> {
		// dummy statement
		return {
			height: height || 1,
			hash: '4ED2DD910CCAA8F81F10BDA2DC5C550A11A2AF57B4DFF5029CA2D856A775C2C7',
			timestamp: '2023-05-18T02:34:22.893Z',
			network,
			transactions: [
				{
					hash: 'E1039C785DE54D3C9DF40B9B4B697C5B7E30A431B3EE857D1F8334CB7ED369A2',
					success: false,
					messages: [
						{
							type: 'osmosis.lockup.MsgLockTokens',
							value: {
								coins: [
									{ denom: 'gamm/pool/662', amount: '150616694306352086' },
								],
								owner: 'osmo1u6zt3tdezaa5qdwurd25ulthj7rl4q7zwwen9p',
								duration: '1209600s',
							},
							involved_account_addresses: ['osmo1u6zt3tdezaa5qdwurd25ulthj7rl4q7zwwen9p'],
							height: height || 1,
							hash: 'E1039C785DE54D3C9DF40B9B4B697C5B7E30A431B3EE857D1F8334CB7ED369A2',
							success: false,
						},
					],
					height: height || 1,
					logs: [],
				},
			],
		}

		// TODO: add logic to fetch block from kafka topic
		return null;
	}

	private async processTask2() {
		while (true) {
			await delay(1000);
			await Promise.all(
				this.opts.networks.map(async (network) => {
					const block = await this.requestBlock(network, this.networkConfig[network] ? this.networkConfig[network]! + 1 : null);
					if (!block) {
						// update status as pending
						return;
					}

					// update status as processing
					const allEvents = await Promise.all([
						this.processBlocks(block),
						this.processTxs(block),
						this.processMessages(block),
					])
					const events = allEvents.flat();

					console.log(events);


					// update status as done
					this.networkConfig[network] = block.height;

				})
			)

			console.log(this.networkConfig);
			fs.writeFileSync(this.opts.networkConfigFile || DEFAULT_NETWORK_CONFIG_PATH, JSON.stringify(this.networkConfig, null, 2), 'utf-8');
		}
	}

	private async processTask(msg: ConsumeMessage, channel: Channel) {
		try {
			const taskObj: { block: any, network: Network } = JSON.parse(String(msg.content)) // TODO: Can we use zod here? or it will be an overhead
			console.assert(this.opts.networks.includes(taskObj.network))
			const allEvents = await Promise.all([
				this.processBlocks(taskObj.block),
				this.processTxs(taskObj.block),
				this.processMessages(taskObj.block),
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

	private async processMessages(block: any): Promise<IRangeResult[]> {
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
