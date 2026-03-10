/**
 * Runtime Benchmark: Node.js vs Bun
 *
 * Compares processing 1000 blocks with 50 rules (45 healthy, 5 unhealthy)
 * Skips tick processing.
 *
 * Usage:
 *   Node.js: node dist/scripts/benchmark-runtime.js
 *   Bun:     bun dist/scripts/benchmark-runtime.js
 */

import { config } from 'dotenv';
config({ quiet: true });

import { join } from 'path';
import { readFileSync } from 'fs';
import {
  processPayload,
  getBufferPoolStats,
} from '../processors/taskProcessor';
import { initPool, closePool, getPoolStats } from '../threadpool/pool';
import { registerTaskResult, getStatsSummary } from '../services/stats-service';
import { IAlertRule } from '../types/IAlertRule';

// Detect runtime (avoid TypeScript errors for Bun global)
const globalAny = globalThis as any;
const runtime = globalAny.Bun ? 'bun' : 'node';
const runtimeVersion = globalAny.Bun?.version || process.version;

interface BenchmarkResult {
  runtime: string;
  version: string;
  total_blocks: number;
  total_rules: number;
  healthy_rules: number;
  unhealthy_rules: number;
  total_tasks: number;
  total_time_ms: number;
  avg_block_time_ms: number;
  blocks_per_second: number;
  tasks_per_second: number;
  peak_memory_mb: number;
  final_memory_mb: number;
  gc_runs: number;
  events_emitted: number;
}

// Generate rules: 90% healthy + 10% unhealthy
function generateRules(totalRules: number = 50): IAlertRule[] {
  const rules: IAlertRule[] = [];

  const healthyCount = Math.floor(totalRules * 0.9);
  const unhealthyCount = totalRules - healthyCount;

  // 80% of healthy rules are EmptyRule (fast, no events)
  const emptyRuleCount = Math.floor(healthyCount * 0.89);
  // 10% of healthy rules emit events (PercBasedBenchmark)
  const percRuleCount = healthyCount - emptyRuleCount;

  // Use 'benchmark' network to load processors-benchmark.js (no external deps)
  const network: any = 'solana';

  // Healthy rules (EmptyRule - fast, no events)
  for (let i = 0; i < emptyRuleCount; i++) {
    rules.push({
      id: `healthy-empty-${i}`,
      ruleType: 'EmptyRule',
      ruleGroupId: 'benchmark',
      workspaceId: 'benchmark',
      network,
      parameters: {},
      triggerMode: 'BLOCK',
      createdAt: new Date().toISOString(),
    } as IAlertRule);
  }

  // Healthy rules that emit events (PercBasedBenchmark with 100% event rate)
  for (let i = 0; i < percRuleCount; i++) {
    rules.push({
      id: `healthy-perc-${i}`,
      ruleType: 'PercBasedBenchmark',
      ruleGroupId: 'benchmark',
      workspaceId: 'benchmark',
      network,
      parameters: { perc: 100 },
      triggerMode: 'BLOCK',
      createdAt: new Date().toISOString(),
    } as IAlertRule);
  }

  // Unhealthy rules (60% Hang - will timeout, 40% ThrowError - will fail)
  const hangCount = Math.floor(unhealthyCount * 0.6);
  const errorCount = unhealthyCount - hangCount;

  for (let i = 0; i < hangCount; i++) {
    rules.push({
      id: `unhealthy-hang-${i}`,
      ruleType: 'Hang',
      ruleGroupId: 'benchmark',
      workspaceId: 'benchmark',
      network,
      parameters: {},
      triggerMode: 'BLOCK',
      createdAt: new Date().toISOString(),
    } as IAlertRule);
  }

  for (let i = 0; i < errorCount; i++) {
    rules.push({
      id: `unhealthy-error-${i}`,
      ruleType: 'ThrowError',
      ruleGroupId: 'benchmark',
      workspaceId: 'benchmark',
      network,
      parameters: {},
      triggerMode: 'BLOCK',
      createdAt: new Date().toISOString(),
    } as IAlertRule);
  }

  return rules;
}

// Load a sample block
function loadSampleBlock(): any {
  // When running from dist/scripts/, test_data is at ../test_data/
  const distTestDataPath = join(
    __dirname,
    '../test_data/solana/348694694.json'
  );

  try {
    const block = JSON.parse(readFileSync(distTestDataPath, 'utf8'));
    // Add required fields for processing
    // Use 'benchmark' network to load processors-benchmark.js (avoids missing deps)
    block.network = 'benchmark';
    block.height = block.blockHeight || 348694694;
    block.timestamp = block.blockTime
      ? new Date(block.blockTime * 1000).toISOString()
      : new Date().toISOString();
    return block;
  } catch (e) {
    console.log('Failed to load block:', e.message);
    // Fallback: create minimal mock block
    return {
      network: 'solana',
      height: 348694694,
      timestamp: new Date().toISOString(),
      transactions: [],
    };
  }
}

function formatMemory(bytes: number): number {
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
}

async function runBenchmark(): Promise<BenchmarkResult> {
  const BLOCK_COUNT = parseInt(process.env.BENCH_BLOCKS || '1000', 10);
  const RULE_COUNT = parseInt(process.env.BENCH_RULES || '50', 10);
  const THREAD_COUNT = parseInt(process.env.BENCH_THREADS || '10', 10);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Runtime Benchmark: ${runtime} ${runtimeVersion}`);
  console.log(
    `Config: ${BLOCK_COUNT} blocks, ${RULE_COUNT} rules, ${THREAD_COUNT} threads`
  );
  console.log(`${'='.repeat(60)}\n`);

  // Initialize pool
  console.log(`Initializing thread pool with ${THREAD_COUNT} threads...`);
  await initPool({
    filename: join(__dirname, '../threadpool/worker.js'),
    maxThreads: THREAD_COUNT,
    concurrentTasksPerWorker: 1,
    idleTimeout: 15_000,
    closeTimeout: 3_000,
  });

  // Generate rules
  const rules = generateRules(RULE_COUNT);
  // Filter to only healthy rules for actual processing (unhealthy will be blocked after first timeout)
  const healthyRules = rules.filter(
    (r) => !r.ruleType.includes('Hang') && !r.ruleType.includes('ThrowError')
  );

  console.log(`Total rules: ${rules.length}`);
  console.log(`  Healthy: ${healthyRules.length}`);
  console.log(`  Unhealthy: ${rules.length - healthyRules.length}`);

  // Load sample block
  const sampleBlock = loadSampleBlock();
  console.log(
    `\nLoaded sample block: ${sampleBlock.network}:${sampleBlock.height}`
  );
  console.log(`Block size: ~${JSON.stringify(sampleBlock).length} bytes`);

  // Track memory
  let peakMemory = 0;
  let gcRuns = 0;
  const memoryInterval = setInterval(() => {
    const mem = process.memoryUsage();
    if (mem.rss > peakMemory) peakMemory = mem.rss;
  }, 100);

  // Run benchmark
  console.log(`\nProcessing ${BLOCK_COUNT} blocks...`);
  const startTime = Date.now();
  let totalEvents = 0;
  let blocksProcessed = 0;

  // Process blocks - use all rules including unhealthy ones
  // The unhealthy ones will timeout/fail but that's part of the benchmark
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const blockData = {
      ...sampleBlock,
      height: sampleBlock.height + i,
      timestamp: new Date().toISOString(),
    };

    // Use healthy rules after first few blocks to avoid timeout delays
    // For first 10 blocks, include unhealthy rules to test timeout handling
    const rulesForBlock = i < 10 ? rules : healthyRules;

    const results = await processPayload({
      blockData,
      ruleList: rulesForBlock,
    });

    // Register results
    results.forEach(registerTaskResult);

    // Count events
    const events = results.reduce((sum, r) => sum + r.eventCount, 0);
    totalEvents += events;
    blocksProcessed++;

    // Progress update every 100 blocks
    if ((i + 1) % 100 === 0) {
      const elapsed = Date.now() - startTime;
      const rate = Math.round((blocksProcessed / elapsed) * 1000);
      const mem = formatMemory(process.memoryUsage().rss);
      console.log(
        `  ${blocksProcessed}/${BLOCK_COUNT} blocks | ${rate} blocks/s | ${mem}MB RSS`
      );

      // Force GC if available
      if (global.gc) {
        global.gc();
        gcRuns++;
      }
    }
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  clearInterval(memoryInterval);

  // Final stats
  const finalMemory = process.memoryUsage();
  const poolStats = getPoolStats();
  const bufferStats = getBufferPoolStats();
  const statsSummary = getStatsSummary();

  // Calculate metrics
  const unhealthyRulesCount = rules.length - healthyRules.length;
  const totalTasks =
    blocksProcessed * healthyRules.length + 10 * unhealthyRulesCount; // healthy tasks + first 10 blocks with unhealthy
  const avgBlockTime = totalTime / blocksProcessed;
  const blocksPerSecond = (blocksProcessed / totalTime) * 1000;
  const tasksPerSecond = (totalTasks / totalTime) * 1000;

  const result: BenchmarkResult = {
    runtime,
    version: runtimeVersion,
    total_blocks: blocksProcessed,
    total_rules: rules.length,
    healthy_rules: healthyRules.length,
    unhealthy_rules: rules.length - healthyRules.length,
    total_tasks: totalTasks,
    total_time_ms: totalTime,
    avg_block_time_ms: Math.round(avgBlockTime * 100) / 100,
    blocks_per_second: Math.round(blocksPerSecond * 100) / 100,
    tasks_per_second: Math.round(tasksPerSecond * 100) / 100,
    peak_memory_mb: formatMemory(peakMemory),
    final_memory_mb: formatMemory(finalMemory.rss),
    gc_runs: gcRuns,
    events_emitted: totalEvents,
  };

  // Print results
  console.log(`\n${'='.repeat(60)}`);
  console.log('BENCHMARK RESULTS');
  console.log(`${'='.repeat(60)}`);
  console.log(`Runtime:           ${result.runtime} ${result.version}`);
  console.log(`Total Time:        ${result.total_time_ms}ms`);
  console.log(`Blocks Processed:  ${result.total_blocks}`);
  console.log(`Tasks Executed:    ${result.total_tasks}`);
  console.log(`Events Emitted:    ${result.events_emitted}`);
  console.log(`Avg Block Time:    ${result.avg_block_time_ms}ms`);
  console.log(`Blocks/Second:     ${result.blocks_per_second}`);
  console.log(`Tasks/Second:      ${result.tasks_per_second}`);
  console.log(`Peak Memory:       ${result.peak_memory_mb}MB`);
  console.log(`Final Memory:      ${result.final_memory_mb}MB`);
  console.log(`GC Runs:           ${result.gc_runs}`);
  console.log(`${'='.repeat(60)}`);

  // Pool stats
  console.log('\nThread Pool Stats:');
  console.log(`  Completed Tasks: ${poolStats.completed_tasks}`);
  console.log(`  Queue Size:      ${poolStats.queue_size}`);
  console.log(`  Utilization:     ${poolStats.utilization}%`);

  // Buffer pool stats
  console.log('\nBuffer Pool Stats:');
  console.log(`  Reuse Rate:      ${bufferStats.reuse_rate}%`);
  console.log(`  Hits/Misses:     ${bufferStats.hits}/${bufferStats.misses}`);

  // Cleanup
  console.log('\nCleaning up...');
  await closePool();

  return result;
}

// Main
runBenchmark()
  .then((result) => {
    // Output JSON for comparison script
    console.log('\n--- JSON RESULT ---');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error('Benchmark failed:', error);
    process.exit(1);
  });
