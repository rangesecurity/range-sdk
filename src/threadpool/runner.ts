import 'reflect-metadata';
import { Command } from 'commander';
import { join } from 'path';
import axios from 'axios';
import express, { Request, Response } from 'express';
import { closePool, initPool, getPoolStats, initThreadMonitor } from './pool';
import {
  createRedisClient,
  consumeRedisStream,
} from '../services/consumer-redis';
import { assetManagerInitialization } from '../services/AssetManager';
import { env, applyConfig } from '../env';
import { logger } from '../utils/logger';
import { IRunnerConfig } from '../types/IRunnerConfig';
import { ProcessorRegistry } from '../utils/processor';
import {
  processPayload,
  getBufferPoolStats,
  extractBlockMeta,
  initBufferPoolCleanup,
} from '../processors/taskProcessor';
import { SolanaBlockWrapper } from '../wrappers/solana-block-wrapper';
import {
  getHealthyBlockRules,
  registerTaskResult,
  fetchRules,
  statMap,
  getStatsSummary,
  checkStanding,
  getHealthyTickRules,
  recordBlockReceived,
  recordTickReceived,
  getTimeSeriesData,
  TimeSeriesMetric,
  getLagStats,
  initStatsSchedulers,
} from '../services/stats-service';
import {
  initNotificationsRedis,
  publishEvents,
} from '../services/event-service';
import { dayjs } from '../utils/dayjs';
import { getMetrics } from '../services/prometheus-metrics';
import { startSlackMonitor } from '../services/slack-monitor';

// Maps EVM chain IDs to runner network names
const CHAIN_ID_TO_NETWORK: Record<string, string> = {
  '1': 'eth',
  '56': 'bnb',
  '137': 'pol',
  '42161': 'arb1',
};

/**
 * Normalize EVM blocks to have top-level height, network, timestamp
 * matching the Solana/Cosmos format. Mutates the block in-place.
 * No-op if the block already has these fields.
 */
function normalizeBlock(block: any): void {
  if (block.height !== undefined && block.network !== undefined) return;

  if (block.block?.result?.number) {
    const result = block.block.result;
    block.height = parseInt(result.number, 16);
    block.timestamp = result.timestamp
      ? new Date(parseInt(result.timestamp, 16) * 1000).toISOString()
      : undefined;
  }

  if (block.network === undefined && block.chain_id !== undefined) {
    block.network =
      CHAIN_ID_TO_NETWORK[String(block.chain_id)] || String(block.chain_id);
  }
}

function isBlockForNetwork(
  blockNetwork: string,
  runnerNetwork: string
): boolean {
  const normalized = CHAIN_ID_TO_NETWORK[blockNetwork] || blockNetwork;
  return normalized === runnerNetwork || blockNetwork === runnerNetwork;
}

// Graceful shutdown handling
let isShuttingDown = false;

function setupGracefulShutdown() {
  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`Received ${signal}, initiating graceful shutdown...`);

    try {
      // Close the pool and clean up resources
      await closePool();

      // Force garbage collection one final time
      if (global.gc) {
        global.gc();
      }

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      `Unhandled promise rejection at: ${promise}, reason: ${reason}`
    );
    gracefulShutdown('unhandledRejection');
  });
}

// Enhanced memory monitoring
function setupMemoryMonitoring() {
  const MEMORY_CHECK_INTERVAL = 60_000; // Every 60 seconds
  const CRITICAL_MEMORY_THRESHOLD = 3500; // 3.5GB in MB

  setInterval(() => {
    try {
      const memUsage = process.memoryUsage();
      const rssMB = memUsage.rss / 1024 / 1024;
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
      const externalMB = memUsage.external / 1024 / 1024;
      const arrayBuffersMB = memUsage.arrayBuffers / 1024 / 1024;

      logger.info(
        `Memory usage: RSS=${rssMB.toFixed(0)}MB, Heap=${heapUsedMB.toFixed(0)}/${heapTotalMB.toFixed(0)}MB, External=${externalMB.toFixed(0)}MB, Buffers=${arrayBuffersMB.toFixed(0)}MB`
      );

      // Critical memory warning
      if (rssMB > CRITICAL_MEMORY_THRESHOLD) {
        logger.error(
          `CRITICAL: Memory usage is very high: RSS=${rssMB.toFixed(0)}MB. Consider restart.`
        );

        // Force GC
        if (global.gc) {
          global.gc();
          logger.info('Forced garbage collection due to high memory usage');
        }
      }
    } catch (error) {
      logger.error('Error in memory monitoring:', error);
    }
  }, MEMORY_CHECK_INTERVAL);
}

async function registerAlertTemplates(alertTemplates: Map<string, any>) {
  try {
    logger.info('Registering alert templates...');
    const templatesArray = Array.from(alertTemplates.values());

    if (env.REGISTER_EXTERNAL_RULE_TYPES_ENDPOINT) {
      const runnerId = env.RANGE_SDK_TOKEN.split('.')[0];
      await axios.post(
        env.REGISTER_EXTERNAL_RULE_TYPES_ENDPOINT,
        {
          runnerId,
          ruleTypes: templatesArray,
        },
        {
          timeout: 60_000,
        }
      );
    }

    logger.info(`Registered ${alertTemplates.size} alert templates.`);
  } catch (error: any) {
    logger.error(`Error registering alert templates: ${error.message}`);
    throw error;
  }
}

export async function startRunner({
  processors: processorsFile,
  range_sdk_token,
  config,
  testAlertRules,
}: IRunnerConfig) {
  if (range_sdk_token) process.env.RANGE_SDK_TOKEN = range_sdk_token;
  if (config) applyConfig(config);

  if (env.REGISTER_RULE_TYPES) {
    // Load processors to populate the registry (import triggers @Rule decorators)
    await import(
      processorsFile || join(__dirname, 'processors', 'processors.js')
    );

    const network = env.RUNNER_NETWORK || undefined;
    const alertTemplates = ProcessorRegistry.getAlertTemplates(network);

    // Dump registration payload for debugging
    const runnerId = env.RANGE_SDK_TOKEN.split('.')[0];
    await registerAlertTemplates(alertTemplates);
    logger.info(`Alert templates registered for runner: ${runnerId}`);
    process.exit(0);
  }

  // Setup graceful shutdown handlers
  setupGracefulShutdown();

  // Setup memory monitoring
  setupMemoryMonitoring();

  // Setup Express server for status endpoints
  const app = express();

  // Add JSON middleware
  app.use(express.json());

  // Stats endpoint
  app.get('/stats', (req: Request, res: Response) => {
    const stats = getStatsSummary();
    res.json(stats);
  });

  // Time series endpoint
  app.get('/stats/timeseries', (req: Request, res: Response) => {
    const metric = req.query.metric as TimeSeriesMetric;
    const intervalMinutes = parseInt(req.query.interval as string) || 1;
    const durationMinutes = parseInt(req.query.duration as string) || 60;

    // Validate metric
    const validMetrics: TimeSeriesMetric[] = [
      'events_per_minute',
      'block_avg_processing_time',
      'tick_avg_processing_time',
      'throughput_tasks',
      'success_rate',
      'memory_heap',
    ];

    if (!metric || !validMetrics.includes(metric)) {
      res.status(400).json({
        error: 'Invalid metric',
        validMetrics,
      });
      return;
    }

    // Validate interval (1-60 minutes)
    if (intervalMinutes < 1 || intervalMinutes > 60) {
      res.status(400).json({
        error: 'Interval must be between 1 and 60 minutes',
      });
      return;
    }

    // Validate duration (1-1440 minutes = 24 hours)
    if (durationMinutes < 1 || durationMinutes > 1440) {
      res.status(400).json({
        error: 'Duration must be between 1 and 1440 minutes (24 hours)',
      });
      return;
    }

    try {
      const timeSeries = getTimeSeriesData(
        metric,
        intervalMinutes,
        durationMinutes
      );
      res.json(timeSeries);
    } catch (error: any) {
      logger.error('Error generating time series:', error);
      res.status(500).json({
        error: 'Failed to generate time series',
        message: error.message,
      });
    }
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    const standing = checkStanding();
    const statusCode = standing.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(standing);
  });

  // Thread pool stats endpoint
  app.get('/stats/pool', (req: Request, res: Response) => {
    res.json(getPoolStats());
  });

  // Buffer pool stats endpoint
  app.get('/stats/buffers', (req: Request, res: Response) => {
    res.json(getBufferPoolStats());
  });

  // Lag stats endpoint - shows how far behind real-time
  app.get('/stats/lag', (req: Request, res: Response) => {
    res.json(getLagStats());
  });

  // Prometheus metrics endpoint
  app.get('/metrics', async (req: Request, res: Response) => {
    try {
      res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      res.send(await getMetrics());
    } catch (error) {
      res.status(500).send('Error generating metrics');
    }
  });

  app.listen(env.PORT, '127.0.0.1', () => {
    logger.info(`Status server listening on port ${env.PORT}`);
  });

  const program = new Command();

  program
    .option('-t, --thread-count <number>', 'number of threads', '4')
    .option('-l, --log-every <number>', 'log every N blocks', '10')
    .parse();

  const options = program.opts();
  const THREAD_COUNT = parseInt(options.threadCount);
  const LOG_EVERY = parseInt(options.logEvery);

  logger.info(`Starting Piscina Runner with ${THREAD_COUNT} threads`);

  // Fetch asset data in main thread and write cache for workers
  await assetManagerInitialization();

  await initPool({
    filename: join(__dirname, 'worker.js'), // worker file path
    maxThreads: THREAD_COUNT, // max no. of threads to spin up
    concurrentTasksPerWorker: 1, // generally pass 1, but can be adjusted for higher concurrency
    idleTimeout: 15_000, // reduced from 30 seconds
    closeTimeout: 3_000, // reduced from 5 seconds
    execArgv: [
      '--trace-warnings',
      '--trace-uncaught',
      '--max-old-space-size=4096',
    ],
    workerData: {},
  });

  initThreadMonitor();
  await initNotificationsRedis();
  await fetchRules(testAlertRules || []);
  initStatsSchedulers();
  initBufferPoolCleanup();
  startSlackMonitor();

  setInterval(async () => {
    await fetchRules(testAlertRules || []);
  }, 60_000);

  const blockRedis = await createRedisClient(env.BLOCK_REDIS_URL);
  const tickRedis =
    env.TICK_REDIS_URL !== env.BLOCK_REDIS_URL
      ? await createRedisClient(env.TICK_REDIS_URL)
      : blockRedis;

  const promise1 = consumeRedisStream({
    client: blockRedis,
    streamName: env.BLOCK_REDIS_STREAM_NAME,
    consumerGroup: env.BLOCK_REDIS_CONSUMER_GROUP,
    consumerName: env.BLOCK_REDIS_CONSUMER_NAME,
    callback: async (block) => {
      if (isShuttingDown) return;

      // Binary path: block arrived as pre-encoded FlatBuffer from Redis
      if (block._binaryBlock instanceof Uint8Array) {
        const wrapper = new SolanaBlockWrapper(block._binaryBlock);
        const blockMeta = {
          height: String(wrapper.height),
          network: wrapper.network,
          timestamp: String(wrapper.timestamp),
        };
        recordBlockReceived(Number(blockMeta.height), blockMeta.timestamp);

        if (!isBlockForNetwork(blockMeta.network, env.RUNNER_NETWORK)) {
          return;
        }

        let begin, end;
        begin = Date.now();

        const results = await processPayload({
          blockData: block._binaryBlock,
          ruleList: getHealthyBlockRules(),
          processorsFile,
        });
        end = Date.now();
        const processingTime = end - begin;

        begin = Date.now();
        results.forEach(registerTaskResult);

        const allEvents = results.flatMap((result) => result.events);
        await publishEvents(allEvents);
        end = Date.now();
        const publishingTime = end - begin;

        const blockHeight = Number(blockMeta.height);
        if (blockHeight % LOG_EVERY === 0) {
          const ago = dayjs().diff(dayjs(blockMeta.timestamp), 's');
          logger.info(
            `height: ${blockHeight}, events: ${allEvents.length}, time: ${processingTime}ms, pub: ${publishingTime}ms, age: ${ago}s ago`
          );
        }
        return;
      }

      // JSON path: existing behavior
      normalizeBlock(block);

      // Record that we received a block (for standing check and lag tracking)
      const blockMeta = extractBlockMeta(block);
      recordBlockReceived(Number(blockMeta.height), blockMeta.timestamp);

      // Skip blocks from other networks
      if (!isBlockForNetwork(blockMeta.network, env.RUNNER_NETWORK)) {
        return;
      }

      let begin, end;
      begin = Date.now();

      const results = await processPayload({
        blockData: block,
        ruleList: getHealthyBlockRules(),
        processorsFile,
      });
      end = Date.now();
      const processingTime = end - begin;

      begin = Date.now();
      results.forEach(registerTaskResult);

      const allEvents = results.flatMap((result) => result.events);
      await publishEvents(allEvents);
      end = Date.now();
      const publishingTime = end - begin;

      const blockHeight = Number(blockMeta.height);
      if (blockHeight % LOG_EVERY === 0) {
        const ago = dayjs().diff(dayjs(blockMeta.timestamp), 's');
        logger.info(
          `height: ${blockHeight}, events: ${allEvents.length}, time: ${processingTime}ms, pub: ${publishingTime}ms, age: ${ago}s ago`
        );
      }
    },
  });

  const promise2 = consumeRedisStream({
    client: tickRedis,
    streamName: env.TICK_REDIS_STREAM_NAME,
    consumerGroup: env.TICK_REDIS_CONSUMER_GROUP,
    consumerName: env.TICK_REDIS_CONSUMER_NAME,
    callback: async (tickInfo: { time: string }) => {
      if (isShuttingDown) return;

      // Record that we received a tick (for standing check and lag tracking)
      recordTickReceived(tickInfo.time);

      let begin, end;
      begin = Date.now();

      const results = await processPayload({
        time: tickInfo.time,
        ruleList: getHealthyTickRules(),
        processorsFile,
      });
      end = Date.now();
      const processingTime = end - begin;

      const allEvents = results.flatMap((result) => result.events);
      if (allEvents.length === 0) return;

      begin = Date.now();
      results.forEach(registerTaskResult);
      await publishEvents(allEvents);
      end = Date.now();
      const publishingTime = end - begin;

      const ago = dayjs().diff(dayjs(tickInfo.time), 's');
      logger.info(
        `TICK: ${tickInfo.time}, events: ${allEvents.length}, time: ${processingTime}ms, pub: ${publishingTime}ms, age: ${ago}s ago`
      );
    },
  });

  await Promise.all([promise1, promise2]);
}
