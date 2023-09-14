import { IRangeNetwork } from './types/IRangeNetwork'
import { IRangeBlock } from './types/chain/IRangeBlock'
import { IRangeError, IRangeResult, IRangeEvent } from "./types/IRangeEvent";
import { IRangeMessage } from './types/chain/IRangeMessage'
import { IRangeTransaction } from './types/chain/IRangeTransaction'
import { Network } from './network'
import { CosmosClient } from './cosmos/CosmosClient'
import { assert } from 'console'
import { env } from './env'
import { IRangeAlertRule } from './types/IRangeAlertRule'
import { ITaskPackage } from './types/IRangeTaskPackage'
import { fetchBlock } from './services/fetchBlock'
import { fetchAlertRules } from './services/fetchAlertRules'
import { KafkaClient } from './connections/KafkaClient'
import { taskAck } from './services/taskAck'
import { createAlertEvents } from './services/alertEvent'

export interface OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule
  ) => Promise<IRangeEvent[]>;
  filter?: {};
}
export interface OnTransaction {
  callback: (
    transaction: IRangeTransaction,
    rule: IRangeAlertRule,
    block: IRangeBlock
  ) => Promise<IRangeEvent[]>;
  filter?: { success?: boolean };
}
export interface OnMessage {
  callback: (
    message: IRangeMessage,
    rule: IRangeAlertRule,
    block: IRangeBlock
  ) => Promise<IRangeEvent[]>;
  filter?: {
    success?: boolean;
    types?: string[];
    addresses?: string[];
  };
}

export interface Options {
	token: string
	networks: IRangeNetwork[],
	endpoints?: Partial<Record<Network, string>>,
	onBlock: OnBlock,
}

class RangeSDK extends KafkaClient<ITaskPackage>{
	private opts: Options
	private cosmosClients: Partial<Record<IRangeNetwork, CosmosClient>>

	constructor(options: Options) {
		super(options.networks.map(n => env.KAFKA_TOPIC))

		this.opts = options
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

	async init(): Promise<void> {
		this.listen();

		process.on('SIGINT', async () => {
			console.log('Received SIGINT. Performing cleanup...');
			// Perform your cleanup actions here
			await this.close();
			process.exit(0);
		});
	}

	protected async processMessage(taskPackage: ITaskPackage): Promise<void> {
		console.log("Received package:", taskPackage);

		const [rules, block] = await Promise.all([
			fetchAlertRules({
				token: this.opts.token,
				ruleGroupId: taskPackage.ruleGroupId,
			}),
			fetchBlock({
				token: this.opts.token,
				height: taskPackage.block.height,
				network: taskPackage.block.network
			}).catch(err => {
				// todo: log error while fetching block
				return null;
			}),
    	]);

		if (!block) {
			// Update 
			// call the acknowledgement API
			return
		}

		const errors = await this.processBlockTask(block, rules);
		await taskAck({
			token: this.opts.token,
			block: taskPackage.block,
			ruleGroupId: taskPackage.ruleGroupId,
			...(errors?.length ? {
				errors
			}: {})
		})
	}

	private async processBlockTask(block: IRangeBlock, rules: IRangeAlertRule[]): Promise<IRangeError[]> {
		const events = await Promise.all(rules.map(async (rule) => {
			try {
				const ruleResults = await this.opts.onBlock.callback(block, rule)
				const alertRes = await createAlertEvents({
					token: this.opts.token,
					workspaceId: rule.workspaceId,
					alertRuleId: rule.id,
					alerts: ruleResults
				})

				return [];
			} catch (error) {
				return [{
					ruleId: rule.id,
					error: String(error)
				}]
			}
		}))
		return events.flat().flat();
	}

	// private async processTxTask(block: IRangeBlock, rules: IRangeAlertRule[]): Promise<IRangeResult[]> {
	// 	if (!this.opts.onTransactions || this.opts.onTransactions.length === 0) {
	// 		return []
	// 	}


	// 	const allEvents = await Promise.all(
	// 		this.opts.onTransactions.map(async (onTx) => {
	// 			let filteredTxs = block.transactions;

	// 			if (onTx.filter?.success !== undefined) {
	// 				filteredTxs = filteredTxs.filter((tx: any) => tx.success === onTx.filter?.success)
	// 			}

	// 			const events = await Promise.all(filteredTxs.map(async (tx: any) => {
	// 				const events = await Promise.all(rules.map(rule => {
	// 					return onTx.callback(tx, rule, block)
	// 				}))
	// 				return events;
	// 			}))

	// 			return events.flat();
	// 		})
	// 	);

	// 	const processedEvents: IRangeResult[] = allEvents.flat().filter((x): x is IRangeResult => x !== null && x !== undefined);
	// 	return processedEvents;
	// }

	// private async processTxMessageTask(block: IRangeBlock, rules: IRangeAlertRule[]): Promise<IRangeResult[]> {
	// 	if (!this.opts.onMessages || this.opts.onMessages.length === 0) {
	// 		return []
	// 	}

	// 	const allEvents = await Promise.all(
	// 		this.opts.onMessages.map(async (onMessage) => {
	// 			let filteredTxs = block.transactions;
	// 			if (onMessage.filter?.success !== undefined) {
	// 				filteredTxs = filteredTxs.filter((tx: any) => tx.success === onMessage.filter?.success)
	// 			}

	// 			let allMessages = filteredTxs.flatMap((tx: any) => tx.messages)
	// 			if (onMessage.filter?.types) {
	// 				allMessages = allMessages.filter((m: any) => onMessage.filter?.types?.includes(m.type))
	// 			}

	// 			if (onMessage.filter?.addresses) {
	// 				allMessages = allMessages.filter((m: any) => m.involved_account_addresses.some(
	// 					(addr: string) => onMessage.filter?.addresses?.includes(addr)
	// 				));
	// 			}


	// 			const allEvents = await Promise.all(
	// 				allMessages.map(async (m: any) => {
	// 					const events = await Promise.all(rules.map(rule => {
	// 						return onMessage.callback(m, rule, block)
	// 					}))
	// 					return events;
	// 				})
	// 			)

	// 			return allEvents.flat();
	// 		})
	// 	)

	// 	const processedEvents = allEvents.flat().filter((x): x is IRangeResult => x !== null && x !== undefined);
	// 	return processedEvents;
	// }

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
