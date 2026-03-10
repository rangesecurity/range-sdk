import { initPool, runTask, closePool, pool } from './../threadpool/pool';
import { join } from 'path';
import { getCachedBlock, createNewAlertRule } from './../utils/testing-helpers';
import { registerTaskResult, statMap } from './../services/stats-service';
import { IStat } from './../types/ITask';

/**
 * MTT Performance Test Suite
 *
 * Tests various performance characteristics of the multi-threaded task runner:
 * - Throughput under varying rule counts
 * - Latency distributions (P50/P95/P99)
 * - Memory stability under sustained load
 * - Timeout handling with hanging rules
 * - Error recovery with failing rules
 * - Mixed workload scenarios
 */

// Performance tracking utilities
interface PerformanceMetrics {
  tasksPerSecond: number;
  avgThreadTime: number;
  avgWaitTime: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  successRate: number;
  timeoutRate: number;
  errorRate: number;
  totalTasks: number;
  totalTime: number;
  memoryDelta: {
    rss: number;
    heapUsed: number;
    external: number;
  };
}

class PerformanceTracker {
  private stats: IStat[] = [];
  private startMemory: NodeJS.MemoryUsage;
  private endMemory: NodeJS.MemoryUsage;
  private startTime: number;
  private endTime: number;

  constructor() {
    this.startMemory = process.memoryUsage();
    this.startTime = Date.now();
  }

  recordStat(stat: IStat) {
    this.stats.push(stat);
  }

  finish(): PerformanceMetrics {
    this.endMemory = process.memoryUsage();
    this.endTime = Date.now();

    const totalTime = this.endTime - this.startTime;
    const totalTasks = this.stats.length;

    // Calculate latency percentiles (total time = thread + wait)
    const totalLatencies = this.stats
      .map((s) => s.threadTimeSpent + s.waitTimeSpent)
      .sort((a, b) => a - b);

    const p50Index = Math.floor(totalLatencies.length * 0.5);
    const p95Index = Math.floor(totalLatencies.length * 0.95);
    const p99Index = Math.floor(totalLatencies.length * 0.99);

    const statusCounts = {
      success: this.stats.filter((s) => s.status === 'success').length,
      timeout: this.stats.filter((s) => s.status === 'timeout').length,
      failure: this.stats.filter((s) => s.status === 'failure').length,
    };

    return {
      tasksPerSecond: (totalTasks / totalTime) * 1000,
      avgThreadTime:
        this.stats.reduce((sum, s) => sum + s.threadTimeSpent, 0) / totalTasks,
      avgWaitTime:
        this.stats.reduce((sum, s) => sum + s.waitTimeSpent, 0) / totalTasks,
      p50Latency: totalLatencies[p50Index] || 0,
      p95Latency: totalLatencies[p95Index] || 0,
      p99Latency: totalLatencies[p99Index] || 0,
      successRate: statusCounts.success / totalTasks,
      timeoutRate: statusCounts.timeout / totalTasks,
      errorRate: statusCounts.failure / totalTasks,
      totalTasks,
      totalTime,
      memoryDelta: {
        rss: (this.endMemory.rss - this.startMemory.rss) / 1024 / 1024,
        heapUsed:
          (this.endMemory.heapUsed - this.startMemory.heapUsed) / 1024 / 1024,
        external:
          (this.endMemory.external - this.startMemory.external) / 1024 / 1024,
      },
    };
  }

  printMetrics(metrics: PerformanceMetrics, scenario: string) {
    console.log(`\n=== ${scenario} ===`);
    console.log(`Total Tasks: ${metrics.totalTasks}`);
    console.log(`Total Time: ${metrics.totalTime}ms`);
    console.log(`Throughput: ${metrics.tasksPerSecond.toFixed(2)} tasks/sec`);
    console.log(`\nLatency (total = thread + wait):`);
    console.log(`  Avg Thread Time: ${metrics.avgThreadTime.toFixed(2)}ms`);
    console.log(`  Avg Wait Time: ${metrics.avgWaitTime.toFixed(2)}ms`);
    console.log(`  P50: ${metrics.p50Latency.toFixed(2)}ms`);
    console.log(`  P95: ${metrics.p95Latency.toFixed(2)}ms`);
    console.log(`  P99: ${metrics.p99Latency.toFixed(2)}ms`);
    console.log(`\nStatus Distribution:`);
    console.log(`  Success Rate: ${(metrics.successRate * 100).toFixed(2)}%`);
    console.log(`  Timeout Rate: ${(metrics.timeoutRate * 100).toFixed(2)}%`);
    console.log(`  Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%`);
    console.log(`\nMemory Delta:`);
    console.log(`  RSS: ${metrics.memoryDelta.rss.toFixed(2)} MB`);
    console.log(`  Heap Used: ${metrics.memoryDelta.heapUsed.toFixed(2)} MB`);
    console.log(`  External: ${metrics.memoryDelta.external.toFixed(2)} MB`);
  }
}

// Helper to create tasks
async function createTestBlock() {
  // Use a known Solana block for testing - use one that exists in cache
  const block = await getCachedBlock('solana', '348694694');
  const encoded = new TextEncoder().encode(JSON.stringify(block));
  const sharedBuffer = new SharedArrayBuffer(encoded.length);
  new Uint8Array(sharedBuffer).set(encoded);

  return {
    block,
    sharedBuffer,
    sharedBufferLength: encoded.length,
    blockInfo: {
      height: String(block.height),
      network: String(block.network),
      time: String(block.timestamp),
    },
  };
}

describe('MTT Performance Tests', () => {
  const POOL_CONFIGS = {
    small: { maxThreads: 4, concurrentTasksPerWorker: 1 },
    medium: { maxThreads: 8, concurrentTasksPerWorker: 1 },
    large: { maxThreads: 16, concurrentTasksPerWorker: 1 },
  };

  beforeAll(async () => {
    // Start with medium pool
    await initPool({
      filename: join(__dirname, '../dist/threadpool/worker.js'),
      ...POOL_CONFIGS.medium,
    });
  });

  afterAll(async () => {
    await closePool();
  });

  describe('1. Throughput Tests', () => {
    it('should process 100 fast rules efficiently', async () => {
      const tracker = new PerformanceTracker();
      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      const rules = Array.from({ length: 100 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `empty-rule-${i}`,
        })
      );

      const tasks = rules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          tracker.recordStat(stat);
          return stat;
        })
      );

      await Promise.all(tasks);
      const metrics = tracker.finish();
      tracker.printMetrics(metrics, 'Throughput: 100 Fast Rules');

      expect(metrics.successRate).toBeGreaterThan(0.95);
      expect(metrics.tasksPerSecond).toBeGreaterThan(10); // Should be much faster
    });

    it('should process 1000 fast rules efficiently', async () => {
      const tracker = new PerformanceTracker();
      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      const rules = Array.from({ length: 1000 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `empty-rule-${i}`,
        })
      );

      const tasks = rules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          tracker.recordStat(stat);
          return stat;
        })
      );

      await Promise.all(tasks);
      const metrics = tracker.finish();
      tracker.printMetrics(metrics, 'Throughput: 1000 Fast Rules');

      expect(metrics.successRate).toBeGreaterThan(0.95);
      expect(metrics.tasksPerSecond).toBeGreaterThan(10);
    }, 120000); // 2 minute timeout
  });

  describe('2. Latency Distribution Tests', () => {
    it('should measure latency with varying workloads', async () => {
      const tracker = new PerformanceTracker();
      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      // Mix of fast and slower rules
      const rules = [
        ...Array.from({ length: 50 }, (_, i) =>
          createNewAlertRule({
            ruleType: 'EmptyRule',
            id: `empty-${i}`,
          })
        ),
        ...Array.from({ length: 50 }, (_, i) =>
          createNewAlertRule({
            ruleType: 'PercBasedBenchmark',
            id: `perc-${i}`,
            parameters: { perc: 10 }, // 10% chance, with random sleep
          })
        ),
      ];

      const tasks = rules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          tracker.recordStat(stat);
          return stat;
        })
      );

      await Promise.all(tasks);
      const metrics = tracker.finish();
      tracker.printMetrics(metrics, 'Latency Distribution: Mixed Workload');

      expect(metrics.p95Latency).toBeLessThan(2000); // P95 should be under 2s
      expect(metrics.avgWaitTime).toBeLessThan(1000); // Wait time should be reasonable
    }, 60000);
  });

  describe('3. Memory Pressure Tests', () => {
    it('should maintain stable memory under sustained load', async () => {
      const iterations = 10;
      const rulesPerIteration = 100;
      const memorySnapshots: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const { sharedBuffer, sharedBufferLength, blockInfo } =
          await createTestBlock();

        const rules = Array.from({ length: rulesPerIteration }, (_, j) =>
          createNewAlertRule({
            ruleType: 'EmptyRule',
            id: `empty-${i}-${j}`,
          })
        );

        const tasks = rules.map((rule) =>
          runTask({
            alertRule: rule,
            blockInfo,
            sharedBuffer,
            processorsFile: './processors/processors-solana',
          })
        );

        await Promise.all(tasks);

        // Force GC if available
        if (global.gc) {
          global.gc();
        }

        const mem = process.memoryUsage();
        memorySnapshots.push(mem.heapUsed / 1024 / 1024);
        console.log(
          `Iteration ${i + 1}: Heap Used = ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`
        );
      }

      // Check for memory leaks - final memory should not be significantly higher than middle
      const firstHalf = memorySnapshots.slice(0, 5);
      const secondHalf = memorySnapshots.slice(5);
      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond =
        secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      const growthRate = (avgSecond - avgFirst) / avgFirst;

      console.log(`\nMemory Growth Rate: ${(growthRate * 100).toFixed(2)}%`);
      console.log(`First Half Avg: ${avgFirst.toFixed(2)} MB`);
      console.log(`Second Half Avg: ${avgSecond.toFixed(2)} MB`);

      // Memory should not grow more than 50% from first half to second half
      expect(growthRate).toBeLessThan(0.5);
    }, 120000);
  });

  describe('4. Timeout Handling Tests', () => {
    it('should correctly abort hanging rules at 6s threshold', async () => {
      const tracker = new PerformanceTracker();
      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      // Create rules that will hang
      const hangingRules = Array.from({ length: 5 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'Hang',
          id: `hang-${i}`,
        })
      );

      // Mix with some fast rules
      const fastRules = Array.from({ length: 5 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `fast-${i}`,
        })
      );

      const allRules = [...hangingRules, ...fastRules];

      const tasks = allRules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          tracker.recordStat(stat);
          return stat;
        })
      );

      await Promise.all(tasks);
      const metrics = tracker.finish();
      tracker.printMetrics(
        metrics,
        'Timeout Handling: 5 Hanging + 5 Fast Rules'
      );

      // Fast rules should succeed
      const fastStats = tracker['stats'].filter((s) =>
        s.alertRuleId.startsWith('fast-')
      );
      const hangStats = tracker['stats'].filter((s) =>
        s.alertRuleId.startsWith('hang-')
      );

      expect(fastStats.every((s) => s.status === 'success')).toBe(true);
      expect(hangStats.every((s) => s.status === 'timeout')).toBe(true);

      // Timeout rate should be 50%
      expect(metrics.timeoutRate).toBeCloseTo(0.5, 1);

      // Hanging rules should take approximately 6 seconds
      const avgHangTime =
        hangStats.reduce((sum, s) => sum + s.threadTimeSpent, 0) /
        hangStats.length;
      expect(avgHangTime).toBeGreaterThanOrEqual(6000);
      expect(avgHangTime).toBeLessThan(7000); // Should abort shortly after threshold
    }, 60000);
  });

  describe('5. Error Recovery Tests', () => {
    it('should handle failing rules without affecting system health', async () => {
      const tracker = new PerformanceTracker();
      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      // Mix of failing and successful rules
      const failingRules = Array.from({ length: 20 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'ThrowError',
          id: `error-${i}`,
        })
      );

      const successRules = Array.from({ length: 80 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `success-${i}`,
        })
      );

      const allRules = [...failingRules, ...successRules];

      const tasks = allRules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          tracker.recordStat(stat);
          return stat;
        })
      );

      await Promise.all(tasks);
      const metrics = tracker.finish();
      tracker.printMetrics(metrics, 'Error Recovery: 20% Failing Rules');

      expect(metrics.successRate).toBeCloseTo(0.8, 1);
      expect(metrics.errorRate).toBeCloseTo(0.2, 1);

      // System should still process tasks quickly despite errors
      expect(metrics.tasksPerSecond).toBeGreaterThan(10);
    });
  });

  describe('6. Concurrent Rules Scaling Tests', () => {
    const testCases = [
      { count: 10, name: '10 Rules' },
      { count: 100, name: '100 Rules' },
      { count: 500, name: '500 Rules' },
    ];

    testCases.forEach(({ count, name }) => {
      it(`should scale with ${name}`, async () => {
        const tracker = new PerformanceTracker();
        const { sharedBuffer, sharedBufferLength, blockInfo } =
          await createTestBlock();

        const rules = Array.from({ length: count }, (_, i) =>
          createNewAlertRule({
            ruleType: 'EmptyRule',
            id: `scale-${i}`,
          })
        );

        const tasks = rules.map((rule) =>
          runTask({
            alertRule: rule,
            blockInfo,
            sharedBuffer,
            processorsFile: './processors/processors-solana',
          }).then((stat) => {
            tracker.recordStat(stat);
            return stat;
          })
        );

        await Promise.all(tasks);
        const metrics = tracker.finish();
        tracker.printMetrics(metrics, `Scaling: ${name}`);

        expect(metrics.successRate).toBeGreaterThan(0.95);

        // Log scaling efficiency
        console.log(
          `Efficiency: ${(metrics.tasksPerSecond / count).toFixed(4)} tasks/sec per rule`
        );
      }, 120000);
    });
  });

  describe('7. Large Block Processing Tests', () => {
    it('should handle blocks with many transactions', async () => {
      const tracker = new PerformanceTracker();

      // Use the test block - it should have a reasonable number of transactions
      const { sharedBuffer, sharedBufferLength, blockInfo, block } =
        await createTestBlock();

      console.log(`Block has ${block.transactions?.length || 0} transactions`);

      const rules = Array.from({ length: 50 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `large-block-${i}`,
        })
      );

      const tasks = rules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          tracker.recordStat(stat);
          return stat;
        })
      );

      await Promise.all(tasks);
      const metrics = tracker.finish();
      tracker.printMetrics(metrics, 'Large Block Processing');

      expect(metrics.successRate).toBeGreaterThan(0.95);
    });
  });

  describe('8. Mixed Workload Scenarios', () => {
    it('should handle realistic mixed workload', async () => {
      const tracker = new PerformanceTracker();
      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      // Realistic mix:
      // - 70% fast rules (EmptyRule)
      // - 20% variable speed rules (PercBasedBenchmark)
      // - 5% failing rules (ThrowError)
      // - 5% hanging rules (Hang)

      const fastRules = Array.from({ length: 70 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `fast-${i}`,
        })
      );

      const variableRules = Array.from({ length: 20 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'PercBasedBenchmark',
          id: `variable-${i}`,
          parameters: { perc: 20 },
        })
      );

      const failingRules = Array.from({ length: 5 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'ThrowError',
          id: `failing-${i}`,
        })
      );

      const hangingRules = Array.from({ length: 5 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'Hang',
          id: `hanging-${i}`,
        })
      );

      const allRules = [
        ...fastRules,
        ...variableRules,
        ...failingRules,
        ...hangingRules,
      ];

      const tasks = allRules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          tracker.recordStat(stat);
          return stat;
        })
      );

      await Promise.all(tasks);
      const metrics = tracker.finish();
      tracker.printMetrics(
        metrics,
        'Mixed Workload: Realistic Production Scenario'
      );

      // With 5% hanging rules, we expect 5% timeout rate
      expect(metrics.timeoutRate).toBeCloseTo(0.05, 1);

      // With 5% failing rules, we expect 5% error rate
      expect(metrics.errorRate).toBeCloseTo(0.05, 1);

      // Success rate should be ~90% (100% - 5% timeout - 5% error)
      expect(metrics.successRate).toBeGreaterThan(0.85);

      // Overall system should still be performant
      expect(metrics.tasksPerSecond).toBeGreaterThan(5);
    }, 120000);
  });

  describe('9. Thread Pool Utilization Tests', () => {
    it('should report pool utilization metrics', async () => {
      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      const rules = Array.from({ length: 100 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'PercBasedBenchmark',
          id: `utilization-${i}`,
          parameters: { perc: 10 },
        })
      );

      // Track pool metrics before and during
      console.log('\nPool State Before:');
      console.log(`  Queue Size: ${pool.queueSize}`);
      console.log(`  Threads: ${pool.threads.length}`);

      const startTime = Date.now();

      const tasks = rules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        })
      );

      // Check utilization mid-flight
      setTimeout(() => {
        console.log('\nPool State During Execution:');
        console.log(`  Queue Size: ${pool.queueSize}`);
        console.log(`  Threads: ${pool.threads.length}`);
      }, 100);

      await Promise.all(tasks);
      const endTime = Date.now();

      console.log('\nPool State After:');
      console.log(`  Queue Size: ${pool.queueSize}`);
      console.log(`  Duration: ${endTime - startTime}ms`);

      expect(pool.queueSize).toBe(0); // Queue should be empty when done
    }, 60000);
  });

  describe('10. Stats Service Integration Tests', () => {
    it('should track stats correctly across multiple tasks', async () => {
      // Clear stat map before test
      statMap.clear();

      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await createTestBlock();

      const ruleId = 'stats-test-rule';
      const rule = createNewAlertRule({
        ruleType: 'EmptyRule',
        id: ruleId,
      });

      // Run multiple tasks for the same rule
      const taskCount = 20;
      const tasks = Array.from({ length: taskCount }, () =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        }).then((stat) => {
          registerTaskResult(stat);
          return stat;
        })
      );

      await Promise.all(tasks);

      // Check that stats were recorded
      const statsBuffer = statMap.get(ruleId);
      expect(statsBuffer).toBeDefined();
      const stats = statsBuffer!.toArray();
      expect(stats.length).toBe(taskCount);

      // All should be successful
      expect(stats.every((s) => s.status === 'success')).toBe(true);

      console.log(
        `\nStats Service captured ${stats.length} results for rule ${ruleId}`
      );
      console.log(
        `Avg thread time: ${(stats.reduce((sum, s) => sum + s.threadTimeSpent, 0) / stats.length).toFixed(2)}ms`
      );
    });
  });
});
