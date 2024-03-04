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
  onBlock: OnBlock;
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
    const start = dayjs();
    logger.info(
      taskPackage,
      `Received task package, timestamp: ${start.toISOString()}`,
    );

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

    logger.info(
      taskPackage,
      `block and alert rules fetched successfully, time taken: ${dayjs().diff(
        start,
        'milliseconds',
      )} ms`,
    );

    // call the acknowledgement API and mark the package as done if block is not found or rule group is empty
    if (!block || rules.length === 0) {
      logger.warn({ block, rules }, 'Early task package ack');
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
    logger.info(
      taskPackage,
      `block processed successfully, time taken: ${dayjs().diff(
        start,
        'milliseconds',
      )} ms`,
    );
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
    logger.info(taskPackage, `Error package`);

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
          const start = dayjs();
          logger.info(
            {
              block: { network: block.network, height: block.height },
              rule,
            },
            `Process started for block with rule. timestamp: ${start.toISOString()}`,
          );

          if (!this.initOpts) {
            throw new Error('SDK Init not called, onBlock missing');
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
            return [];
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
          }));

          if (!ruleResults.length) {
            logger.info(
              {
                block: { network: block.network, height: block.height },
                rule,
              },
              `block and alert rule processed successfully with zero alert events, time taken: ${dayjs().diff(
                start,
                'milliseconds',
              )} ms`,
            );
            return [];
          }

          await createAlertEvents({
            token: this.opts.token,
            workspaceId: rule.workspaceId || null,
            alertRuleId: rule.id,
            alerts: ruleResults,
          });
          logger.info(
            {
              block: { network: block.network, height: block.height },
              rule,
            },
            `block and alert rule processed successfully with alert events, time taken: ${dayjs().diff(
              start,
              'milliseconds',
            )} ms`,
          );

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
        callback: async () => {
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
    const start = dayjs();
    logger.info(
      taskPackage,
      `Received task package, timestamp: ${start.toISOString()}`,
    );

    const rules = await fetchAlertRulesByRuleGroupID({
      token: this.opts.token,
      ruleGroupId: taskPackage.ruleGroupId,
    });

    logger.info(
      taskPackage,
      `alert rules fetched successfully, time taken: ${dayjs().diff(
        start,
        'milliseconds',
      )} ms`,
    );

    // call the acknowledgement API and mark the package as done if rule group is empty
    if (rules.length === 0) {
      logger.warn({ rules }, 'Early task package ack');
      await tickTaskAck({
        token: this.opts.token,
        timestamp: taskPackage.timestamp,
        ruleGroupId: taskPackage.ruleGroupId,
        runnerId: taskPackage.runnerId,
      });
      return;
    }

    const errors = await this.processTickTask(taskPackage.timestamp, rules);
    await tickTaskAck({
      token: this.opts.token,
      timestamp: taskPackage.timestamp,
      ruleGroupId: taskPackage.ruleGroupId,
      runnerId: taskPackage.runnerId,
      ...(errors?.length
        ? {
            errors,
          }
        : {}),
    });
    logger.info(
      taskPackage,
      `tick processed successfully, time taken: ${dayjs().diff(
        start,
        'milliseconds',
      )} ms`,
    );
  }

  private async processTickTask(
    timestamp: string,
    rules: IRangeAlertRule[],
  ): Promise<IRangeError[]> {
    const events = await Promise.all(
      rules.map(async (rule) => {
        try {
          const start = dayjs();
          logger.info(
            {
              timestamp,
              rule,
            },
            `Process started for tick: ${timestamp} with rule. execution timestamp: ${start.toISOString()}`,
          );

          if (!this.initOpts) {
            throw new Error('SDK Init not called, onBlock missing');
          }
          if (!this.initOpts.onTick) {
            throw new Error('Missing handler for tick based alert rules');
          }

          if (dayjs().subtract(5, 'seconds').isAfter(timestamp)) {
            logger.warn(
              {
                timestamp,
                rule: rule,
              },
              `tick processing skipped as timestamp is in past at time of execution`,
            );
            return [];
          }

          const ruleSubResults =
            (await this.initOpts.onTick.callback(timestamp, rule)) || [];
          const ruleResults = ruleSubResults.map((subResult) => ({
            ...subResult,
            workspaceId: rule.workspaceId || null,
            alertRuleId: rule.id,
            time: timestamp,
          }));

          if (!ruleResults.length) {
            logger.info(
              {
                timestamp,
                rule,
              },
              `tick and alert rule processed successfully with zero alert events, time taken: ${dayjs().diff(
                start,
                'milliseconds',
              )} ms`,
            );
            return [];
          }

          await createAlertEvents({
            token: this.opts.token,
            workspaceId: rule.workspaceId || null,
            alertRuleId: rule.id,
            alerts: ruleResults,
          });
          logger.info(
            {
              timestamp,
              rule,
            },
            `tick and alert rule processed successfully with alert events, time taken: ${dayjs().diff(
              start,
              'milliseconds',
            )} ms`,
          );

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
  }
}

export { RangeSDK };
