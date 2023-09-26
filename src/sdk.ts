import dayjs from 'dayjs';
import { Kafka } from 'kafkajs';
import { IRangeNetwork } from './types/IRangeNetwork';
import { IRangeBlock } from './types/chain/IRangeBlock';
import { IRangeError, ISubEvent } from './types/IRangeEvent';
import { IRangeMessage } from './types/chain/IRangeMessage';
import { IRangeTransaction } from './types/chain/IRangeTransaction';
import { Network } from './network';
import { CosmosClient } from './cosmos/CosmosClient';
import { assert } from 'console';
import { IRangeAlertRule } from './types/IRangeAlertRule';
import {
  BlockRuleGroupTaskPackage,
  ErrorBlockRuleTaskPackage,
} from './types/IRangeTaskPackage';
import { fetchBlock } from './services/fetchBlock';
import {
  fetchAlertRuleByRuleGroupAndRuleID,
  fetchAlertRulesByRuleGroupID,
} from './services/fetchAlertRules';
import { errorTaskAck, taskAck } from './services/taskAck';
import { createAlertEvents } from './services/alertEvent';
import { KafkaConsumerClient } from './connections/KafkaConsumer';
import { IRangeConfig } from './types/IRangeConfig';
import { fetchConfig } from './services/fetchConfig';
import { getLogger } from './logger';
import { constants } from './constants';

const logger = getLogger({ name: 'rangeSDK' });

export interface OnBlock {
  callback: (block: IRangeBlock, rule: IRangeAlertRule) => Promise<ISubEvent[]>;
  filter?: {};
}
export interface OnTransaction {
  callback: (
    transaction: IRangeTransaction,
    rule: IRangeAlertRule,
    block: IRangeBlock,
  ) => Promise<ISubEvent[]>;
  filter?: { success?: boolean };
}
export interface OnMessage {
  callback: (
    message: IRangeMessage,
    rule: IRangeAlertRule,
    block: IRangeBlock,
  ) => Promise<ISubEvent[]>;
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
  private config?: IRangeConfig;
  private blockRuleGroupTaskClient?: KafkaConsumerClient;
  private errorBlockRuleTaskClient?: KafkaConsumerClient;

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

    logger.info(
      `Initiating rangeSDK for runnerID: ${runnerId}, manager: ${constants.MANAGER_SERVICE.DOMAIN}`,
    );
  }

  async init(): Promise<void> {
    /**
     * Fetch config from the manager and setup task queues
     */
    this.config = await fetchConfig({ token: this.opts.token });
    const kafka = new Kafka(this.config.kafka);
    this.blockRuleGroupTaskClient = new KafkaConsumerClient(
      kafka,
      `rangeSDK-runner-${this.runnerId}-block-rule-group-task`,
      {
        retries: 3,
      },
    );
    this.errorBlockRuleTaskClient = new KafkaConsumerClient(
      kafka,
      `rangeSDK-runner-${this.runnerId}-error-block-rule-task`,
      {
        retries: 0,
      },
    );
    await this.initBlockRuleGroupTaskQueue();
    await this.initErrorBlockRuleTaskQueue();

    process.on('SIGINT', async () => {
      logger.info('Received SIGINT. Performing cleanup...');
      await this.gracefulCleanup();
    });
    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM. Performing cleanup...');
      await this.gracefulCleanup();
    });
  }

  static async build(options: Options) {
    const sdk = new RangeSDK(options);
    await sdk.init();
    return sdk;
  }

  private async initBlockRuleGroupTaskQueue() {
    if (!this.config) {
      throw new Error('SDK not initiated, config missing');
    }
    if (!this.blockRuleGroupTaskClient) {
      throw new Error('SDK not initiated, blockRuleGroupTaskClient missing');
    }

    const kafkaTopic = this.config.kafkaTopics.blockRuleGroupTasks;
    const blockRuleGroupTaskQueue =
      await this.blockRuleGroupTaskClient.subscribeAndConsume(kafkaTopic);

    await blockRuleGroupTaskQueue.run({
      autoCommit: true,
      eachMessage: async ({ message }) => {
        const rawMessage = message?.value?.toString();
        if (!rawMessage) {
          logger.error(`Error decoding incoming raw message: ${rawMessage}`);
          return;
        }

        const parseMessage: BlockRuleGroupTaskPackage = JSON.parse(rawMessage);
        await this.blockRuleGroupTaskQueueHandler(parseMessage);
      },
    });
    logger.info(
      `Block Rule Group Task Queue has started on topic: ${kafkaTopic}`,
    );
  }

  private async blockRuleGroupTaskQueueHandler(
    taskPackage: BlockRuleGroupTaskPackage,
  ): Promise<void> {
    logger.info('Received package:', taskPackage);

    const [rules, block] = await Promise.all([
      fetchAlertRulesByRuleGroupID({
        token: this.opts.token,
        ruleGroupId: taskPackage.ruleGroupId,
      }),
      fetchBlock({
        token: this.opts.token,
        height: taskPackage.block.height,
        network: taskPackage.block.network,
      }).catch((err) => {
        logger.error(
          err,
          `Error while fetching block: network:: ${taskPackage.block.network}, height:: ${taskPackage.block.height}`,
        );
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

  private async initErrorBlockRuleTaskQueue() {
    if (!this.config) {
      throw new Error('SDK not initiated, config missing');
    }
    if (!this.errorBlockRuleTaskClient) {
      throw new Error('SDK not initiated, errorBlockRuleTaskClient missing');
    }

    const kafkaTopic = this.config.kafkaTopics.errorsBlockRuleTasks;
    const errorBlockRuleTaskQueue =
      await this.errorBlockRuleTaskClient.subscribeAndConsume(kafkaTopic);
    await errorBlockRuleTaskQueue.run({
      autoCommit: true,
      eachMessage: async ({ message }) => {
        const rawMessage = message?.value?.toString();
        if (!rawMessage) {
          logger.error(`Error decoding incoming raw message: ${rawMessage}`);
          return;
        }

        const parseMessage: ErrorBlockRuleTaskPackage = JSON.parse(rawMessage);
        await this.errorBlockRuleTaskQueueHandler(parseMessage);
      },
    });
    logger.info(
      `Error Block Rule Task Queue has started on topic: ${kafkaTopic}`,
    );
  }

  private async errorBlockRuleTaskQueueHandler(
    taskPackage: ErrorBlockRuleTaskPackage,
  ) {
    logger.info('Error package:', taskPackage);

    const [rule, block] = await Promise.all([
      fetchAlertRuleByRuleGroupAndRuleID({
        token: this.opts.token,
        ruleGroupId: taskPackage.ruleGroupId,
        ruleId: taskPackage.ruleId,
      }),
      fetchBlock({
        token: this.opts.token,
        height: taskPackage.blockNumber,
        network: taskPackage.network,
      }).catch((err) => {
        logger.error(
          err,
          `Error while fetching block: network:: ${taskPackage.network}, height:: ${taskPackage.blockNumber}`,
        );
        if (err?.response?.status === 404) {
          return null;
        }
        throw err;
      }),
    ]);

    // call the error task acknowledgement API and mark the error task as non retry-able
    if (!block || !rule) {
      const e = !block
        ? `Block Not Found: network: ${taskPackage.network}, height: ${taskPackage.blockNumber}`
        : `Rule Not Found: id: ${taskPackage.ruleId}`;
      await errorTaskAck({
        token: this.opts.token,
        errorId: taskPackage.errorId,
        error: e,
        retry: false,
      });
      return;
    }

    const [error] = await this.processBlockTask(block, [rule]);
    await errorTaskAck({
      token: this.opts.token,
      errorId: taskPackage.errorId,
      ...(error
        ? {
          error: error.error,
          retry: true,
        }
        : {
          retry: false,
        }),
    });
  }

  private async processBlockTask(
    block: IRangeBlock,
    rules: IRangeAlertRule[],
  ): Promise<IRangeError[]> {
    const events = await Promise.all(
      rules.map(async (rule) => {
        try {
          const blockTimestamp = dayjs(block.timestamp);
          if (
            !(
              (blockTimestamp.isAfter(rule.createdAt) ||
                blockTimestamp.isSame(rule.createdAt)) &&
              blockTimestamp.isBefore(
                rule.deletedAt || '2100-01-01T00:00:00.000',
              )
            )
          ) {
            logger.info(
              `Skipping processing of network block for rule:id: "${rule.id}" as it's not between the valid timeline.
              Block timestamp: ${block.timestamp}, rule:createdAt: ${rule.createdAt}, rule:deletedAt: ${rule.deletedAt}`,
            );
            return [];
          }

          const ruleSubResults = await this.opts.onBlock.callback(block, rule);
          const ruleResults = ruleSubResults.map((subResult) => ({
            ...subResult,
            workspaceId: rule.workspaceId,
            alertRuleId: rule.id,
            time: block.timestamp,
            blockNumber: String(block.height),
            network: block.network,
          }));

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
          let err = String(error);
          if (error instanceof Error) {
            err = error.message + error.stack ? `\n${error.stack}` : '';
          }

          return [
            {
              ruleId: rule.id,
              error: err,
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

  private async gracefulCleanup() {
    await new Promise((res) =>
      setTimeout(async () => {
        if (this.blockRuleGroupTaskClient) {
          await this.blockRuleGroupTaskClient.gracefulShutdown();
        }
        res(null);
      }, 1000),
    );

    if (this.errorBlockRuleTaskClient) {
      await this.errorBlockRuleTaskClient.gracefulShutdown();
    }
  }
}

export { RangeSDK };
