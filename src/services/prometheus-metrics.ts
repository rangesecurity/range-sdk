import * as client from 'prom-client';
import { getStatsSummary, getLagStats } from './stats-service';
import { getPoolStats } from '../threadpool/pool';
import { getBufferPoolStats } from '../processors/taskProcessor';
import { prometheusRegistry } from './prometheus-registry';

export { prometheusRegistry };

// Add default Node.js metrics (heap, GC, event loop)
client.collectDefaultMetrics({ register: prometheusRegistry });

// --- Counters ---
const blocksProcessedTotal = new client.Counter({
  name: 'runner_blocks_processed_total',
  help: 'Total number of blocks processed',
  registers: [prometheusRegistry],
});

const ticksProcessedTotal = new client.Counter({
  name: 'runner_ticks_processed_total',
  help: 'Total number of ticks processed',
  registers: [prometheusRegistry],
});

const tasksTotal = new client.Counter({
  name: 'runner_tasks_total',
  help: 'Total tasks by trigger mode and status',
  labelNames: ['trigger_mode', 'status'] as const,
  registers: [prometheusRegistry],
});

const eventsEmittedTotal = new client.Counter({
  name: 'runner_events_emitted_total',
  help: 'Total events emitted',
  registers: [prometheusRegistry],
});

// --- Gauges ---
const rulesTotal = new client.Gauge({
  name: 'runner_rules_total',
  help: 'Number of rules by status',
  labelNames: ['status'] as const,
  registers: [prometheusRegistry],
});

const threadPoolThreads = new client.Gauge({
  name: 'runner_thread_pool_threads',
  help: 'Thread pool threads by state',
  labelNames: ['state'] as const,
  registers: [prometheusRegistry],
});

const queueSize = new client.Gauge({
  name: 'runner_queue_size',
  help: 'Current task queue size',
  registers: [prometheusRegistry],
});

const blockLagSeconds = new client.Gauge({
  name: 'runner_block_lag_seconds',
  help: 'Seconds behind real-time for blocks',
  registers: [prometheusRegistry],
});

const tickLagSeconds = new client.Gauge({
  name: 'runner_tick_lag_seconds',
  help: 'Seconds behind real-time for ticks',
  registers: [prometheusRegistry],
});

const uptimeSeconds = new client.Gauge({
  name: 'runner_uptime_seconds',
  help: 'Service uptime in seconds',
  registers: [prometheusRegistry],
});

const bufferPoolSize = new client.Gauge({
  name: 'runner_buffer_pool_size',
  help: 'Number of buffers in the pool by bucket size',
  labelNames: ['bucket_mb'] as const,
  registers: [prometheusRegistry],
});

// --- Histograms ---
const taskDurationSeconds = new client.Histogram({
  name: 'runner_task_duration_seconds',
  help: 'Task processing duration in seconds',
  labelNames: ['trigger_mode'] as const,
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [prometheusRegistry],
});

// --- Update function (call before scrape) ---
let lastBlocksProcessed = 0;
let lastTicksProcessed = 0;
let lastEventsEmitted = 0;
let lastBlockTasksCompleted = 0;
let lastBlockTasksFailed = 0;
let lastTickTasksCompleted = 0;
let lastTickTasksFailed = 0;

export function updatePrometheusMetrics(): void {
  const stats = getStatsSummary();
  const lag = getLagStats();
  const pool = getPoolStats();
  const bufferStats = getBufferPoolStats();

  // Update counters (increment by delta)
  const blocksDelta =
    (stats.block.total_blocks_processed || 0) - lastBlocksProcessed;
  if (blocksDelta > 0) blocksProcessedTotal.inc(blocksDelta);
  lastBlocksProcessed = stats.block.total_blocks_processed || 0;

  const ticksDelta =
    (stats.tick.total_ticks_processed || 0) - lastTicksProcessed;
  if (ticksDelta > 0) ticksProcessedTotal.inc(ticksDelta);
  lastTicksProcessed = stats.tick.total_ticks_processed || 0;

  const eventsDelta = stats.total_events_emitted - lastEventsEmitted;
  if (eventsDelta > 0) eventsEmittedTotal.inc(eventsDelta);
  lastEventsEmitted = stats.total_events_emitted;

  // Update task counters by trigger_mode and status
  const blockCompletedDelta =
    stats.block.total_tasks_completed - lastBlockTasksCompleted;
  if (blockCompletedDelta > 0) {
    tasksTotal.inc(
      { trigger_mode: 'block', status: 'success' },
      blockCompletedDelta
    );
  }
  lastBlockTasksCompleted = stats.block.total_tasks_completed;

  const blockFailedDelta =
    stats.block.total_tasks_cancelled_skipped - lastBlockTasksFailed;
  if (blockFailedDelta > 0) {
    tasksTotal.inc(
      { trigger_mode: 'block', status: 'failed' },
      blockFailedDelta
    );
  }
  lastBlockTasksFailed = stats.block.total_tasks_cancelled_skipped;

  const tickCompletedDelta =
    stats.tick.total_tasks_completed - lastTickTasksCompleted;
  if (tickCompletedDelta > 0) {
    tasksTotal.inc(
      { trigger_mode: 'tick', status: 'success' },
      tickCompletedDelta
    );
  }
  lastTickTasksCompleted = stats.tick.total_tasks_completed;

  const tickFailedDelta =
    stats.tick.total_tasks_cancelled_skipped - lastTickTasksFailed;
  if (tickFailedDelta > 0) {
    tasksTotal.inc({ trigger_mode: 'tick', status: 'failed' }, tickFailedDelta);
  }
  lastTickTasksFailed = stats.tick.total_tasks_cancelled_skipped;

  // Update gauges
  rulesTotal.set({ status: 'healthy' }, stats.total_healthy_rules);
  rulesTotal.set({ status: 'blocked' }, stats.total_blocked_rules);

  threadPoolThreads.set({ state: 'active' }, pool.active_threads);
  threadPoolThreads.set({ state: 'idle' }, pool.idle_threads);

  queueSize.set(pool.queue_size);

  // Handle -1 (no data) for lag values
  blockLagSeconds.set(lag.block_lag_seconds >= 0 ? lag.block_lag_seconds : 0);
  tickLagSeconds.set(lag.tick_lag_seconds >= 0 ? lag.tick_lag_seconds : 0);

  uptimeSeconds.set(stats.uptime.uptime_seconds);

  // Update buffer pool stats
  for (const bucket of bufferStats.buckets) {
    bufferPoolSize.set({ bucket_mb: String(bucket.size_mb) }, bucket.count);
  }

  // Observe processing times for histogram (convert ms to seconds)
  // Note: These are averages, not individual observations. For more accurate
  // histograms, we would need to track individual task durations.
  if (stats.block.average_processing_time > 0) {
    taskDurationSeconds.observe(
      { trigger_mode: 'block' },
      stats.block.average_processing_time / 1000
    );
  }
  if (stats.tick.average_processing_time > 0) {
    taskDurationSeconds.observe(
      { trigger_mode: 'tick' },
      stats.tick.average_processing_time / 1000
    );
  }
}

export async function getMetrics(): Promise<string> {
  updatePrometheusMetrics();
  return prometheusRegistry.metrics();
}
