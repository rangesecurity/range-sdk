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

export interface RuleMetrics {
  type: string;

  execCount: number;
  execMinTimeMS: number;
  execMaxTimeMS: number;
  execTotalTimeMS: number;

  alertEventCount: number;
  alertEventMinTimeMS: number;
  alertEventMaxTimeMS: number;
  alertEventTotalTimeMS: number;
}

export interface RuleGroupProcessingMetrics {
  endToEndCount: number;
  endToEndMinTimeMS: number;
  endToEndMaxTimeMS: number;
  endToEndTotalTimeMS: number;

  fetchRulesCount: number;
  fetchRulesMinTimeMS: number;
  fetchRulesMaxTimeMS: number;
  fetchRulesTotalTimeMS: number;

  fetchBlockCount: number;
  fetchBlockMinTimeMS: number;
  fetchBlockMaxTimeMS: number;
  fetchBlockTotalTimeMS: number;

  individualRuleStats: Record<string, RuleMetrics>;
}

class RangeSDK implements IRangeSDK {
  private opts: RangeSDKOptions;
  private initOpts?: RangeSDKInitOptions;
  private config?: IRangeConfig;

  private blockRuleGroupTaskClient?: KafkaConsumerClient;
  private errorBlockRuleTaskClient?: KafkaConsumerClient;
  private tickRuleGroupTaskClient?: KafkaConsumerClient;

  private rateLimitedRules: Map<string, number> = new Map();
  private metricsByRuleGroup: Map<string, RuleGroupProcessingMetrics> =
    new Map();

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
    const start = Date.now();
    let rulesFetchedAt: number | null = null;
    let blockFetchedAt: number | null = null;

    const [rules, block] = await Promise.all([
      fetchAlertRulesByRuleGroupID({
        token: this.opts.token,
        ruleGroupId: taskPackage.ruleGroupId,
      }).then((data) => {
        rulesFetchedAt = Date.now();
        return data;
      }),
      fetchBlock({
        token: this.opts.token,
        height: taskPackage.block.height,
        network: taskPackage.block.network,
      })
        .then((data) => {
          blockFetchedAt = Date.now();
          return data;
        })
        .catch((err) => {
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
        alertRulesIds: [],
      });
      return;
    }

    // Filter out rate limited rules
    const filteredRules: IRangeAlertRule[] = [];
    for (const rule of rules) {
      if (
        this.rateLimitedRules.has(rule.id) &&
        dayjs
          .unix(this.rateLimitedRules.get(rule.id) as number)
          .isAfter(dayjs())
      ) {
        logger.info(
          {
            ruleID: rule.id,
            currentTime: dayjs().unix(),
            rateLimitedTill: this.rateLimitedRules.get(rule.id),
          },
          `rule processing skipped as it is rate limited.`,
        );
        // Skip the rule
        continue;
      }
      filteredRules.push(rule);
    }

    if (!filteredRules.length) {
      logger.warn(
        { rules, rateLimitedRules: Object.fromEntries(this.rateLimitedRules) },
        'Early task package ack due to rate limited for all rules',
      );
      await taskAck({
        token: this.opts.token,
        block: taskPackage.block,
        ruleGroupId: taskPackage.ruleGroupId,
        runnerId: taskPackage.runnerId,
        alertEventsCount: 0,
        alertRulesIds: [],
      });
      return;
    }

    const { errors, alertEventsCount, ruleStats } = await this.processBlockTask(
      block,
      rules,
    );
    await taskAck({
      token: this.opts.token,
      block: taskPackage.block,
      ruleGroupId: taskPackage.ruleGroupId,
      runnerId: taskPackage.runnerId,
      alertEventsCount,
      alertRulesIds: rules.map((r) => r.id),
      ...(errors?.length
        ? {
            errors,
          }
        : {}),
    });

    try {
      if (
        process.env['SDK_METRICS_ENABLED'] == 'true' &&
        rulesFetchedAt &&
        blockFetchedAt
      ) {
        this.setMetricStats(
          taskPackage.ruleGroupId,
          start,
          { rulesFetchedAt, blockFetchedAt },
          ruleStats,
        );
      }
    } catch (err) {
      logger.error(err, `Error while setting metrics`);
    }
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
  ): Promise<{
    errors: IRangeError[];
    alertEventsCount: number;
    ruleStats: RuleGroupProcessingMetrics['individualRuleStats'];
  }> {
    const ruleStats: Record<string, Partial<RuleMetrics>> = rules.reduce(
      (map, r) => {
        map[r.id] = {};
        return map;
      },
      {} as Record<string, Partial<RuleMetrics>>,
    );

    const events = await Promise.all(
      rules.map(
        async (
          rule,
        ): Promise<{
          errors: IRangeError[];
          alertEventsCount: number;
          rateLimitedStatus: {
            ruleID: string;
            isRateLimited: boolean;
            retryAfterUnixSec: number;
          };
        }> => {
          const rateLimitedStatus: {
            ruleID: string;
            isRateLimited: boolean;
            retryAfterUnixSec: number;
          } = {
            ruleID: rule.id,
            isRateLimited: false,
            retryAfterUnixSec: 0,
          };

          try {
            if (!this.initOpts) {
              throw new Error('SDK Init not called, onBlock missing');
            }
            if (!this.initOpts.onBlock) {
              throw new Error('Missing handler for block based alert rules');
            }

            const start = Date.now();
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

              delete ruleStats[rule.id];
              return {
                errors: [],
                alertEventsCount: 0,
                rateLimitedStatus,
              };
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

            const execAt = Date.now();
            ruleStats[rule.id].type = rule.ruleType;
            ruleStats[rule.id].execMinTimeMS = execAt - start;
            ruleStats[rule.id].execMaxTimeMS = execAt - start;
            ruleStats[rule.id].execCount = 1;
            ruleStats[rule.id].execTotalTimeMS = execAt - start;

            if (!ruleResults.length) {
              return { errors: [], alertEventsCount: 0, rateLimitedStatus };
            }

            const alertApiResp = await createAlertEvents({
              token: this.opts.token,
              workspaceId: rule.workspaceId || null,
              alertRuleId: rule.id,
              ruleGroupId: rule.ruleGroupId,
              alerts: ruleResults,
            });

            const alertCreatedAt = Date.now();
            ruleStats[rule.id].alertEventMinTimeMS = alertCreatedAt - start;
            ruleStats[rule.id].alertEventMaxTimeMS = alertCreatedAt - start;
            ruleStats[rule.id].alertEventCount = 1;
            ruleStats[rule.id].alertEventTotalTimeMS = alertCreatedAt - start;

            if (!alertApiResp.success) {
              rateLimitedStatus.isRateLimited = true;
              rateLimitedStatus.retryAfterUnixSec =
                alertApiResp.retryAfterUnixSec;
            }

            return {
              errors: [],
              alertEventsCount: ruleResults.length,
              rateLimitedStatus,
            };
          } catch (error) {
            logger.error(error);

            let err = String(error);
            if (error instanceof Error) {
              err = error.message + error.stack ? `\n${error.stack}` : '';
            }

            delete ruleStats[rule.id];

            return {
              errors: [
                {
                  ruleId: rule.id,
                  error: err,
                },
              ],
              alertEventsCount: 0,
              rateLimitedStatus,
            };
          }
        },
      ),
    );

    // Set rate limit information
    for (const event of events) {
      if (event.rateLimitedStatus.isRateLimited) {
        this.rateLimitedRules.set(
          event.rateLimitedStatus.ruleID,
          event.rateLimitedStatus.retryAfterUnixSec,
        );
      }
    }

    return {
      errors: events.flat().flatMap((obj) => obj.errors),
      alertEventsCount: events.flat().reduce((alertEventsCount, obj) => {
        return obj.alertEventsCount + alertEventsCount;
      }, 0),
      ruleStats: ruleStats as RuleGroupProcessingMetrics['individualRuleStats'],
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

  private setMetricStats(
    ruleGroupId: string,
    start: number,
    initialStats: {
      rulesFetchedAt: number;
      blockFetchedAt: number;
    },
    ruleStats: Record<string, RuleMetrics>,
  ) {
    const { rulesFetchedAt, blockFetchedAt } = initialStats;
    const end = Date.now();
    const endToEnd = end - start;

    const stats = {
      fetchRulesCount: 1,
      fetchRulesMinTimeMS: rulesFetchedAt - start,
      fetchRulesMaxTimeMS: rulesFetchedAt - start,
      fetchRulesTotalTimeMS: rulesFetchedAt - start,

      fetchBlockCount: 1,
      fetchBlockMinTimeMS: blockFetchedAt - start,
      fetchBlockMaxTimeMS: blockFetchedAt - start,
      fetchBlockTotalTimeMS: blockFetchedAt - start,

      endToEndCount: 1,
      endToEndMaxTimeMS: endToEnd,
      endToEndMinTimeMS: endToEnd,
      endToEndTotalTimeMS: endToEnd,

      individualRuleStats: ruleStats,
    };

    const currentStats = this.metricsByRuleGroup.get(ruleGroupId);
    if (!currentStats) {
      this.metricsByRuleGroup.set(
        ruleGroupId,
        stats as RuleGroupProcessingMetrics,
      );
      return;
    }

    const newStats: RuleGroupProcessingMetrics = JSON.parse(
      JSON.stringify(currentStats),
    );
    newStats.fetchRulesCount += stats.fetchRulesCount || 1;
    if (newStats.fetchRulesMinTimeMS > (stats.fetchRulesMinTimeMS || 0)) {
      newStats.fetchRulesMinTimeMS = stats.fetchRulesMinTimeMS || 0;
    }
    if (newStats.fetchRulesMaxTimeMS < (stats.fetchRulesMaxTimeMS || 0)) {
      newStats.fetchRulesMaxTimeMS = stats.fetchRulesMaxTimeMS || 0;
    }
    newStats.fetchRulesTotalTimeMS += stats.fetchRulesTotalTimeMS || 0;

    newStats.fetchBlockCount += stats.fetchBlockCount || 1;
    if (
      stats.fetchBlockMinTimeMS &&
      newStats.fetchBlockMinTimeMS > stats.fetchBlockMinTimeMS
    ) {
      newStats.fetchBlockMinTimeMS = stats.fetchBlockMinTimeMS;
    }
    if (newStats.fetchBlockMaxTimeMS < (stats.fetchBlockMaxTimeMS || 0)) {
      newStats.fetchBlockMaxTimeMS = stats.fetchBlockMaxTimeMS || 0;
    }
    newStats.fetchBlockTotalTimeMS += stats.fetchBlockTotalTimeMS || 0;

    newStats.endToEndCount += stats.endToEndCount || 1;
    if (
      stats.endToEndMinTimeMS &&
      newStats.endToEndMinTimeMS < stats.endToEndMinTimeMS
    ) {
      newStats.endToEndMinTimeMS = stats.endToEndMinTimeMS;
    }
    if (newStats.endToEndMaxTimeMS < (stats.endToEndMaxTimeMS || 0)) {
      newStats.endToEndMaxTimeMS = stats.endToEndMaxTimeMS || 0;
    }
    newStats.endToEndTotalTimeMS += stats.endToEndTotalTimeMS || 0;

    // handle individual rule stats
    for (const ruleID of Object.keys(ruleStats)) {
      const existingRuleStats = newStats.individualRuleStats[ruleID];
      if (!existingRuleStats) {
        newStats.individualRuleStats[ruleID] = ruleStats[ruleID];
        continue;
      }

      const newRuleStats: RuleMetrics = JSON.parse(
        JSON.stringify(existingRuleStats),
      );

      newRuleStats.execCount += ruleStats[ruleID].execCount;
      if (newRuleStats.execMinTimeMS > ruleStats[ruleID].execMinTimeMS) {
        newRuleStats.execMinTimeMS = ruleStats[ruleID].execMinTimeMS;
      }
      if (newRuleStats.execMaxTimeMS < ruleStats[ruleID].execMaxTimeMS) {
        newRuleStats.execMaxTimeMS = ruleStats[ruleID].execMaxTimeMS;
      }
      newRuleStats.execTotalTimeMS += ruleStats[ruleID].execTotalTimeMS;

      if (ruleStats[ruleID].alertEventCount) {
        newRuleStats.alertEventCount += ruleStats[ruleID].alertEventCount;
        if (
          newRuleStats.alertEventMinTimeMS >
          ruleStats[ruleID].alertEventMinTimeMS
        ) {
          newRuleStats.alertEventMinTimeMS =
            ruleStats[ruleID].alertEventMinTimeMS;
        }
        if (
          newRuleStats.alertEventMaxTimeMS <
          ruleStats[ruleID].alertEventMaxTimeMS
        ) {
          newRuleStats.alertEventMaxTimeMS =
            ruleStats[ruleID].alertEventMaxTimeMS;
        }
        newRuleStats.alertEventTotalTimeMS +=
          ruleStats[ruleID].alertEventTotalTimeMS;
      }

      newStats.individualRuleStats[ruleID] = newRuleStats;
    }

    this.metricsByRuleGroup.set(ruleGroupId, newStats);
  }

  getMetricStats() {
    if (process.env['SDK_METRICS_ENABLED'] == 'true') {
      return Object.fromEntries(this.metricsByRuleGroup);
    }

    return {
      message:
        'SDK Metrics are not enabled. To enable SDK in metrics mode, please pass env `SDK_METRICS_ENABLED` as true on initialisation',
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
