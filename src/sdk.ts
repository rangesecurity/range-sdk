import dayjs from 'dayjs';
import { Kafka } from 'kafkajs';
import { IRangeBlock } from './types/chain/IRangeBlock';
import { IRangeError, ISubEvent } from './types/IRangeEvent';
import { IRangeAlertRule } from './types/IRangeAlertRule';
import {
  BlockRuleGroupTaskPackage,
  ErrorBlockRuleTaskPackage,
  TickRuleGroupTaskPackage,
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
import { tickTaskAck } from './services/tickTaskAck';

const logger = getLogger({ name: 'rangeSDK' });

export interface OnBlock {
  callback: (block: IRangeBlock, rule: IRangeAlertRule) => Promise<ISubEvent[]>;
}

export interface OnTick {
  callback: (timestamp: string, rule: IRangeAlertRule) => Promise<ISubEvent[]>;
}

export interface RangeSDKOptions {
  token: string;
}

export interface RangeSDKInitOptions {
  onBlock?: OnBlock;
  onTick?: OnTick;
}

export interface IRangeSDK {
  init(initOpts: RangeSDKInitOptions): Promise<void>;
  gracefulCleanup(): Promise<void>;
}

class RangeSDK implements IRangeSDK {
  private opts: RangeSDKOptions;
  private initOpts?: RangeSDKInitOptions;
  private config?: IRangeConfig;

  private blockRuleGroupTaskClient?: KafkaConsumerClient;
  private errorBlockRuleTaskClient?: KafkaConsumerClient;
  private tickRuleGroupTaskClient?: KafkaConsumerClient;

  constructor(opts: RangeSDKOptions) {
    this.opts = opts;
    const [runnerId] = this.opts.token.split('.');
    logger.info(
      `Initiating rangeSDK for runnerID: ${runnerId}, manager: ${constants.MANAGER_SERVICE.DOMAIN}`,
    );
  }

  async init(initOpts: RangeSDKInitOptions): Promise<void> {
    if (!initOpts.onBlock && !initOpts.onTick) {
      throw new Error(
        'At least one of the callbacks (onBlock or onTick) are required to initialise the sdk',
      );
    }

    /**
     * Fetch config from the manager and setup task queues
     */
    this.config = await fetchConfig({ token: this.opts.token });
    this.initOpts = initOpts;

    const kafka = new Kafka(this.config.kafka);
    this.blockRuleGroupTaskClient = new KafkaConsumerClient(
      kafka,
      this.config.kafkaGroupIds.blockRuleGroupTasks,
      {
        retries: 3,
      },
    );
    this.errorBlockRuleTaskClient = new KafkaConsumerClient(
      kafka,
      this.config.kafkaGroupIds.errorsBlockRuleTasks,
      {
        retries: 0,
      },
    );
    this.tickRuleGroupTaskClient = new KafkaConsumerClient(
      kafka,
      this.config.kafkaGroupIds.tickRuleGroupTasks,
      {
        retries: 0,
      },
    );

    await this.initBlockRuleGroupTaskQueue();
    await this.initErrorBlockRuleTaskQueue();
    await this.initTickRuleGroupTaskQueue();
  }

  static async build(
    sdkOpts: RangeSDKOptions,
    sdkInitOpts: RangeSDKInitOptions,
  ) {
    const sdk = new RangeSDK(sdkOpts);
    await sdk.init(sdkInitOpts);
    return sdk;
  }

  private async initBlockRuleGroupTaskQueue() {
    if (!this.config) {
      throw new Error('SDK not initiated, config missing');
    }
    if (!this.blockRuleGroupTaskClient) {
      throw new Error('SDK not initiated, blockRuleGroupTaskClient missing');
    }
    if (!this.initOpts) {
      throw new Error('SDK init called without options');
    }

    if (
      Object.prototype.hasOwnProperty.call(this.initOpts, 'onBlock') ===
        false ||
      this.initOpts.onBlock === undefined ||
      this.initOpts.onBlock === null
    ) {
      logger.warn({ message: 'Missing handler for block based alert rules' });
      this.initOpts.onBlock = {
        callback: async (block, rule) => {
          logger.error({
            message: `Missing handler for block based alert rules. Block: network: ${block.network}, height: ${block.height}, Rule: type: ${rule.ruleType}, id: ${rule.id}`,
          });
          return [];
        },
      };
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
      logger.warn({ block, rules }, 'Early task package ack');
      await taskAck({
        token: this.opts.token,
        block: taskPackage.block,
        ruleGroupId: taskPackage.ruleGroupId,
        runnerId: taskPackage.runnerId,
        alertEventsCount: 0,
      });
      return;
    }

    const { errors, alertEventsCount } = await this.processBlockTask(
      block,
      rules,
    );
    await taskAck({
      token: this.opts.token,
      block: taskPackage.block,
      ruleGroupId: taskPackage.ruleGroupId,
      runnerId: taskPackage.runnerId,
      alertEventsCount,
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

    const { errors } = await this.processBlockTask(block, [rule]);
    await errorTaskAck({
      token: this.opts.token,
      errorId: taskPackage.errorId,
      ...(errors.length
        ? {
            error: errors[0].error,
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
  ): Promise<{ errors: IRangeError[]; alertEventsCount: number }> {
    const events = await Promise.all(
      rules.map(
        async (
          rule,
        ): Promise<{ errors: IRangeError[]; alertEventsCount: number }> => {
          try {
            if (!this.initOpts) {
              throw new Error('SDK Init not called, onBlock missing');
            }
            if (!this.initOpts.onBlock) {
              throw new Error('Missing handler for block based alert rules');
            }

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
              logger.warn(
                {
                  block: {
                    network: block.network,
                    height: block.height,
                    timestamp: block.timestamp,
                  },
                  rule: rule,
                  condition: {
                    blockYoungerOrSameThanRuleCreation:
                      blockTimestamp.isAfter(rule.createdAt) ||
                      blockTimestamp.isSame(rule.createdAt),
                    blockOlderThanRuleDeletedAt: blockTimestamp.isBefore(
                      rule.deletedAt || '2100-01-01T00:00:00.000',
                    ),
                  },
                },
                `rule processing skipped as timestamp conditions fail`,
              );
              return { errors: [], alertEventsCount: 0 };
            }

            const ruleSubResults =
              (await this.initOpts.onBlock.callback(block, rule)) || [];
            const ruleResults = ruleSubResults.map((subResult) => ({
              ...subResult,
              workspaceId: rule.workspaceId || null,
              alertRuleId: rule.id,
              time: block.timestamp,
              blockNumber: String(block.height),
              network: block.network,
              txHash: subResult.txHash || '',
              addressesInvolved: subResult.addressesInvolved || [],
            }));

            if (!ruleResults.length) {
              return { errors: [], alertEventsCount: 0 };
            }

            await createAlertEvents({
              token: this.opts.token,
              workspaceId: rule.workspaceId || null,
              alertRuleId: rule.id,
              ruleGroupId: rule.ruleGroupId,
              alerts: ruleResults,
            });

            return { errors: [], alertEventsCount: ruleResults.length };
          } catch (error) {
            let err = String(error);
            if (error instanceof Error) {
              err = error.message + error.stack ? `\n${error.stack}` : '';
            }

            return {
              errors: [
                {
                  ruleId: rule.id,
                  error: err,
                },
              ],
              alertEventsCount: 0,
            };
          }
        },
      ),
    );

    return {
      errors: events.flat().flatMap((obj) => obj.errors),
      alertEventsCount: events.flat().reduce((alertEventsCount, obj) => {
        return obj.alertEventsCount + alertEventsCount;
      }, 0),
    };
  }

  private async initTickRuleGroupTaskQueue() {
    if (!this.config) {
      throw new Error('SDK not initiated, config missing');
    }
    if (!this.tickRuleGroupTaskClient) {
      throw new Error('SDK not initiated, tickRuleGroupTaskClient missing');
    }
    if (!this.initOpts) {
      throw new Error('SDK init called without options');
    }

    if (
      Object.prototype.hasOwnProperty.call(this.initOpts, 'onTick') === false ||
      this.initOpts.onTick === undefined ||
      this.initOpts.onTick === null
    ) {
      logger.warn({ message: 'Missing handler for tick based alert rules' });
      this.initOpts.onTick = {
        callback: async (timestamp, rule) => {
          logger.error({
            message: `Missing handler for tick based alert rules. Timestamp: ${timestamp}, Rule: type: ${rule.ruleType}, id: ${rule.id}`,
          });
          return [];
        },
      };
    }

    const kafkaTopic = this.config.kafkaTopics.tickRuleGroupTasks;
    const tickRuleGroupTaskClient =
      await this.tickRuleGroupTaskClient.subscribeAndConsume(kafkaTopic);

    await tickRuleGroupTaskClient.run({
      autoCommit: true,
      eachMessage: async ({ message }) => {
        const rawMessage = message?.value?.toString();
        if (!rawMessage) {
          logger.error(`Error decoding incoming raw message: ${rawMessage}`);
          return;
        }

        const parseMessage: TickRuleGroupTaskPackage = JSON.parse(rawMessage);
        await this.tickRuleGroupTaskQueueHandler(parseMessage);
      },
    });
    logger.info(
      `Tick Rule Group Task Queue has started on topic: ${kafkaTopic}`,
    );
  }

  private async tickRuleGroupTaskQueueHandler(
    taskPackage: TickRuleGroupTaskPackage,
  ): Promise<void> {
    const rules = await fetchAlertRulesByRuleGroupID({
      token: this.opts.token,
      ruleGroupId: taskPackage.ruleGroupId,
    });

    // call the acknowledgement API and mark the package as done if rule group is empty
    if (rules.length === 0) {
      logger.warn({ rules }, 'Early task package ack');
      await tickTaskAck({
        token: this.opts.token,
        timestamp: taskPackage.timestamp,
        ruleGroupId: taskPackage.ruleGroupId,
        runnerId: taskPackage.runnerId,
        alertEventsCount: 0,
      });
      return;
    }

    const { errors, alertEventsCount } = await this.processTickTask(
      taskPackage.timestamp,
      rules,
    );
    await tickTaskAck({
      token: this.opts.token,
      timestamp: taskPackage.timestamp,
      ruleGroupId: taskPackage.ruleGroupId,
      runnerId: taskPackage.runnerId,
      alertEventsCount,
      ...(errors?.length
        ? {
            errors,
          }
        : {}),
    });
  }

  private async processTickTask(
    timestamp: string,
    rules: IRangeAlertRule[],
  ): Promise<{ errors: IRangeError[]; alertEventsCount: number }> {
    const events = await Promise.all(
      rules.map(
        async (
          rule,
        ): Promise<{ errors: IRangeError[]; alertEventsCount: number }> => {
          try {
            if (!this.initOpts) {
              throw new Error('SDK Init not called, onBlock missing');
            }
            if (!this.initOpts.onTick) {
              throw new Error('Missing handler for tick based alert rules');
            }

            const ruleSubResults =
              (await this.initOpts.onTick.callback(timestamp, rule)) || [];
            const ruleResults = ruleSubResults.map((subResult) => ({
              ...subResult,
              workspaceId: rule.workspaceId || null,
              alertRuleId: rule.id,
              time: timestamp,
              network: rule.network,
              txHash: subResult.txHash || '',
              addressesInvolved: subResult.addressesInvolved || [],
            }));

            if (!ruleResults.length) {
              return { errors: [], alertEventsCount: 0 };
            }

            await createAlertEvents({
              token: this.opts.token,
              workspaceId: rule.workspaceId || null,
              alertRuleId: rule.id,
              ruleGroupId: rule.ruleGroupId,
              alerts: ruleResults,
            });

            return { errors: [], alertEventsCount: ruleResults.length };
          } catch (error) {
            let err = String(error);
            if (error instanceof Error) {
              err = error.message + error.stack ? `\n${error.stack}` : '';
            }

            return {
              errors: [
                {
                  ruleId: rule.id,
                  error: err,
                },
              ],
              alertEventsCount: 0,
            };
          }
        },
      ),
    );

    return {
      errors: events.flat().flatMap((obj) => obj.errors),
      alertEventsCount: events.flat().reduce((alertEventsCount, obj) => {
        return obj.alertEventsCount + alertEventsCount;
      }, 0),
    };
  }

  async gracefulCleanup() {
    logger.info('Shutting down range sdk');

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
    if (this.tickRuleGroupTaskClient) {
      await this.tickRuleGroupTaskClient.gracefulShutdown();
    }
  }
}

export { RangeSDK };
