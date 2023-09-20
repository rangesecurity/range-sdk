import { IRangeNetwork } from './types/IRangeNetwork';
import { IRangeBlock } from './types/chain/IRangeBlock';
import { IRangeError, IRangeEvent } from './types/IRangeEvent';
import { IRangeMessage } from './types/chain/IRangeMessage';
import { IRangeTransaction } from './types/chain/IRangeTransaction';
import { Network } from './network';
import { CosmosClient } from './cosmos/CosmosClient';
import { assert } from 'console';
import { IRangeAlertRule } from './types/IRangeAlertRule';
import { ITaskPackage } from './types/IRangeTaskPackage';
import { fetchBlock } from './services/fetchBlock';
import { fetchAlertRules } from './services/fetchAlertRules';
import { taskAck } from './services/taskAck';
import { createAlertEvents } from './services/alertEvent';
import { getKafkaClient } from './connections/KafkaClient';
import { KafkaConsumerClient } from './connections/KafkaConsumer';
import { env } from './env';

export interface OnBlock {
  callback: (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ) => Promise<IRangeEvent[]>;
  filter?: {};
}
export interface OnTransaction {
  callback: (
    transaction: IRangeTransaction,
    rule: IRangeAlertRule,
    block: IRangeBlock,
  ) => Promise<IRangeEvent[]>;
  filter?: { success?: boolean };
}
export interface OnMessage {
  callback: (
    message: IRangeMessage,
    rule: IRangeAlertRule,
    block: IRangeBlock,
  ) => Promise<IRangeEvent[]>;
  filter?: {
    success?: boolean;
    types?: string[];
    addresses?: string[];
  };
}

export interface Options {
  token: string;
  networks: IRangeNetwork[];
  endpoints?: Partial<Record<Network, string>>;
  onBlock: OnBlock;
}

class RangeSDK {
  private opts: Options;
  private runnerId: string;
  private cosmosClients: Partial<Record<IRangeNetwork, CosmosClient>>;
  private blockRuleGroupTaskClient: KafkaConsumerClient;

  constructor(options: Options) {
    this.opts = options;
    this.cosmosClients = {};

    if (this.opts.endpoints) {
      for (const key of Object.keys(this.opts.endpoints)) {
        const networkKey = key as Network;
        const endpoint = this.opts.endpoints[networkKey];
        assert(endpoint, `Endpoint for network ${networkKey} is not defined`);
        this.cosmosClients[networkKey] = new CosmosClient(endpoint!);
      }
    }

    const [runnerId] = this.opts.token.split('.');
    this.runnerId = runnerId;

    const kafka = getKafkaClient();
    this.blockRuleGroupTaskClient = new KafkaConsumerClient(kafka, runnerId);
  }

  async init(): Promise<void> {
    const blockRuleGroupTaskQueue =
      await this.blockRuleGroupTaskClient.subscribeAndConsume(env.KAFKA_TOPIC);

    await blockRuleGroupTaskQueue.run({
      autoCommit: true,
      eachMessage: async ({ message, topic, partition }) => {
        const rawMessage = message?.value?.toString();
        if (!rawMessage) {
          console.error(`Error decoding incoming raw message: ${rawMessage}`);
          return;
        }

        const parseMessage: ITaskPackage = JSON.parse(rawMessage);
        await this.processMessage(parseMessage);
      },
    });
    console.info(
      `Blocks kafka consumer has started for topic: ${env.KAFKA_TOPIC}`,
    );

    process.on('SIGINT', async () => {
      console.log('Received SIGINT. Performing cleanup...');
      // Perform your cleanup actions here
      await this.blockRuleGroupTaskClient.gracefulShutdown();

      process.exit(0);
    });
  }

  protected async processMessage(taskPackage: ITaskPackage): Promise<void> {
    console.log('Received package:', taskPackage);

    const [rules, block] = await Promise.all([
      fetchAlertRules({
        token: this.opts.token,
        ruleGroupId: taskPackage.ruleGroupId,
      }),
      fetchBlock({
        token: this.opts.token,
        height: taskPackage.block.height,
        network: taskPackage.block.network,
      }).catch((err) => {
        // todo: log error while fetching block
        if (err?.response?.status === 404) {
          return null;
        }
        throw err;
      }),
    ]);

    // call the acknowledgement API and mark the package as done if block is not found or rule group is empty
    if (!block || rules.length === 0) {
      await taskAck({
        token: this.opts.token,
        block: taskPackage.block,
        ruleGroupId: taskPackage.ruleGroupId,
        runnerId: taskPackage.runnerId,
      });
      return;
    }

    const errors = await this.processBlockTask(block, rules);
    await taskAck({
      token: this.opts.token,
      block: taskPackage.block,
      ruleGroupId: taskPackage.ruleGroupId,
      runnerId: taskPackage.runnerId,
      ...(errors?.length
        ? {
            errors,
          }
        : {}),
    });
  }

  private async processBlockTask(
    block: IRangeBlock,
    rules: IRangeAlertRule[],
  ): Promise<IRangeError[]> {
    const events = await Promise.all(
      rules.map(async (rule) => {
        try {
          const ruleResults = await this.opts.onBlock.callback(block, rule);
          if (ruleResults.length) {
            await createAlertEvents({
              token: this.opts.token,
              workspaceId: rule.workspaceId,
              alertRuleId: rule.id,
              alerts: ruleResults,
            });
          }

          return [];
        } catch (error) {
          return [
            {
              ruleId: rule.id,
              error: String(error),
            },
          ];
        }
      }),
    );
    return events.flat().flat();
  }

  getCosmosClient(network: Network): CosmosClient {
    // TODO: we can add our proxy client here
    const client = this.cosmosClients[network];
    assert(client, `Cosmos client for network ${network} not found`);
    return client!;
  }

  getBlock(network: Network, height: number): Promise<IRangeBlock | null> {
    return Promise.resolve(null);
  }
}

export { RangeSDK };
