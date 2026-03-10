import { initPool, runTask, closePool, pool } from './../threadpool/pool';
import { join } from 'path';
import { getCachedBlock, createNewAlertRule } from './../utils/testing-helpers';
import { performance, PerformanceObserver } from 'perf_hooks';

/**
 * MTT Stress Tests & Bottleneck Identification
 *
 * These tests push the system to its limits to identify:
 * - Maximum sustainable throughput
 * - Memory leak detection
 * - Event loop lag under load
 * - Thread starvation scenarios
 * - Buffer pool efficiency
 */

interface StressMetrics {
  duration: number;
  totalTasks: number;
  throughput: number;
  memoryGrowth: number;
  eventLoopLag: number[];
  gcDuration: number[];
  bufferPoolHits?: number;
  bufferPoolMisses?: number;
}

class StressTestHarness {
  private startMemory: NodeJS.MemoryUsage;
  private eventLoopLags: number[] = [];
  private gcDurations: number[] = [];
  private lagCheckInterval?: NodeJS.Timeout;
  private perfObserver?: PerformanceObserver;

  start() {
    this.startMemory = process.memoryUsage();
    this.eventLoopLags = [];
    this.gcDurations = [];

    // Monitor event loop lag
    this.lagCheckInterval = setInterval(() => {
      const start = Date.now();
      setImmediate(() => {
        const lag = Date.now() - start;
        this.eventLoopLags.push(lag);
      });
    }, 100);

    // Monitor GC if available
    if (performance.eventLoopUtilization) {
      this.perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.entryType === 'gc') {
            this.gcDurations.push(entry.duration);
          }
        }
      });
      this.perfObserver.observe({ entryTypes: ['gc'] });
    }
  }

  stop(): Partial<StressMetrics> {
    if (this.lagCheckInterval) {
      clearInterval(this.lagCheckInterval);
    }

    if (this.perfObserver) {
      this.perfObserver.disconnect();
    }

    const endMemory = process.memoryUsage();
    const memoryGrowth =
      (endMemory.heapUsed - this.startMemory.heapUsed) / 1024 / 1024;

    return {
      eventLoopLag: this.eventLoopLags,
      gcDuration: this.gcDurations,
      memoryGrowth,
    };
  }

  printReport(metrics: Partial<StressMetrics>, testName: string) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`STRESS TEST: ${testName}`);
    console.log('='.repeat(60));

    if (metrics.duration && metrics.totalTasks) {
      console.log(`\nThroughput:`);
      console.log(`  Total Tasks: ${metrics.totalTasks}`);
      console.log(`  Duration: ${metrics.duration}ms`);
      console.log(
        `  Tasks/sec: ${((metrics.totalTasks / metrics.duration) * 1000).toFixed(2)}`
      );
    }

    if (metrics.memoryGrowth !== undefined) {
      console.log(`\nMemory:`);
      console.log(`  Growth: ${metrics.memoryGrowth.toFixed(2)} MB`);
    }

    if (metrics.eventLoopLag && metrics.eventLoopLag.length > 0) {
      const sortedLags = [...metrics.eventLoopLag].sort((a, b) => a - b);
      const p50 = sortedLags[Math.floor(sortedLags.length * 0.5)];
      const p95 = sortedLags[Math.floor(sortedLags.length * 0.95)];
      const p99 = sortedLags[Math.floor(sortedLags.length * 0.99)];
      const max = sortedLags[sortedLags.length - 1];

      console.log(`\nEvent Loop Lag:`);
      console.log(`  Samples: ${metrics.eventLoopLag.length}`);
      console.log(`  P50: ${p50}ms`);
      console.log(`  P95: ${p95}ms`);
      console.log(`  P99: ${p99}ms`);
      console.log(`  Max: ${max}ms`);
    }

    if (metrics.gcDuration && metrics.gcDuration.length > 0) {
      const totalGC = metrics.gcDuration.reduce((a, b) => a + b, 0);
      const avgGC = totalGC / metrics.gcDuration.length;
      console.log(`\nGarbage Collection:`);
      console.log(`  Events: ${metrics.gcDuration.length}`);
      console.log(`  Total Time: ${totalGC.toFixed(2)}ms`);
      console.log(`  Avg Duration: ${avgGC.toFixed(2)}ms`);
    }

    console.log('='.repeat(60) + '\n');
  }
}

describe('MTT Stress Tests', () => {
  beforeAll(async () => {
    await initPool({
      filename: join(__dirname, '../dist/threadpool/worker.js'),
      maxThreads: 8,
      concurrentTasksPerWorker: 1,
    });
  });

  afterAll(async () => {
    await closePool();
  });

  describe('Maximum Throughput Tests', () => {
    it('should find maximum tasks/sec with fast rules', async () => {
      const harness = new StressTestHarness();
      harness.start();

      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await getCachedBlock('solana', '348694694').then((block) => {
          const encoded = new TextEncoder().encode(JSON.stringify(block));
          const sb = new SharedArrayBuffer(encoded.length);
          new Uint8Array(sb).set(encoded);
          return {
            sharedBuffer: sb,
            sharedBufferLength: encoded.length,
            blockInfo: {
              height: String(block.height),
              network: String(block.network),
              time: String(block.timestamp),
            },
          };
        });

      const taskCount = 5000; // High load
      const startTime = Date.now();

      const rules = Array.from({ length: taskCount }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `max-throughput-${i}`,
        })
      );

      const tasks = rules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        })
      );

      const results = await Promise.all(tasks);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const stressMetrics = harness.stop();

      const successCount = results.filter((r) => r.status === 'success').length;
      const throughput = (successCount / duration) * 1000;

      harness.printReport(
        {
          ...stressMetrics,
          duration,
          totalTasks: taskCount,
          throughput,
        },
        'Maximum Throughput with 5000 Fast Rules'
      );

      expect(successCount).toBeGreaterThan(taskCount * 0.95);
      expect(throughput).toBeGreaterThan(50); // Should handle >50 tasks/sec

      // Event loop should not be starved
      const maxLag = Math.max(...(stressMetrics.eventLoopLag || [0]));
      console.log(`Max event loop lag: ${maxLag}ms`);
      expect(maxLag).toBeLessThan(1000); // Should stay under 1s even under max load
    }, 300000); // 5 minute timeout
  });

  describe('Sustained Load Tests', () => {
    it('should maintain performance over extended period', async () => {
      const iterations = 20;
      const tasksPerIteration = 100;
      const harness = new StressTestHarness();

      const throughputs: number[] = [];
      const memorySnapshots: number[] = [];

      harness.start();

      for (let i = 0; i < iterations; i++) {
        const { sharedBuffer, sharedBufferLength, blockInfo } =
          await getCachedBlock('solana', '348694694').then((block) => {
            const encoded = new TextEncoder().encode(JSON.stringify(block));
            const sb = new SharedArrayBuffer(encoded.length);
            new Uint8Array(sb).set(encoded);
            return {
              sharedBuffer: sb,
              sharedBufferLength: encoded.length,
              blockInfo: {
                height: String(block.height),
                network: String(block.network),
                time: String(block.timestamp),
              },
            };
          });

        const rules = Array.from({ length: tasksPerIteration }, (_, j) =>
          createNewAlertRule({
            ruleType: 'EmptyRule',
            id: `sustained-${i}-${j}`,
          })
        );

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

        await Promise.all(tasks);

        const endTime = Date.now();
        const iterationThroughput =
          (tasksPerIteration / (endTime - startTime)) * 1000;
        throughputs.push(iterationThroughput);

        if (global.gc) {
          global.gc();
        }

        const mem = process.memoryUsage();
        memorySnapshots.push(mem.heapUsed / 1024 / 1024);

        console.log(
          `Iteration ${i + 1}/${iterations}: ${iterationThroughput.toFixed(2)} tasks/sec, Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`
        );
      }

      const stressMetrics = harness.stop();

      // Analyze throughput stability
      const avgThroughput =
        throughputs.reduce((a, b) => a + b, 0) / throughputs.length;
      const stdDev = Math.sqrt(
        throughputs.reduce(
          (sum, t) => sum + Math.pow(t - avgThroughput, 2),
          0
        ) / throughputs.length
      );
      const coefficientOfVariation = stdDev / avgThroughput;

      console.log(`\nThroughput Stability:`);
      console.log(`  Average: ${avgThroughput.toFixed(2)} tasks/sec`);
      console.log(`  Std Dev: ${stdDev.toFixed(2)}`);
      console.log(
        `  Coefficient of Variation: ${coefficientOfVariation.toFixed(4)}`
      );

      // Analyze memory trend
      const firstQuarter = memorySnapshots.slice(0, 5);
      const lastQuarter = memorySnapshots.slice(-5);
      const avgFirst =
        firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
      const avgLast =
        lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;
      const memoryGrowth = avgLast - avgFirst;

      console.log(`\nMemory Trend:`);
      console.log(`  First 5 iterations avg: ${avgFirst.toFixed(2)} MB`);
      console.log(`  Last 5 iterations avg: ${avgLast.toFixed(2)} MB`);
      console.log(`  Growth: ${memoryGrowth.toFixed(2)} MB`);

      harness.printReport(
        stressMetrics,
        'Sustained Load: 20 Iterations x 100 Tasks'
      );

      // Throughput should remain stable (CV < 0.3)
      expect(coefficientOfVariation).toBeLessThan(0.3);

      // Memory growth should be bounded
      expect(memoryGrowth).toBeLessThan(100); // Less than 100MB growth
    }, 300000);
  });

  describe('Thread Starvation Tests', () => {
    it('should handle mix of blocking and non-blocking tasks', async () => {
      const harness = new StressTestHarness();
      harness.start();

      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await getCachedBlock('solana', '348694694').then((block) => {
          const encoded = new TextEncoder().encode(JSON.stringify(block));
          const sb = new SharedArrayBuffer(encoded.length);
          new Uint8Array(sb).set(encoded);
          return {
            sharedBuffer: sb,
            sharedBufferLength: encoded.length,
            blockInfo: {
              height: String(block.height),
              network: String(block.network),
              time: String(block.timestamp),
            },
          };
        });

      // Create a scenario where some threads will be blocked for a while
      const slowRules = Array.from({ length: 10 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'PercBasedBenchmark',
          id: `slow-${i}`,
          parameters: { perc: 100 }, // Always trigger, random sleep up to 10s
        })
      );

      const fastRules = Array.from({ length: 100 }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `fast-${i}`,
        })
      );

      // Submit slow tasks first
      const slowTasks = slowRules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        })
      );

      // Wait a bit, then submit fast tasks
      await new Promise((resolve) => setTimeout(resolve, 100));

      const fastStartTime = Date.now();
      const fastTasks = fastRules.map((rule) =>
        runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength,
          processorsFile: './processors/processors-solana',
        })
      );

      const fastResults = await Promise.all(fastTasks);
      const fastEndTime = Date.now();
      const fastDuration = fastEndTime - fastStartTime;

      // Wait for slow tasks to complete
      await Promise.all(slowTasks);

      const stressMetrics = harness.stop();

      const fastThroughput = (100 / fastDuration) * 1000;

      console.log(
        `\nFast Tasks Throughput (while slow tasks running): ${fastThroughput.toFixed(2)} tasks/sec`
      );
      console.log(`Fast Tasks Duration: ${fastDuration}ms`);

      harness.printReport(
        stressMetrics,
        'Thread Starvation: 10 Slow + 100 Fast Tasks'
      );

      // Fast tasks should still complete reasonably quickly
      // even while slow tasks are using some threads
      expect(fastDuration).toBeLessThan(10000); // Should finish in under 10s
    }, 120000);
  });

  describe('Buffer Pool Efficiency Tests', () => {
    it('should efficiently reuse SharedArrayBuffers', async () => {
      const iterations = 50;
      const harness = new StressTestHarness();
      harness.start();

      for (let i = 0; i < iterations; i++) {
        const { sharedBuffer, sharedBufferLength, blockInfo } =
          await getCachedBlock('solana', '348694694').then((block) => {
            const encoded = new TextEncoder().encode(JSON.stringify(block));
            const sb = new SharedArrayBuffer(encoded.length);
            new Uint8Array(sb).set(encoded);
            return {
              sharedBuffer: sb,
              sharedBufferLength: encoded.length,
              blockInfo: {
                height: String(block.height),
                network: String(block.network),
                time: String(block.timestamp),
              },
            };
          });

        const rules = Array.from({ length: 20 }, (_, j) =>
          createNewAlertRule({
            ruleType: 'EmptyRule',
            id: `buffer-${i}-${j}`,
          })
        );

        const tasks = rules.map((rule) =>
          runTask({
            alertRule: rule,
            blockInfo,
            sharedBuffer,
            sharedBufferLength,
            processorsFile: './processors/processors-solana',
          })
        );

        await Promise.all(tasks);

        // Allow buffer pool to reclaim
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      const stressMetrics = harness.stop();

      harness.printReport(
        stressMetrics,
        'Buffer Pool Efficiency: 50 Iterations x 20 Tasks'
      );

      // Memory growth should be minimal if buffers are being reused
      expect(stressMetrics.memoryGrowth!).toBeLessThan(50); // Less than 50MB growth
    }, 120000);
  });

  describe('Queue Depth Analysis', () => {
    it('should measure queue depth under varying load', async () => {
      const harness = new StressTestHarness();
      harness.start();

      const queueDepths: number[] = [];
      const sampleInterval = setInterval(() => {
        queueDepths.push(pool.queueSize);
      }, 50); // Sample every 50ms

      const { sharedBuffer, sharedBufferLength, blockInfo } =
        await getCachedBlock('solana', '348694694').then((block) => {
          const encoded = new TextEncoder().encode(JSON.stringify(block));
          const sb = new SharedArrayBuffer(encoded.length);
          new Uint8Array(sb).set(encoded);
          return {
            sharedBuffer: sb,
            sharedBufferLength: encoded.length,
            blockInfo: {
              height: String(block.height),
              network: String(block.network),
              time: String(block.timestamp),
            },
          };
        });

      // Create bursts of tasks
      const burstSize = 200;
      const burstCount = 5;

      for (let burst = 0; burst < burstCount; burst++) {
        const rules = Array.from({ length: burstSize }, (_, i) =>
          createNewAlertRule({
            ruleType: 'PercBasedBenchmark',
            id: `queue-${burst}-${i}`,
            parameters: { perc: 50 },
          })
        );

        const tasks = rules.map((rule) =>
          runTask({
            alertRule: rule,
            blockInfo,
            sharedBuffer,
            sharedBufferLength,
            processorsFile: './processors/processors-solana',
          })
        );

        // Wait for burst to complete
        await Promise.all(tasks);

        // Small delay between bursts
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      clearInterval(sampleInterval);
      const stressMetrics = harness.stop();

      // Analyze queue depths
      const maxQueue = Math.max(...queueDepths);
      const avgQueue =
        queueDepths.reduce((a, b) => a + b, 0) / queueDepths.length;
      const nonZeroDepths = queueDepths.filter((d) => d > 0);
      const avgNonZero =
        nonZeroDepths.length > 0
          ? nonZeroDepths.reduce((a, b) => a + b, 0) / nonZeroDepths.length
          : 0;

      console.log(`\nQueue Depth Analysis:`);
      console.log(`  Samples: ${queueDepths.length}`);
      console.log(`  Max Depth: ${maxQueue}`);
      console.log(`  Avg Depth: ${avgQueue.toFixed(2)}`);
      console.log(`  Avg Non-Zero Depth: ${avgNonZero.toFixed(2)}`);
      console.log(
        `  % Time Queue Empty: ${((queueDepths.filter((d) => d === 0).length / queueDepths.length) * 100).toFixed(2)}%`
      );

      harness.printReport(stressMetrics, 'Queue Depth: 5 Bursts x 200 Tasks');

      // Queue should drain eventually
      const finalDepth = queueDepths[queueDepths.length - 1];
      expect(finalDepth).toBe(0);
    }, 180000);
  });

  describe('Memory Leak Detection', () => {
    it('should detect potential memory leaks over many iterations', async () => {
      const iterations = 50;
      const harness = new StressTestHarness();

      const memorySnapshots: Array<{
        iteration: number;
        rss: number;
        heapUsed: number;
        external: number;
      }> = [];

      harness.start();

      for (let i = 0; i < iterations; i++) {
        const { sharedBuffer, sharedBufferLength, blockInfo } =
          await getCachedBlock('solana', '348694694').then((block) => {
            const encoded = new TextEncoder().encode(JSON.stringify(block));
            const sb = new SharedArrayBuffer(encoded.length);
            new Uint8Array(sb).set(encoded);
            return {
              sharedBuffer: sb,
              sharedBufferLength: encoded.length,
              blockInfo: {
                height: String(block.height),
                network: String(block.network),
                time: String(block.timestamp),
              },
            };
          });

        const rules = Array.from({ length: 50 }, (_, j) =>
          createNewAlertRule({
            ruleType: 'EmptyRule',
            id: `leak-${i}-${j}`,
          })
        );

        const tasks = rules.map((rule) =>
          runTask({
            alertRule: rule,
            blockInfo,
            sharedBuffer,
            sharedBufferLength,
            processorsFile: './processors/processors-solana',
          })
        );

        await Promise.all(tasks);

        // Force GC every 5 iterations
        if (i % 5 === 0 && global.gc) {
          global.gc();
          // Wait for GC to complete
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const mem = process.memoryUsage();
        memorySnapshots.push({
          iteration: i,
          rss: mem.rss / 1024 / 1024,
          heapUsed: mem.heapUsed / 1024 / 1024,
          external: mem.external / 1024 / 1024,
        });

        if (i % 10 === 0) {
          console.log(
            `Iteration ${i}: RSS=${mem.rss / 1024 / 1024} MB, Heap=${mem.heapUsed / 1024 / 1024} MB`
          );
        }
      }

      const stressMetrics = harness.stop();

      // Perform linear regression on heap memory to detect trend
      const n = memorySnapshots.length;
      const sumX = memorySnapshots.reduce((sum, s) => sum + s.iteration, 0);
      const sumY = memorySnapshots.reduce((sum, s) => sum + s.heapUsed, 0);
      const sumXY = memorySnapshots.reduce(
        (sum, s) => sum + s.iteration * s.heapUsed,
        0
      );
      const sumXX = memorySnapshots.reduce(
        (sum, s) => sum + s.iteration * s.iteration,
        0
      );

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      console.log(`\nMemory Leak Analysis (Linear Regression):`);
      console.log(`  Slope: ${slope.toFixed(4)} MB/iteration`);
      console.log(`  Intercept: ${intercept.toFixed(2)} MB`);
      console.log(
        `  Projected growth over 1000 iterations: ${(slope * 1000).toFixed(2)} MB`
      );

      harness.printReport(
        stressMetrics,
        'Memory Leak Detection: 50 Iterations x 50 Tasks'
      );

      // Slope should be minimal (less than 0.1 MB per iteration)
      expect(Math.abs(slope)).toBeLessThan(0.1);

      // Total memory growth should be reasonable
      const firstMem = memorySnapshots[0].heapUsed;
      const lastMem = memorySnapshots[memorySnapshots.length - 1].heapUsed;
      const totalGrowth = lastMem - firstMem;

      console.log(`Total heap growth: ${totalGrowth.toFixed(2)} MB`);
      expect(totalGrowth).toBeLessThan(200); // Less than 200MB total growth
    }, 300000);
  });
});
