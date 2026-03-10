import { initPool, runTask, closePool, pool } from './../threadpool/pool';
import { join } from 'path';
import { getCachedBlock, createNewAlertRule } from './../utils/testing-helpers';
import { processPayload } from './../processors/taskProcessor';
import { IAlertRule } from './../types/IAlertRule';

/**
 * MTT Bottleneck Analysis Tests
 *
 * These tests isolate and measure specific components to identify bottlenecks:
 * - FlatBuffer serialization overhead
 * - SharedArrayBuffer allocation and transfer
 * - Worker communication overhead
 * - Pool task distribution efficiency
 * - Stats service file I/O impact
 */

interface ComponentTimings {
  serialization: number;
  bufferAllocation: number;
  taskExecution: number;
  resultProcessing: number;
}

class BottleneckAnalyzer {
  private timings: Map<string, number[]> = new Map();

  recordTiming(component: string, duration: number) {
    if (!this.timings.has(component)) {
      this.timings.set(component, []);
    }
    this.timings.get(component)!.push(duration);
  }

  getStats(component: string) {
    const values = this.timings.get(component) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      total: sum,
    };
  }

  printReport() {
    console.log('\n' + '='.repeat(70));
    console.log('BOTTLENECK ANALYSIS REPORT');
    console.log('='.repeat(70));

    const components = Array.from(this.timings.keys()).sort();

    for (const component of components) {
      const stats = this.getStats(component);
      if (!stats) continue;

      console.log(`\n${component}:`);
      console.log(`  Samples: ${stats.count}`);
      console.log(`  Total Time: ${stats.total.toFixed(2)}ms`);
      console.log(
        `  Min/Avg/Max: ${stats.min.toFixed(2)}ms / ${stats.avg.toFixed(2)}ms / ${stats.max.toFixed(2)}ms`
      );
      console.log(
        `  P50/P95/P99: ${stats.p50.toFixed(2)}ms / ${stats.p95.toFixed(2)}ms / ${stats.p99.toFixed(2)}ms`
      );
    }

    // Calculate total overhead
    const totalComponents = components
      .filter((c) => !c.includes('Total'))
      .map((c) => this.getStats(c)!.total)
      .reduce((a, b) => a + b, 0);

    const totalStats = this.getStats('Total Execution');
    if (totalStats) {
      const overhead =
        ((totalComponents - totalStats.total) / totalStats.total) * 100;
      console.log(`\nOverhead Analysis:`);
      console.log(`  Component Sum: ${totalComponents.toFixed(2)}ms`);
      console.log(`  Total Execution: ${totalStats.total.toFixed(2)}ms`);
      console.log(`  Framework Overhead: ${overhead.toFixed(2)}%`);
    }

    console.log('\n' + '='.repeat(70) + '\n');
  }

  getBottlenecks(): string[] {
    const bottlenecks: string[] = [];
    const componentStats = Array.from(this.timings.keys())
      .map((component) => ({
        component,
        stats: this.getStats(component)!,
      }))
      .filter(({ stats }) => stats !== null);

    // Find components that take >20% of total time
    const totalTime = componentStats.reduce(
      (sum, { stats }) => sum + stats.total,
      0
    );

    for (const { component, stats } of componentStats) {
      const percentage = (stats.total / totalTime) * 100;
      if (percentage > 20) {
        bottlenecks.push(
          `${component} (${percentage.toFixed(1)}% of total time)`
        );
      }
    }

    return bottlenecks;
  }
}

describe('MTT Bottleneck Analysis', () => {
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

  describe('Component Timing Analysis', () => {
    it('should measure FlatBuffer serialization overhead', async () => {
      const analyzer = new BottleneckAnalyzer();
      const iterations = 100;

      const block = await getCachedBlock('solana', '348694694');

      for (let i = 0; i < iterations; i++) {
        const serStart = Date.now();
        const encoded = new TextEncoder().encode(JSON.stringify(block));
        const serEnd = Date.now();

        analyzer.recordTiming('JSON Serialization', serEnd - serStart);

        // Also measure allocation
        const allocStart = Date.now();
        const sharedBuffer = new SharedArrayBuffer(encoded.length);
        new Uint8Array(sharedBuffer).set(encoded);
        const allocEnd = Date.now();

        analyzer.recordTiming(
          'SharedArrayBuffer Allocation',
          allocEnd - allocStart
        );
      }

      analyzer.printReport();

      const serStats = analyzer.getStats('JSON Serialization');
      const allocStats = analyzer.getStats('SharedArrayBuffer Allocation');

      console.log(
        `\nSerialization is ${((serStats!.avg / allocStats!.avg) * 100).toFixed(0)}% of total buffer prep time`
      );

      expect(serStats!.avg).toBeLessThan(100); // Serialization should be fast
      expect(allocStats!.avg).toBeLessThan(50); // Allocation should be fast
    });

    it('should measure end-to-end task execution breakdown', async () => {
      const analyzer = new BottleneckAnalyzer();
      const iterations = 50;

      for (let i = 0; i < iterations; i++) {
        const totalStart = Date.now();

        // 1. Block loading (simulated - already cached)
        const loadStart = Date.now();
        const block = await getCachedBlock('solana', '348694694');
        const loadEnd = Date.now();
        analyzer.recordTiming('1. Block Loading', loadEnd - loadStart);

        // 2. Serialization
        const serStart = Date.now();
        const encoded = new TextEncoder().encode(JSON.stringify(block));
        const sharedBuffer = new SharedArrayBuffer(encoded.length);
        new Uint8Array(sharedBuffer).set(encoded);
        const serEnd = Date.now();
        analyzer.recordTiming(
          '2. Serialization + Buffer Prep',
          serEnd - serStart
        );

        const blockInfo = {
          height: String(block.height),
          network: String(block.network),
          time: String(block.timestamp),
        };

        // 3. Task submission
        const taskStart = Date.now();
        const rule = createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `timing-${i}`,
        });

        const taskPromise = runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength: encoded.length,
          processorsFile: './processors/processors-solana',
        });
        const taskEnd = Date.now();
        analyzer.recordTiming('3. Task Submission', taskEnd - taskStart);

        // 4. Task execution (wait for result)
        const execStart = Date.now();
        const result = await taskPromise;
        const execEnd = Date.now();
        analyzer.recordTiming('4. Task Execution (async)', execEnd - execStart);

        // 5. Result processing (minimal in this test)
        const procStart = Date.now();
        // Normally would call registerTaskResult, but skipping to avoid I/O
        const procEnd = Date.now();
        analyzer.recordTiming('5. Result Processing', procEnd - procStart);

        const totalEnd = Date.now();
        analyzer.recordTiming('Total Pipeline', totalEnd - totalStart);

        // Also record thread vs wait time from result
        analyzer.recordTiming('Thread Time', result.threadTimeSpent);
        analyzer.recordTiming('Wait Time', result.waitTimeSpent);
      }

      analyzer.printReport();

      const bottlenecks = analyzer.getBottlenecks();
      if (bottlenecks.length > 0) {
        console.log('\nIdentified Bottlenecks:');
        bottlenecks.forEach((b) => console.log(`  - ${b}`));
      }

      // Serialization should be small portion of total time
      const serStats = analyzer.getStats('2. Serialization + Buffer Prep');
      const totalStats = analyzer.getStats('Total Pipeline');
      const serPercentage = (serStats!.avg / totalStats!.avg) * 100;

      console.log(
        `\nSerialization is ${serPercentage.toFixed(1)}% of total pipeline time`
      );

      expect(serPercentage).toBeLessThan(30); // Should be less than 30% of total
    });
  });

  describe('Worker Communication Overhead', () => {
    it('should measure overhead of worker thread communication', async () => {
      const analyzer = new BottleneckAnalyzer();
      const block = await getCachedBlock('solana', '348694694');
      const encoded = new TextEncoder().encode(JSON.stringify(block));
      const sharedBuffer = new SharedArrayBuffer(encoded.length);
      new Uint8Array(sharedBuffer).set(encoded);

      const blockInfo = {
        height: String(block.height),
        network: String(block.network),
        time: String(block.timestamp),
      };

      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const rule = createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `comm-${i}`,
        });

        const overallStart = Date.now();
        const result = await runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength: encoded.length,
          processorsFile: './processors/processors-solana',
        });
        const overallEnd = Date.now();

        const totalTime = overallEnd - overallStart;
        const threadTime = result.threadTimeSpent;
        const waitTime = result.waitTimeSpent;
        const commOverhead = totalTime - threadTime - waitTime;

        analyzer.recordTiming('Total Latency', totalTime);
        analyzer.recordTiming('Thread Processing', threadTime);
        analyzer.recordTiming('Queue Wait', waitTime);
        analyzer.recordTiming('Communication Overhead', commOverhead);
      }

      analyzer.printReport();

      const commStats = analyzer.getStats('Communication Overhead');
      const totalStats = analyzer.getStats('Total Latency');

      const commPercentage = (commStats!.avg / totalStats!.avg) * 100;
      console.log(
        `\nCommunication overhead is ${commPercentage.toFixed(1)}% of total latency`
      );

      // Communication overhead should be minimal
      expect(commPercentage).toBeLessThan(20);
    });
  });

  describe('Pool Distribution Efficiency', () => {
    it('should measure how efficiently tasks are distributed across threads', async () => {
      const analyzer = new BottleneckAnalyzer();
      const taskCount = 100;

      const block = await getCachedBlock('solana', '348694694');
      const encoded = new TextEncoder().encode(JSON.stringify(block));
      const sharedBuffer = new SharedArrayBuffer(encoded.length);
      new Uint8Array(sharedBuffer).set(encoded);

      const blockInfo = {
        height: String(block.height),
        network: String(block.network),
        time: String(block.timestamp),
      };

      const rules = Array.from({ length: taskCount }, (_, i) =>
        createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `dist-${i}`,
        })
      );

      const startTime = Date.now();
      const queueSamples: number[] = [];
      const utilizationSamples: number[] = [];

      // Sample pool state during execution
      const sampleInterval = setInterval(() => {
        queueSamples.push(pool.queueSize);
        // Rough utilization estimate: (total threads - queue size) / total threads
        const totalThreads = pool.threads.length;
        const utilization =
          totalThreads > 0
            ? (totalThreads - Math.min(pool.queueSize, totalThreads)) /
              totalThreads
            : 0;
        utilizationSamples.push(utilization);
      }, 10);

      const tasks = rules.map((rule, idx) => {
        const submitTime = Date.now();
        return runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength: encoded.length,
          processorsFile: './processors/processors-solana',
        }).then((result) => {
          const completeTime = Date.now();
          analyzer.recordTiming('Task Latency', completeTime - submitTime);
          return result;
        });
      });

      const results = await Promise.all(tasks);
      const endTime = Date.now();

      clearInterval(sampleInterval);

      const totalDuration = endTime - startTime;
      const totalThreadTime = results.reduce(
        (sum, r) => sum + r.threadTimeSpent,
        0
      );
      const totalWaitTime = results.reduce(
        (sum, r) => sum + r.waitTimeSpent,
        0
      );

      // Calculate parallelism efficiency
      const maxPossibleThreads = pool.threads.length;
      const theoreticalMinTime = totalThreadTime / maxPossibleThreads;
      const actualTime = totalDuration;
      const efficiency = (theoreticalMinTime / actualTime) * 100;

      console.log('\n=== Pool Distribution Efficiency ===');
      console.log(`Total Tasks: ${taskCount}`);
      console.log(`Thread Pool Size: ${maxPossibleThreads}`);
      console.log(`Total Thread Time: ${totalThreadTime.toFixed(2)}ms`);
      console.log(`Total Wait Time: ${totalWaitTime.toFixed(2)}ms`);
      console.log(`Actual Duration: ${actualTime.toFixed(2)}ms`);
      console.log(
        `Theoretical Min Duration: ${theoreticalMinTime.toFixed(2)}ms`
      );
      console.log(`Parallelism Efficiency: ${efficiency.toFixed(2)}%`);

      const avgQueue =
        queueSamples.reduce((a, b) => a + b, 0) / queueSamples.length;
      const maxQueue = Math.max(...queueSamples);
      const avgUtilization =
        utilizationSamples.reduce((a, b) => a + b, 0) /
        utilizationSamples.length;

      console.log(`\nQueue Statistics:`);
      console.log(`  Avg Queue Depth: ${avgQueue.toFixed(2)}`);
      console.log(`  Max Queue Depth: ${maxQueue}`);
      console.log(
        `  Avg Thread Utilization: ${(avgUtilization * 100).toFixed(2)}%`
      );

      analyzer.printReport();

      // Efficiency should be reasonably high (>50%)
      expect(efficiency).toBeGreaterThan(50);

      // High utilization indicates good distribution
      expect(avgUtilization).toBeGreaterThan(0.5);
    });
  });

  describe('TaskProcessor Performance', () => {
    it('should measure processPayload efficiency with multiple rules', async () => {
      const analyzer = new BottleneckAnalyzer();
      const block = await getCachedBlock('solana', '348694694');

      const ruleCounts = [1, 10, 50, 100];

      for (const ruleCount of ruleCounts) {
        const rules: IAlertRule[] = Array.from({ length: ruleCount }, (_, i) =>
          createNewAlertRule({
            ruleType: 'EmptyRule',
            id: `payload-${ruleCount}-${i}`,
          })
        );

        const start = Date.now();
        const stats = await processPayload({
          blockData: block,
          ruleList: rules,
        });
        const end = Date.now();

        const duration = end - start;
        analyzer.recordTiming(`ProcessPayload ${ruleCount} Rules`, duration);

        console.log(
          `ProcessPayload with ${ruleCount} rules: ${duration}ms (${(duration / ruleCount).toFixed(2)}ms per rule)`
        );
      }

      analyzer.printReport();

      // Check if scaling is linear
      const stats1 = analyzer.getStats('ProcessPayload 1 Rules');
      const stats100 = analyzer.getStats('ProcessPayload 100 Rules');

      const scalingFactor = stats100!.avg / stats1!.avg;
      console.log(
        `\nScaling factor (100 rules vs 1 rule): ${scalingFactor.toFixed(2)}x`
      );

      // Ideally scaling should be near-linear (100x for 100 rules)
      // But some overhead is expected
      expect(scalingFactor).toBeGreaterThan(50);
      expect(scalingFactor).toBeLessThan(150);
    }, 120000);
  });

  describe('Stats Service I/O Impact', () => {
    it('should measure file I/O overhead from registerTaskResult', async () => {
      const analyzer = new BottleneckAnalyzer();
      const { registerTaskResult } = require('./services/stats-service');
      const block = await getCachedBlock('solana', '348694694');
      const encoded = new TextEncoder().encode(JSON.stringify(block));
      const sharedBuffer = new SharedArrayBuffer(encoded.length);
      new Uint8Array(sharedBuffer).set(encoded);

      const blockInfo = {
        height: String(block.height),
        network: String(block.network),
        time: String(block.timestamp),
      };

      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const rule = createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `stats-io-${i}`,
        });

        // Measure without stats
        const withoutStatsStart = Date.now();
        const result = await runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength: encoded.length,
          processorsFile: './processors/processors-solana',
        });
        const withoutStatsEnd = Date.now();
        analyzer.recordTiming(
          'Task Without Stats',
          withoutStatsEnd - withoutStatsStart
        );

        // Measure stats registration
        const statsStart = Date.now();
        registerTaskResult(result);
        const statsEnd = Date.now();
        analyzer.recordTiming(
          'Stats Registration (I/O)',
          statsEnd - statsStart
        );
      }

      analyzer.printReport();

      const taskStats = analyzer.getStats('Task Without Stats');
      const ioStats = analyzer.getStats('Stats Registration (I/O)');

      const ioPercentage = (ioStats!.avg / taskStats!.avg) * 100;
      console.log(
        `\nStats I/O is ${ioPercentage.toFixed(1)}% of task execution time`
      );

      // File I/O should be relatively small, but appendFileSync blocks
      // If this is high, it's a bottleneck
      if (ioPercentage > 10) {
        console.log('\n⚠️  WARNING: Stats I/O is a significant bottleneck!');
        console.log(
          '   Consider using async file operations or batching writes.'
        );
      }
    });
  });

  describe('Optimization Recommendations', () => {
    it('should generate optimization recommendations based on measurements', async () => {
      const analyzer = new BottleneckAnalyzer();

      // Run comprehensive benchmark
      const block = await getCachedBlock('solana', '348694694');
      const encoded = new TextEncoder().encode(JSON.stringify(block));
      const sharedBuffer = new SharedArrayBuffer(encoded.length);
      new Uint8Array(sharedBuffer).set(encoded);

      const blockInfo = {
        height: String(block.height),
        network: String(block.network),
        time: String(block.timestamp),
      };

      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        // Measure serialization
        const serStart = Date.now();
        const enc = new TextEncoder().encode(JSON.stringify(block));
        const sb = new SharedArrayBuffer(enc.length);
        new Uint8Array(sb).set(enc);
        const serEnd = Date.now();
        analyzer.recordTiming('Serialization', serEnd - serStart);

        // Measure task execution
        const rule = createNewAlertRule({
          ruleType: 'EmptyRule',
          id: `opt-${i}`,
        });

        const taskStart = Date.now();
        const result = await runTask({
          alertRule: rule,
          blockInfo,
          sharedBuffer,
          sharedBufferLength: encoded.length,
          processorsFile: './processors/processors-solana',
        });
        const taskEnd = Date.now();

        analyzer.recordTiming('Task Total', taskEnd - taskStart);
        analyzer.recordTiming('Thread Time', result.threadTimeSpent);
        analyzer.recordTiming('Wait Time', result.waitTimeSpent);
      }

      analyzer.printReport();
      const bottlenecks = analyzer.getBottlenecks();

      console.log('\n' + '='.repeat(70));
      console.log('OPTIMIZATION RECOMMENDATIONS');
      console.log('='.repeat(70) + '\n');

      const recommendations: string[] = [];

      // Analyze wait time
      const waitStats = analyzer.getStats('Wait Time');
      const threadStats = analyzer.getStats('Thread Time');
      if (waitStats && threadStats) {
        const waitPercentage =
          (waitStats.avg / (waitStats.avg + threadStats.avg)) * 100;
        if (waitPercentage > 30) {
          recommendations.push(
            `High wait time (${waitPercentage.toFixed(1)}%): Consider increasing thread pool size or reducing task submission rate.`
          );
        }
      }

      // Analyze serialization
      const serStats = analyzer.getStats('Serialization');
      const totalStats = analyzer.getStats('Task Total');
      if (serStats && totalStats) {
        const serPercentage = (serStats.avg / totalStats.avg) * 100;
        if (serPercentage > 20) {
          recommendations.push(
            `Serialization overhead is ${serPercentage.toFixed(1)}%: Consider caching serialized blocks or using a faster serialization format.`
          );
        }
      }

      // Add general recommendations
      recommendations.push(
        'Replace fs.appendFileSync with async batched writes to reduce I/O blocking.',
        'Consider using a circular buffer pool with pre-allocated SharedArrayBuffers.',
        'Profile worker.ts to identify slow processor initialization.',
        'Add metrics to track buffer pool hit/miss rates.',
        'Consider implementing task prioritization for time-sensitive rules.'
      );

      recommendations.forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec}\n`);
      });

      console.log('='.repeat(70) + '\n');

      // Always pass - this is a reporting test
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });
});
