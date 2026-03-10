/**
 * Load Test Orchestrator
 *
 * Forks N runner child processes, waits for them to connect to Redis,
 * then pushes synthetic Solana blocks into the stream for them to consume.
 *
 * Usage:
 *   yarn load-test --blocks 100 --runners 10 --rules 100 --perc 10
 */
import { fork, ChildProcess } from 'child_process';
import { join } from 'path';
import { Command } from 'commander';
import { createClient } from 'redis';

// ── CLI ──────────────────────────────────────────────────────────

const program = new Command();
program
  .option('--blocks <n>', 'Number of blocks to push', '100')
  .option('--runners <n>', 'Number of runner processes', '10')
  .option('--rules <n>', 'Rules per runner', '100')
  .option('--perc <n>', 'PercBasedBenchmark fire rate %', '10')
  .option('--redis <url>', 'Redis URL', '127.0.0.1:6379')
  .parse();

const opts = program.opts();
const BLOCK_COUNT = parseInt(opts.blocks);
const RUNNER_COUNT = parseInt(opts.runners);
const RULE_COUNT = parseInt(opts.rules);
const PERC = parseInt(opts.perc);
const REDIS_URL = opts.redis;

const STREAM_NAME = `load-test-${Date.now()}`;
const CONSUMER_GROUP = 'load-test-group';
const PROCESSORS_FILE = join(__dirname, '..', 'processors', 'processors');

// ── Helpers ──────────────────────────────────────────────────────

function makeSolanaBlock(height: number) {
  return {
    height,
    network: 'solana',
    timestamp: Math.floor(Date.now() / 1000),
    blockData: {
      slot: String(height),
      parentSlot: String(height - 1),
      previousBlockhash: 'load-test-hash',
    },
    transactions: [],
  };
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.floor(sorted.length * p);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function padRight(str: string, len: number): string {
  return str.padEnd(len);
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== Load Test Configuration ===');
  console.log(`  Blocks:  ${BLOCK_COUNT}`);
  console.log(`  Runners: ${RUNNER_COUNT}`);
  console.log(`  Rules:   ${RULE_COUNT} per runner`);
  console.log(`  Perc:    ${PERC}%`);
  console.log(`  Redis:   ${REDIS_URL}`);
  console.log(`  Stream:  ${STREAM_NAME}`);
  console.log(
    `  Expected tasks: ~${BLOCK_COUNT} blocks / ${RUNNER_COUNT} runners * ${RULE_COUNT} rules = ~${Math.ceil(BLOCK_COUNT / RUNNER_COUNT) * RULE_COUNT} per runner`
  );
  console.log();

  // ── 1. Connect to Redis and create stream ──
  const client = createClient({ url: `redis://${REDIS_URL}` });
  await client.connect();

  // Create stream + consumer group (empty stream, runners will block-wait)
  try {
    await client.xGroupCreate(STREAM_NAME, CONSUMER_GROUP, '0', {
      MKSTREAM: true,
    });
  } catch (err: any) {
    if (!err.message.includes('BUSYGROUP')) throw err;
  }

  // ── 2. Fork runner processes and wait for them to be ready ──
  console.log(`Forking ${RUNNER_COUNT} runners...`);

  const children: ChildProcess[] = [];
  const readyPromises: Promise<void>[] = [];
  const statsPromises: Promise<any>[] = [];

  for (let i = 0; i < RUNNER_COUNT; i++) {
    const child = fork(join(__dirname, 'load-test-runner.js'), [], {
      env: {
        ...process.env,
        LOG_LEVEL: 'error',
        NODE_ENV: 'local',
      },
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });

    child.stderr?.on('data', (data: Buffer) => {
      const msg = data.toString().trim();
      if (msg) console.error(`  [runner-${i}] ${msg}`);
    });

    const readyPromise = new Promise<void>((resolve) => {
      const onMessage = (msg: any) => {
        if (msg.type === 'ready') {
          child.removeListener('message', onMessage);
          resolve();
        }
      };
      child.on('message', onMessage);
    });

    const statsPromise = new Promise<any>((resolve, reject) => {
      child.on('message', (msg: any) => {
        if (msg.type === 'stats') resolve(msg.stats);
      });
      child.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          reject(new Error(`Runner ${i} exited with code ${code}`));
        }
      });
      child.on('error', reject);
    });

    child.send({
      type: 'config',
      config: {
        runnerId: i,
        ruleCount: RULE_COUNT,
        perc: PERC,
        streamName: STREAM_NAME,
        consumerGroup: CONSUMER_GROUP,
        redisUrl: REDIS_URL,
        processorsFile: PROCESSORS_FILE,
      },
    });

    children.push(child);
    readyPromises.push(readyPromise);
    statsPromises.push(statsPromise);
  }

  // Wait for all runners to init pool + connect to Redis
  await Promise.all(readyPromises);
  console.log(`  All ${RUNNER_COUNT} runners ready\n`);

  // ── 3. Push blocks into the stream ──
  console.log('Pushing blocks to Redis...');
  const pushStart = Date.now();
  for (let i = 1; i <= BLOCK_COUNT; i++) {
    const block = makeSolanaBlock(i);
    await client.xAdd(STREAM_NAME, '*', {
      message: JSON.stringify(block),
    });
  }
  const pushTime = Date.now() - pushStart;
  console.log(
    `  Pushed ${BLOCK_COUNT} blocks in ${pushTime}ms (${((BLOCK_COUNT / pushTime) * 1000).toFixed(0)} blocks/sec)\n`
  );

  // ── 4. Wait for all runners to finish ──
  console.log('Waiting for runners to finish...');
  const runStart = Date.now();

  let allStats: any[];
  try {
    allStats = await Promise.all(statsPromises);
  } catch (err) {
    console.error('Runner failed:', err);
    children.forEach((c) => c.kill());
    await client.del(STREAM_NAME);
    await client.disconnect();
    process.exit(1);
  }

  const totalRunTime = Date.now() - runStart;

  // ── 5. Clean up Redis stream ──
  await client.del(STREAM_NAME);
  await client.disconnect();

  // ── 6. Print results ──
  console.log('\n' + '='.repeat(80));
  console.log('  LOAD TEST RESULTS');
  console.log('='.repeat(80));

  console.log('\n--- Per-Runner Breakdown ---\n');
  console.log(
    padRight('Runner', 10) +
      padRight('Blocks', 8) +
      padRight('Tasks', 8) +
      padRight('Events', 8) +
      padRight('Success', 9) +
      padRight('Fail', 6) +
      padRight('Timeout', 9) +
      padRight('Time(ms)', 10) +
      padRight('Tasks/s', 9) +
      padRight('AvgThread', 11) +
      padRight('P95', 8)
  );
  console.log('-'.repeat(96));

  const allThreadTimes: number[] = [];
  const allWaitTimes: number[] = [];
  let totalBlocks = 0;
  let totalTasks = 0;
  let totalEvents = 0;
  let totalSuccess = 0;
  let totalFailure = 0;
  let totalTimeout = 0;

  for (const s of allStats) {
    const tasksPerSec =
      s.totalTasks > 0
        ? ((s.totalTasks / s.totalTimeMs) * 1000).toFixed(1)
        : '0';
    const avgThread = avg(s.threadTimes).toFixed(1);
    const p95 = percentile(s.threadTimes, 0.95).toFixed(1);

    console.log(
      padRight(`#${s.runnerId}`, 10) +
        padRight(String(s.blocksProcessed), 8) +
        padRight(String(s.totalTasks), 8) +
        padRight(String(s.totalEvents), 8) +
        padRight(String(s.successCount), 9) +
        padRight(String(s.failureCount), 6) +
        padRight(String(s.timeoutCount), 9) +
        padRight(String(s.totalTimeMs), 10) +
        padRight(tasksPerSec, 9) +
        padRight(avgThread, 11) +
        padRight(p95, 8)
    );

    allThreadTimes.push(...s.threadTimes);
    allWaitTimes.push(...s.waitTimes);
    totalBlocks += s.blocksProcessed;
    totalTasks += s.totalTasks;
    totalEvents += s.totalEvents;
    totalSuccess += s.successCount;
    totalFailure += s.failureCount;
    totalTimeout += s.timeoutCount;
  }

  allThreadTimes.sort((a, b) => a - b);
  allWaitTimes.sort((a, b) => a - b);

  console.log('\n--- Aggregate ---\n');
  console.log(`  Total blocks processed: ${totalBlocks} / ${BLOCK_COUNT}`);
  console.log(`  Total tasks:            ${totalTasks}`);
  console.log(`  Total events:           ${totalEvents}`);
  if (totalTasks > 0) {
    console.log(
      `  Event rate:             ${((totalEvents / totalTasks) * 100).toFixed(1)}% (expected ~${PERC}%)`
    );
    console.log();
    console.log(
      `  Success:  ${totalSuccess} (${((totalSuccess / totalTasks) * 100).toFixed(1)}%)`
    );
    console.log(
      `  Failure:  ${totalFailure} (${((totalFailure / totalTasks) * 100).toFixed(1)}%)`
    );
    console.log(
      `  Timeout:  ${totalTimeout} (${((totalTimeout / totalTasks) * 100).toFixed(1)}%)`
    );
  }
  console.log();
  console.log(`  Wall time:          ${totalRunTime}ms`);
  if (totalTasks > 0) {
    console.log(
      `  Aggregate tasks/s:  ${((totalTasks / totalRunTime) * 1000).toFixed(1)}`
    );
    console.log();
    console.log(`  Thread time avg:    ${avg(allThreadTimes).toFixed(1)}ms`);
    console.log(
      `  Thread time P50:    ${percentile(allThreadTimes, 0.5).toFixed(1)}ms`
    );
    console.log(
      `  Thread time P95:    ${percentile(allThreadTimes, 0.95).toFixed(1)}ms`
    );
    console.log(
      `  Thread time P99:    ${percentile(allThreadTimes, 0.99).toFixed(1)}ms`
    );
    console.log();
    console.log(`  Wait time avg:      ${avg(allWaitTimes).toFixed(1)}ms`);
    console.log(
      `  Wait time P50:      ${percentile(allWaitTimes, 0.5).toFixed(1)}ms`
    );
    console.log(
      `  Wait time P95:      ${percentile(allWaitTimes, 0.95).toFixed(1)}ms`
    );
    console.log(
      `  Wait time P99:      ${percentile(allWaitTimes, 0.99).toFixed(1)}ms`
    );
  }
  console.log('\n' + '='.repeat(80) + '\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('Load test failed:', err);
  process.exit(1);
});
