import { IRangeNetwork } from './types/IRangeNetwork'
import { IRangeBlock } from './types/chain/IRangeBlock'
import { IRangeResult, MaybeIRangeResult } from './types/IRangeEvent'
import { IRangeMessage } from './types/chain/IRangeMessage'
import { IRangeTransaction } from './types/chain/IRangeTransaction'
import { Network } from './network'
import { CosmosClient } from './cosmos/CosmosClient'
import { assert } from 'console'
import { env } from './env'
import { WorkPackageQueue } from './connections/WorkPackageQueue'
import { IRangeAlertRule } from './types/IRangeAlertRule'
import { ConsumeMessage } from 'amqplib'
import { ITaskPackage } from './types/IRangeTaskPackage'
import { fetchBlock } from './services/fetchBlock'
import { fetchAlertRules } from './services/fetchAlertRules'

export interface OnBlock {
	callback: (block: IRangeBlock, rule: IRangeAlertRule) => Promise<MaybeIRangeResult>
	filter?: {},
}
export interface OnTransaction {
	callback: (transaction: IRangeTransaction, rule: IRangeAlertRule, block: IRangeBlock) => Promise<MaybeIRangeResult>
	filter?: { success?: boolean }
}
export interface OnMessage {
	callback: (message: IRangeMessage, rule: IRangeAlertRule, block: IRangeBlock) => Promise<MaybeIRangeResult>
	filter?: {
		success?: boolean,
		types?: string[],
		addresses?: string[]
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
	private workQueue: WorkPackageQueue
	private cosmosClients: Partial<Record<IRangeNetwork, CosmosClient>>

	constructor(options: Options) {
		this.opts = options
		this.cosmosClients = {};
		this.workQueue = new WorkPackageQueue(env.AMQP_HOST)

		if (this.opts.endpoints) {
			for (const key of Object.keys(this.opts.endpoints)) {
				const networkKey = key as Network;
				const endpoint = this.opts.endpoints[networkKey];
				assert(endpoint, `Endpoint for network ${networkKey} is not defined`)
				this.cosmosClients[networkKey] = new CosmosClient(endpoint!);
			}
		}
	}

	async init(): Promise<void> {
		await this.workQueue.connect();
		this.workQueue.listen((x: any) => this.processMessage(x));

		process.on('SIGINT', async () => {
			console.log('Received SIGINT. Performing cleanup...');
			// Perform your cleanup actions here
			await this.workQueue.close();
			process.exit(0);
		});
	}

	protected async processMessage(taskPackage: ITaskPackage): Promise<void> {
		console.log("Received package:", taskPackage);

		const block = await fetchBlock(taskPackage.blockNumber, taskPackage.network);
		if (!block) {
			console.log("Block not found");
			return;
		}

		const rules = await fetchAlertRules(taskPackage.ruleGroupId);

		const allEvents = await Promise.all([
			this.processBlockTask(block!, rules),
			this.processTxTask(block!, rules),
			this.processTxMessageTask(block!, rules)
		])

		const events = allEvents.flat();

		if (events.length > 0) {
			this.workQueue.reply(events); // storing into database
		}

		// const hasError = events.some(e => (e.details as any).error !== undefined)

		// if (hasError) {
		// 	console.log("[error][", block.network, "]:", block.height, "events: ", events.length);
		// 	events;
		// }
		// console.log("[", block.network, "]:", block.height, "events: ", events.length);
		// events
	}

	private async processBlockTask(block: IRangeBlock, rules: IRangeAlertRule[]): Promise<IRangeResult[]> {
		if (!this.opts.onBlocks || this.opts.onBlocks.length === 0) {
			return []
		}

		const allEvents = await Promise.all(
			this.opts.onBlocks.map(async (onBlock) => {
				const events = await Promise.all(rules.map(rule => {
					return onBlock.callback(block, rule)
				}))
				return events;
			})
		)

		const processedEvents: IRangeResult[] = allEvents.flat().filter((x): x is IRangeResult => x !== null && x !== undefined);
		return processedEvents;
	}

	private async processTxTask(block: IRangeBlock, rules: IRangeAlertRule[]): Promise<IRangeResult[]> {
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
					const events = await Promise.all(rules.map(rule => {
						return onTx.callback(tx, rule, block)
					}))
					return events;
				}))

				return events.flat();
			})
		);

		const processedEvents: IRangeResult[] = allEvents.flat().filter((x): x is IRangeResult => x !== null && x !== undefined);
		return processedEvents;
	}

	private async processTxMessageTask(block: IRangeBlock, rules: IRangeAlertRule[]): Promise<IRangeResult[]> {
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

				if (onMessage.filter?.addresses) {
					allMessages = allMessages.filter((m: any) => m.involved_account_addresses.some(
						(addr: string) => onMessage.filter?.addresses?.includes(addr)
					));
				}


				const allEvents = await Promise.all(
					allMessages.map(async (m: any) => {
						const events = await Promise.all(rules.map(rule => {
							return onMessage.callback(m, rule, block)
						}))
						return events;
					})
				)

				return allEvents.flat();
			})
		)

		const processedEvents = allEvents.flat().filter((x): x is IRangeResult => x !== null && x !== undefined);
		return processedEvents;
	}

	getCosmosClient(network: Network): CosmosClient {
		// TODO: we can add our proxy client here
		const client = this.cosmosClients[network]
		assert(client, `Cosmos client for network ${network} not found`)
		return client!
	}

	getBlock(network: Network, height: number): Promise<IRangeBlock | null> {
		return Promise.resolve(null);
	}
}

export { RangeSDK } 
