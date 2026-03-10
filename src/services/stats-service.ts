import { IStat } from '../types/ITask';
import { IAlertRule } from '../types/IAlertRule';
import { IEvent } from '../types/IEvent';
import { dayjs } from '../utils/dayjs';
import cron from 'node-cron';
import { logger } from '../utils/logger';
import { axios } from './axios';
import { env } from '../env';
import * as fs from 'fs';
import * as path from 'path';

// Constants - reduced to be more aggressive about memory cleanup
const MIN_SAMPLE_SIZE = 10;
const MAX_SAMPLE_SIZE = 10000; // Reduced from 2000 to limit memory usage
const STAT_CONSIDERATION_LIMIT = 60 * 60 * 1000; // 1 hour
const MAX_ALLOWED_TIMEOUTS = 2;
const HEALTHY_BLOCK_THRESHOLD_MS = 1_000;
const HEALTHY_TICK_THRESHOLD_MS = 10_000;

/**
 * Circular buffer for stats - avoids unbounded growth and GC pauses from splice()
 */
class CircularStatBuffer {
  private buffer: (IStat | undefined)[];
  private writeIndex = 0;
  private size = 0;
  private readonly capacity: number;

  constructor(capacity = MAX_SAMPLE_SIZE) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  push(stat: IStat) {
    this.buffer[this.writeIndex] = stat;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;
    if (this.size < this.capacity) this.size++;
  }

  getSize(): number {
    return this.size;
  }

  toArray(): IStat[] {
    if (this.size === 0) return [];
    if (this.size < this.capacity) {
      return this.buffer.slice(0, this.size) as IStat[];
    }
    // Full buffer: return in chronological order
    return [
      ...this.buffer.slice(this.writeIndex),
      ...this.buffer.slice(0, this.writeIndex),
    ] as IStat[];
  }

  // Filter stats by time - returns new array (doesn't modify buffer)
  filterByTime(cutoffTime: dayjs.Dayjs): IStat[] {
    return this.toArray().filter((stat) =>
      dayjs(stat.startedAt).isAfter(cutoffTime)
    );
  }
}

/**
 * Slim JSONL writer — one line per task, only useful fields.
 * Drops events[], error, waitTimeSpent, alertRuleId (in filename), blockInfo.network/time, tickInfo.
 * Fields omitted when empty/zero to minimize line size.
 */
class StatLogger {
  private buffer: { alertRuleId: string; line: string }[] = [];
  private streams = new Map<string, fs.WriteStream>();
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private logsDir: string;
  private isShuttingDown = false;
  private readonly FLUSH_THRESHOLD = 100;
  private readonly FLUSH_INTERVAL_MS = 1000;

  constructor() {
    this.logsDir = env.STATS_LOG_DIR;
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  start() {
    if (!this.flushInterval) {
      this.flushInterval = setInterval(
        () => this.flush(),
        this.FLUSH_INTERVAL_MS
      );
    }
  }

  log(alertRuleId: string, stat: IStat) {
    if (this.isShuttingDown) return;

    const slim: Record<string, any> = {
      ts: new Date(stat.startedAt).getTime(),
      s: stat.status,
      pt: stat.threadTimeSpent,
    };
    if (stat.eventCount > 0) slim.ec = stat.eventCount;
    if (stat.blockInfo) slim.h = stat.blockInfo.height;
    if (stat.events?.length > 0) slim.ev = stat.events;
    if (stat.error) slim.err = stat.error;

    const line = JSON.stringify(slim) + '\n';
    this.buffer.push({ alertRuleId, line });
    if (this.buffer.length >= this.FLUSH_THRESHOLD) {
      this.flush();
    }
  }

  private getStream(alertRuleId: string): fs.WriteStream {
    if (!this.streams.has(alertRuleId)) {
      const filePath = path.join(this.logsDir, `${alertRuleId}.jsonl`);
      const stream = fs.createWriteStream(filePath, { flags: 'a' });
      this.streams.set(alertRuleId, stream);
    }
    return this.streams.get(alertRuleId)!;
  }

  private flush() {
    if (this.buffer.length === 0) return;

    const grouped = new Map<string, string[]>();
    for (const item of this.buffer) {
      if (!grouped.has(item.alertRuleId)) {
        grouped.set(item.alertRuleId, []);
      }
      grouped.get(item.alertRuleId)!.push(item.line);
    }

    this.buffer = [];

    for (const [alertRuleId, lines] of grouped) {
      const stream = this.getStream(alertRuleId);
      stream.write(lines.join(''));
    }
  }

  private async closeStreams(): Promise<void> {
    const closePromises: Promise<void>[] = [];
    for (const stream of this.streams.values()) {
      closePromises.push(
        new Promise((resolve) => {
          stream.end(() => resolve());
        })
      );
    }
    await Promise.all(closePromises);
    this.streams.clear();
  }

  /** Remove lines older than STAT_RETENTION_DAYS from all JSONL files */
  async compact(): Promise<void> {
    const retentionMs = env.STAT_RETENTION_DAYS * 86_400_000;
    const cutoff = Date.now() - retentionMs;

    await this.closeStreams();

    const files = fs
      .readdirSync(this.logsDir)
      .filter((f: string) => f.endsWith('.jsonl'));
    let totalRemoved = 0;
    let totalKept = 0;

    for (const file of files) {
      const filePath = path.join(this.logsDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').filter((l: string) => l.trim());
        const kept: string[] = [];

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            // New format uses ts, legacy uses startedAt
            const ts = parsed.ts ?? new Date(parsed.startedAt).getTime();
            if (ts >= cutoff) {
              kept.push(line);
            } else {
              totalRemoved++;
            }
          } catch {
            totalRemoved++;
          }
        }

        totalKept += kept.length;
        fs.writeFileSync(
          filePath,
          kept.length > 0 ? kept.join('\n') + '\n' : ''
        );
      } catch {
        // Skip files that can't be read
      }
    }

    if (totalKept > 0 || totalRemoved > 0) {
      logger.info(
        `Stats compaction: kept ${totalKept} lines, removed ${totalRemoved} lines across ${files.length} files`
      );
    }
  }

  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush();
    await this.closeStreams();
  }
}

// Singleton stat logger instance
const statLogger = new StatLogger();

// State - using circular buffers instead of unbounded arrays
export const statMap: Map<string, CircularStatBuffer> = new Map();
let statQueue: IStat[] = [];
let blockRuleList: IAlertRule[] = [];
let tickRuleList: IAlertRule[] = [];

// Track when blocks and ticks are received (not processed)
let lastBlockReceivedAt: number | null = null;
let lastTickReceivedAt: number | null = null;
let lastBlockHeight: number | null = null;
let lastBlockTime: string | null = null;
let lastTickTime: string | null = null;

// Service start time for uptime tracking
const serviceStartedAt = Date.now();

// Memory history for time series (sampled every 10 seconds, keep 1 hour)
interface IMemorySample {
  timestamp: number;
  heap_mb: number;
  rss_mb: number;
}
const memoryHistory: IMemorySample[] = [];
const MEMORY_SAMPLE_INTERVAL = 10_000; // 10 seconds
const MEMORY_HISTORY_MAX = 360; // 1 hour at 10s intervals

function sampleMemory() {
  const mem = process.memoryUsage();
  memoryHistory.push({
    timestamp: Date.now(),
    heap_mb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
    rss_mb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
  });
  if (memoryHistory.length > MEMORY_HISTORY_MAX) {
    memoryHistory.shift();
  }
}

// Export memory history for time series
export function getMemoryHistory(): IMemorySample[] {
  return memoryHistory;
}

// Periodic cleanup to prevent memory leaks
let lastCleanupTime = Date.now();
const CLEANUP_INTERVAL = 2 * 60 * 1000; // Every 2 minutes

// Stats cache for getStatsSummary()
let statsCache: IStatsSummary | null = null;
let statsCacheTime = 0;
const STATS_CACHE_TTL = 5000; // 5 seconds

// Core stat management functions
export function registerTaskResult(stat: IStat) {
  // Invalidate stats cache when new stats arrive
  statsCache = null;

  statQueue.push(stat);

  if (!statMap.has(stat.alertRuleId)) {
    statMap.set(stat.alertRuleId, new CircularStatBuffer());
  }

  const statsBuffer = statMap.get(stat.alertRuleId)!;
  statsBuffer.push(stat);

  // Circular buffer handles size limits automatically - no splice needed

  // Log to JSONL file asynchronously (non-blocking)
  statLogger.log(stat.alertRuleId, stat);

  // Trigger cleanup if enough time has passed
  const now = Date.now();
  if (now - lastCleanupTime > CLEANUP_INTERVAL) {
    process.nextTick(() => {
      cleanupStatQueue();
    });
    lastCleanupTime = now;
  }
}

export function showStats() {
  for (const key of statMap.keys()) {
    const statsBuffer = statMap.get(key)!;
    const stats = statsBuffer.toArray();
    if (stats.length === 0) {
      continue;
    }

    const isHealthy = isHealthyBlockRule(stats);
    if (!isHealthy) {
      const blockedUntil = dayjs(stats[stats.length - 1].startedAt).add(
        STAT_CONSIDERATION_LIMIT,
        'ms'
      );

      logger.warn(
        `Alert rule ${key} is blocked, unlocking in ${dayjs(blockedUntil).fromNow(true)}`
      );
      continue;
    }

    const totalTime = stats.reduce(
      (acc, curr) => acc + curr.threadTimeSpent,
      0
    );
    const total = stats.length;
    const avgTimeElapsed = totalTime / total;
    // logger.info(`Alert rule ${key} is healthy, avg time: ${avgTimeElapsed}ms`);
  }
}

function trimStats() {
  // With circular buffers, we don't need to trim by size.
  // Just remove rules that have no recent stats (inactive rules).
  const keysToDelete: string[] = [];

  for (const ruleId of statMap.keys()) {
    const statsBuffer = statMap.get(ruleId)!;
    if (statsBuffer.getSize() === 0) {
      keysToDelete.push(ruleId);
    }
  }

  // Batch delete empty entries
  keysToDelete.forEach((key) => statMap.delete(key));
}

function cleanupStatQueue() {
  // Keep only recent stats in the queue to prevent unbounded growth
  const maxQueueSize = 1000;
  if (statQueue.length > maxQueueSize) {
    statQueue = statQueue.slice(-maxQueueSize);
  }
}

// Health check functions - optimized to avoid unnecessary object creation
function isHealthyBlockRule(stats: IStat[] | undefined): boolean {
  if (!stats) return true;

  // Count timeouts more efficiently
  let timeoutCount = 0;
  let totalTime = 0;

  for (const stat of stats) {
    if (stat.status === 'timeout') {
      timeoutCount++;
    }
    totalTime += stat.threadTimeSpent;
  }

  if (timeoutCount >= MAX_ALLOWED_TIMEOUTS) {
    return false;
  }

  if (stats.length < MIN_SAMPLE_SIZE) return true;

  const avgTimeElapsed = totalTime / stats.length;
  return avgTimeElapsed < HEALTHY_BLOCK_THRESHOLD_MS;
}

function isHealthyTickRule(stats: IStat[] | undefined): boolean {
  if (!stats) return true;

  let timeoutCount = 0;
  let totalTime = 0;

  for (const stat of stats) {
    if (stat.status === 'timeout') {
      timeoutCount++;
    }
    totalTime += stat.threadTimeSpent;
  }

  const avgTimeElapsed = totalTime / stats.length;

  if (timeoutCount >= MAX_ALLOWED_TIMEOUTS) {
    return false;
  }

  if (stats.length < MIN_SAMPLE_SIZE) return true;

  return avgTimeElapsed < HEALTHY_TICK_THRESHOLD_MS;
}

// Rule management functions
export function getHealthyBlockRules() {
  // Avoid calling trimStats on every call - let the periodic cleanup handle it
  return blockRuleList.filter((e) => {
    const buffer = statMap.get(e.id);
    return isHealthyBlockRule(buffer?.toArray());
  });
}

export function getHealthyTickRules() {
  // Avoid calling trimStats on every call - let the periodic cleanup handle it
  return tickRuleList.filter((e) => {
    const buffer = statMap.get(e.id);
    return isHealthyTickRule(buffer?.toArray());
  });
}

export interface IBlockTickStats {
  total_blocks_processed?: number;
  total_ticks_processed?: number;
  total_tasks: number;
  total_tasks_completed: number;
  total_tasks_cancelled_skipped: number;
  total_events_emitted: number;

  average_processing_time: number;
  success_rate: number;
}

export interface IRuleDetail {
  alert_rule_id: string;
  trigger_mode: 'BLOCK' | 'TICK';
  // Block-specific fields (only present if trigger_mode === 'BLOCK')
  block_total_tasks?: number;
  block_total_tasks_completed?: number;
  block_total_tasks_cancelled_skipped?: number;
  block_total_events_emitted?: number;

  block_average_processing_time?: number;
  // Tick-specific fields (only present if trigger_mode === 'TICK')
  tick_total_tasks?: number;
  tick_total_tasks_completed?: number;
  tick_total_tasks_cancelled_skipped?: number;
  tick_total_events_emitted?: number;

  tick_average_processing_time?: number;
  status: 'healthy' | 'blocked';
  last_3_events: IEvent[];
  last_3_errors: string[];
}

export interface IMemoryStats {
  rss_mb: number;
  heap_used_mb: number;
  heap_total_mb: number;
  external_mb: number;
  array_buffers_mb: number;
}

export interface IStatsSummary {
  block: IBlockTickStats;
  tick: IBlockTickStats;
  total_rules_available: number;
  total_healthy_rules: number;
  total_blocked_rules: number;
  total_events_emitted: number;
  memory: IMemoryStats;
  uptime: IUptimeStats;
  details: IRuleDetail[];
}

/**
 * Get current memory usage statistics
 */
export function getMemoryStats(): IMemoryStats {
  const memUsage = process.memoryUsage();
  return {
    rss_mb: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
    heap_used_mb: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
    heap_total_mb: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
    external_mb: Math.round((memUsage.external / 1024 / 1024) * 100) / 100,
    array_buffers_mb:
      Math.round((memUsage.arrayBuffers / 1024 / 1024) * 100) / 100,
  };
}

export function getStatsSummary(): IStatsSummary {
  // Return cached stats if still valid
  const now = Date.now();
  if (statsCache && now - statsCacheTime < STATS_CACHE_TTL) {
    return statsCache;
  }

  const result = computeStatsSummary();
  statsCache = result;
  statsCacheTime = now;
  return result;
}

function computeStatsSummary(): IStatsSummary {
  // Block-level stats
  let totalBlocksProcessed = 0;
  let blockTasksCompleted = 0;
  let blockTasksCancelledSkipped = 0;
  let blockEventsEmitted = 0;
  let blockTotalWaitTime = 0;
  let blockTotalProcessingTime = 0;

  // Tick-level stats
  let totalTicksProcessed = 0;
  let tickTasksCompleted = 0;
  let tickTasksCancelledSkipped = 0;
  let tickEventsEmitted = 0;
  let tickTotalWaitTime = 0;
  let tickTotalProcessingTime = 0;

  // Calculate rule statistics
  const totalRulesAvailable = blockRuleList.length + tickRuleList.length;
  const healthyBlockRules = getHealthyBlockRules();
  const healthyTickRules = getHealthyTickRules();
  const healthyRuleIds = new Set([
    ...healthyBlockRules.map((r) => r.id),
    ...healthyTickRules.map((r) => r.id),
  ]);
  const totalHealthyRules = healthyRuleIds.size;
  const totalBlockedRules = totalRulesAvailable - totalHealthyRules;

  // Build details for each rule and accumulate totals
  const details: IRuleDetail[] = [];
  const allRules = [...blockRuleList, ...tickRuleList];
  const blockRuleIds = new Set(blockRuleList.map((r) => r.id));
  const tickRuleIds = new Set(tickRuleList.map((r) => r.id));

  for (const rule of allRules) {
    const ruleId = rule.id;
    const statsBuffer = statMap.get(ruleId);
    const stats = statsBuffer?.toArray() || [];
    const isBlockRule = blockRuleIds.has(ruleId);
    const triggerMode: 'BLOCK' | 'TICK' = isBlockRule ? 'BLOCK' : 'TICK';

    // Rule-level stats (unified - only one type per rule)
    let ruleTasksCompleted = 0;
    let ruleTasksCancelledSkipped = 0;
    let ruleEventsEmitted = 0;
    let ruleTotalWaitTime = 0;
    let ruleTotalProcessingTime = 0;
    let ruleTaskCount = 0;

    // Collect all events and errors chronologically
    const allEvents: IEvent[] = [];
    const allErrors: string[] = [];

    for (const stat of stats) {
      // Only process stats that match the rule's trigger mode
      if (isBlockRule && stat.blockInfo) {
        totalBlocksProcessed++;

        // Count task statuses for blocks
        if (stat.status === 'success') {
          blockTasksCompleted++;
          ruleTasksCompleted++;
        } else if (stat.status === 'failure' || stat.status === 'timeout') {
          blockTasksCancelledSkipped++;
          ruleTasksCancelledSkipped++;
        }

        // Sum block events
        const eventCount = stat.eventCount || 0;
        blockEventsEmitted += eventCount;
        ruleEventsEmitted += eventCount;

        // Accumulate wait and processing times for blocks
        blockTotalWaitTime += stat.waitTimeSpent || 0;
        blockTotalProcessingTime += stat.threadTimeSpent || 0;
        ruleTotalWaitTime += stat.waitTimeSpent || 0;
        ruleTotalProcessingTime += stat.threadTimeSpent || 0;
        ruleTaskCount++;

        // Collect events and errors for this rule
        if (stat.events && stat.events.length > 0) {
          allEvents.push(...stat.events);
        }
        if (stat.error) {
          allErrors.push(stat.error);
        }
      } else if (!isBlockRule && stat.tickInfo) {
        totalTicksProcessed++;

        // Count task statuses for ticks
        if (stat.status === 'success') {
          tickTasksCompleted++;
          ruleTasksCompleted++;
        } else if (stat.status === 'failure' || stat.status === 'timeout') {
          tickTasksCancelledSkipped++;
          ruleTasksCancelledSkipped++;
        }

        // Sum tick events
        const eventCount = stat.eventCount || 0;
        tickEventsEmitted += eventCount;
        ruleEventsEmitted += eventCount;

        // Accumulate wait and processing times for ticks
        tickTotalWaitTime += stat.waitTimeSpent || 0;
        tickTotalProcessingTime += stat.threadTimeSpent || 0;
        ruleTotalWaitTime += stat.waitTimeSpent || 0;
        ruleTotalProcessingTime += stat.threadTimeSpent || 0;
        ruleTaskCount++;

        // Collect events and errors for this rule
        if (stat.events && stat.events.length > 0) {
          allEvents.push(...stat.events);
        }
        if (stat.error) {
          allErrors.push(stat.error);
        }
      }
    }

    // Get last 3 events and errors
    const last3Events = allEvents.slice(-3);
    const last3Errors = allErrors.slice(-3);

    // Determine if rule is healthy or blocked
    const isHealthy = healthyRuleIds.has(ruleId);
    const status: 'healthy' | 'blocked' = isHealthy ? 'healthy' : 'blocked';

    // Calculate averages for rule
    const ruleAvgWaitTime =
      ruleTaskCount > 0 ? ruleTotalWaitTime / ruleTaskCount : 0;
    const ruleAvgProcessingTime =
      ruleTaskCount > 0 ? ruleTotalProcessingTime / ruleTaskCount : 0;

    // Build rule detail based on trigger mode
    const ruleDetail: IRuleDetail = {
      alert_rule_id: ruleId,
      trigger_mode: triggerMode,
      status,
      last_3_events: last3Events,
      last_3_errors: last3Errors,
    };

    if (triggerMode === 'BLOCK') {
      ruleDetail.block_total_tasks =
        ruleTasksCompleted + ruleTasksCancelledSkipped;
      ruleDetail.block_total_tasks_completed = ruleTasksCompleted;
      ruleDetail.block_total_tasks_cancelled_skipped =
        ruleTasksCancelledSkipped;
      ruleDetail.block_total_events_emitted = ruleEventsEmitted;
      ruleDetail.block_average_processing_time = ruleAvgProcessingTime;
    } else {
      ruleDetail.tick_total_tasks =
        ruleTasksCompleted + ruleTasksCancelledSkipped;
      ruleDetail.tick_total_tasks_completed = ruleTasksCompleted;
      ruleDetail.tick_total_tasks_cancelled_skipped = ruleTasksCancelledSkipped;
      ruleDetail.tick_total_events_emitted = ruleEventsEmitted;
      ruleDetail.tick_average_processing_time = ruleAvgProcessingTime;
    }

    details.push(ruleDetail);
  }

  // Total tasks = total blocks/ticks processed (each task execution)
  const blockTotalTasks = totalBlocksProcessed;
  const tickTotalTasks = totalTicksProcessed;

  // Calculate averages for block and tick stats
  const blockAvgWaitTime =
    blockTotalTasks > 0 ? blockTotalWaitTime / blockTotalTasks : 0;
  const blockAvgProcessingTime =
    blockTotalTasks > 0 ? blockTotalProcessingTime / blockTotalTasks : 0;
  const tickAvgWaitTime =
    tickTotalTasks > 0 ? tickTotalWaitTime / tickTotalTasks : 0;
  const tickAvgProcessingTime =
    tickTotalTasks > 0 ? tickTotalProcessingTime / tickTotalTasks : 0;

  // Calculate success rates (completed / total * 100)
  const blockSuccessRate =
    blockTotalTasks > 0 ? (blockTasksCompleted / blockTotalTasks) * 100 : 0;
  const tickSuccessRate =
    tickTotalTasks > 0 ? (tickTasksCompleted / tickTotalTasks) * 100 : 0;

  return {
    block: {
      total_blocks_processed: totalBlocksProcessed,
      total_tasks: blockTotalTasks,
      total_tasks_completed: blockTasksCompleted,
      total_tasks_cancelled_skipped: blockTasksCancelledSkipped,
      total_events_emitted: blockEventsEmitted,
      average_processing_time: blockAvgProcessingTime,
      success_rate: blockSuccessRate,
    },
    tick: {
      total_ticks_processed: totalTicksProcessed,
      total_tasks: tickTotalTasks,
      total_tasks_completed: tickTasksCompleted,
      total_tasks_cancelled_skipped: tickTasksCancelledSkipped,
      total_events_emitted: tickEventsEmitted,
      average_processing_time: tickAvgProcessingTime,
      success_rate: tickSuccessRate,
    },
    total_rules_available: totalRulesAvailable,
    total_healthy_rules: totalHealthyRules,
    total_blocked_rules: totalBlockedRules,
    total_events_emitted: blockEventsEmitted + tickEventsEmitted,
    memory: getMemoryStats(),
    uptime: getUptimeStats(),
    details,
  };
}

// Functions to track when blocks and ticks are received
export function recordBlockReceived(height?: number, blockTime?: string) {
  lastBlockReceivedAt = Date.now();
  if (height !== undefined) lastBlockHeight = height;
  if (blockTime) lastBlockTime = blockTime;
}

export function recordTickReceived(tickTime?: string) {
  lastTickReceivedAt = Date.now();
  if (tickTime) lastTickTime = tickTime;
}

// Uptime tracking
export interface IUptimeStats {
  started_at: string;
  uptime_seconds: number;
  uptime_human: string;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

export function getUptimeStats(): IUptimeStats {
  const uptimeSeconds = Math.floor((Date.now() - serviceStartedAt) / 1000);
  return {
    started_at: dayjs(serviceStartedAt).toISOString(),
    uptime_seconds: uptimeSeconds,
    uptime_human: formatUptime(uptimeSeconds),
  };
}

// Lag tracking
export interface ILagStats {
  block_lag_seconds: number;
  tick_lag_seconds: number;
  last_block_height: number | null;
  last_block_time: string | null;
  last_tick_time: string | null;
  last_block_received_at: string | null;
  last_tick_received_at: string | null;
  is_caught_up: boolean;
}

export function getLagStats(): ILagStats {
  const now = Date.now();
  const blockLagSeconds = lastBlockReceivedAt
    ? Math.floor((now - lastBlockReceivedAt) / 1000)
    : -1;
  const tickLagSeconds = lastTickReceivedAt
    ? Math.floor((now - lastTickReceivedAt) / 1000)
    : -1;

  // Caught up if block lag < 30s and tick lag < 2min
  const isCaughtUp =
    blockLagSeconds >= 0 &&
    blockLagSeconds < 30 &&
    tickLagSeconds >= 0 &&
    tickLagSeconds < 120;

  return {
    block_lag_seconds: blockLagSeconds,
    tick_lag_seconds: tickLagSeconds,
    last_block_height: lastBlockHeight,
    last_block_time: lastBlockTime,
    last_tick_time: lastTickTime,
    last_block_received_at: lastBlockReceivedAt
      ? dayjs(lastBlockReceivedAt).toISOString()
      : null,
    last_tick_received_at: lastTickReceivedAt
      ? dayjs(lastTickReceivedAt).toISOString()
      : null,
    is_caught_up: isCaughtUp,
  };
}

export function checkStanding() {
  const now = Date.now();
  const BLOCK_THRESHOLD_MS = 30 * 1000; // 30 seconds
  const TICK_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes

  // Check if we have recent block and tick reception (not processing)
  const hasRecentBlock =
    lastBlockReceivedAt !== null &&
    now - lastBlockReceivedAt <= BLOCK_THRESHOLD_MS;
  const hasRecentTick =
    lastTickReceivedAt !== null &&
    now - lastTickReceivedAt <= TICK_THRESHOLD_MS;

  const ok = hasRecentBlock && hasRecentTick;

  return {
    status: ok ? 'healthy' : 'unhealthy',
    last_block_received_at: lastBlockReceivedAt
      ? dayjs(lastBlockReceivedAt).toISOString()
      : undefined,
    last_tick_received_at: lastTickReceivedAt
      ? dayjs(lastTickReceivedAt).toISOString()
      : undefined,
  };
}

export async function fetchRules(testAlertRules: IAlertRule[]) {
  if (env.NODE_ENV === 'local' && testAlertRules?.length) {
    blockRuleList = testAlertRules.filter((e) => e.triggerMode === 'BLOCK');
    tickRuleList = testAlertRules.filter((e) => e.triggerMode === 'TICK');
    return;
  }

  try {
    const res = await axios.get(env.FETCH_RULE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${env.RANGE_SDK_TOKEN}`,
      },
    });

    const rules = res.data.rules;

    blockRuleList = rules.filter((e: IAlertRule) => e.triggerMode === 'BLOCK');
    tickRuleList = rules.filter((e: IAlertRule) => e.triggerMode === 'TICK');

    if (!blockRuleList.length && !tickRuleList.length) {
      logger.error('No rules found');
      throw new Error('No rules found');
    }

    logger.info(
      `Fetched ${blockRuleList.length} block rules and ${tickRuleList.length} tick rules`
    );
  } catch (error) {
    logger.error('Error fetching rules:', error);
    throw error;
  }
}

// --- Named cron callbacks (started by initStatsSchedulers) ---

function runStatsCleanup() {
  try {
    trimStats();
    cleanupStatQueue();
    if (global.gc) {
      global.gc();
    }
    logger.debug(
      `Stats cleanup completed. Active rules: ${statMap.size}, Queue size: ${statQueue.length}`
    );
  } catch (error) {
    logger.error('Error during stats cleanup:', error);
  }
}

async function runDailyCompaction() {
  try {
    await statLogger.compact();
  } catch (err) {
    logger.error('Daily compaction failed:', err);
  }
}

let lastMemoryReport = Date.now();
function runMemoryReport() {
  const now = Date.now();
  if (now - lastMemoryReport > 5 * 60 * 1000) {
    const memUsage = process.memoryUsage();
    logger.info(
      `Memory: RSS=${(memUsage.rss / 1024 / 1024).toFixed(0)}MB, Heap=${(memUsage.heapUsed / 1024 / 1024).toFixed(0)}MB, Stats=${statMap.size} rules`
    );
    lastMemoryReport = now;
  }
}

// --- Scheduler lifecycle ---

type ScheduledTask = ReturnType<typeof cron.schedule>;

const cronTasks: ScheduledTask[] = [];
let memorySamplerHandle: ReturnType<typeof setInterval> | null = null;
let showStatsHandle: ReturnType<typeof setInterval> | null = null;

export function initStatsSchedulers() {
  if (env.NODE_ENV === 'test') return;

  statLogger.start();
  statLogger
    .compact()
    .catch((err) => logger.error('Startup compaction failed:', err));

  cronTasks.push(
    cron.schedule('*/2 * * * *', runStatsCleanup),
    cron.schedule('59 23 * * *', runDailyCompaction),
    cron.schedule('*/5 * * * *', runMemoryReport),
    cron.schedule('*/1 * * * *', runStatsUpload)
  );

  memorySamplerHandle = setInterval(sampleMemory, MEMORY_SAMPLE_INTERVAL);
  showStatsHandle = setInterval(showStats, 60 * 1000);
}

export function stopStatsSchedulers() {
  for (const task of cronTasks) {
    task.stop();
  }
  cronTasks.length = 0;

  if (memorySamplerHandle) {
    clearInterval(memorySamplerHandle);
    memorySamplerHandle = null;
  }
  if (showStatsHandle) {
    clearInterval(showStatsHandle);
    showStatsHandle = null;
  }
}

export async function shutdownStatsService(): Promise<void> {
  stopStatsSchedulers();
  await statLogger.shutdown();
}

interface ITaskExecution {
  network: string | null;
  height: string | null;
  processorId: string;
  totalEvents: number;
  steps: string[];
  error: string | undefined;
  input: {
    timestamp: string;
    runner: string;
  };
  metadata_indexed: {
    uploadedAt: string;
    source: string;
    uniqueId: string;
  };
  environment: string;
}

async function upload() {
  if (env.NODE_ENV === 'local') return;
  if (!statQueue.length) return;

  const copiedStatList = [...statQueue];
  statQueue = [];

  const statList: ITaskExecution[] = copiedStatList.map((e) => {
    return {
      environment: env.NODE_ENV,
      error: e.error,
      height: e.blockInfo?.height || null,
      input: {
        timestamp: (e.blockInfo?.time || e.tickInfo?.time)!,
        runner: env.RUNNER_ID,
      },
      metadata_indexed: {
        source: 'cron-upload',
        uniqueId: '',
        uploadedAt: dayjs().toISOString(),
      },
      network: e.blockInfo?.network || null,
      processorId: e.alertRuleId,
      steps: [],
      totalEvents: e.eventCount,
    };
  });

  const url = `${env.MONITORING_SERVER_URL}/block-engine/${env.NODE_ENV}/blocks/evaluations`;

  // Upload in batches of 50
  const BATCH_SIZE = 50;
  let totalUploaded = 0;

  for (let i = 0; i < statList.length; i += BATCH_SIZE) {
    const batch = statList.slice(i, i + BATCH_SIZE);

    try {
      await axios.post(url, batch, {
        headers: {
          Authorization: `Bearer ${env.MONITORING_SERVER_TOKEN}`,
        },
        timeout: 30_000,
      });

      totalUploaded += batch.length;
    } catch (err: any) {
      logger.error(`Stats upload failed: ${err.message || err}`);
      return;
    }
  }

  logger.info(
    `Uploaded ${totalUploaded} stats in ${Math.ceil(statList.length / BATCH_SIZE)} batch(es)`
  );
}

async function runStatsUpload() {
  await upload();
}

// Time series data types
export type TimeSeriesMetric =
  | 'events_per_minute'
  | 'block_avg_processing_time'
  | 'tick_avg_processing_time'
  | 'throughput_tasks'
  | 'success_rate'
  | 'memory_heap';

export interface ITimeSeriesPoint {
  timestamp: string; // ISO timestamp
  value: number;
}

export interface ITimeSeriesResponse {
  metric: TimeSeriesMetric;
  interval: string; // e.g., "1m", "5m"
  data: ITimeSeriesPoint[];
  frames?: any[]; // Optional frames array for Grafana compatibility
}

/**
 * Read and aggregate stats from JSONL log files for time series
 */
export function getTimeSeriesData(
  metric: TimeSeriesMetric,
  intervalMinutes: number = 1,
  durationMinutes: number = 60
): ITimeSeriesResponse {
  const logsDir = env.STATS_LOG_DIR;

  if (!fs.existsSync(logsDir)) {
    return {
      metric,
      interval: `${intervalMinutes}m`,
      data: [],
    };
  }

  // Calculate time range
  const now = dayjs();
  const startTime = now.subtract(durationMinutes, 'minutes');
  const intervalMs = intervalMinutes * 60 * 1000;

  // Initialize time buckets
  const buckets: Map<
    number,
    {
      count: number;
      sum: number;
      events: number;
      success: number;
      failed: number;
    }
  > = new Map();
  const numBuckets = Math.ceil(durationMinutes / intervalMinutes);

  for (let i = 0; i < numBuckets; i++) {
    const bucketTime = startTime.add(i * intervalMinutes, 'minutes');
    const bucketKey = bucketTime.startOf('minute').valueOf();
    buckets.set(bucketKey, {
      count: 0,
      sum: 0,
      events: 0,
      success: 0,
      failed: 0,
    });
  }

  // For memory_heap metric, use memory history instead of JSONL
  if (metric === 'memory_heap') {
    const data: ITimeSeriesPoint[] = memoryHistory
      .filter((sample) => {
        const sampleTime = dayjs(sample.timestamp);
        return sampleTime.isAfter(startTime) && sampleTime.isBefore(now);
      })
      .map((sample) => ({
        timestamp: dayjs(sample.timestamp).toISOString(),
        value: sample.heap_mb,
      }));

    return {
      metric,
      interval: `${intervalMinutes}m`,
      data,
      frames: [
        {
          schema: {
            fields: [
              { name: 'Time', type: 'time' },
              { name: 'Value', type: 'number' },
            ],
          },
          data: {
            values: [
              data.map((d) => new Date(d.timestamp).getTime()),
              data.map((d) => d.value),
            ],
          },
        },
      ],
    };
  }

  // Read all JSONL files (supports both new aggregated and legacy IStat formats)
  const files = fs
    .readdirSync(logsDir)
    .filter((file: string) => file.endsWith('.jsonl'));

  for (const file of files) {
    const filePath = path.join(logsDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter((line: string) => line.trim());

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const isSlim = 'ts' in parsed;

          // Determine timestamp
          const ts = isSlim ? parsed.ts : new Date(parsed.startedAt).getTime();
          if (ts < startTime.valueOf() || ts > now.valueOf()) continue;

          const bucketKey = Math.floor(ts / 60_000) * 60_000;
          if (!buckets.has(bucketKey)) {
            buckets.set(bucketKey, {
              count: 0,
              sum: 0,
              events: 0,
              success: 0,
              failed: 0,
            });
          }
          const bucket = buckets.get(bucketKey)!;

          if (isSlim) {
            // New slim format: {ts, s, pt, ec?, h?, ev?, err?}
            switch (metric) {
              case 'events_per_minute':
                bucket.events += parsed.ec || 0;
                bucket.count += 1;
                break;
              case 'block_avg_processing_time':
                if (parsed.h !== undefined) {
                  bucket.sum += parsed.pt || 0;
                  bucket.count += 1;
                }
                break;
              case 'tick_avg_processing_time':
                if (parsed.h === undefined) {
                  bucket.sum += parsed.pt || 0;
                  bucket.count += 1;
                }
                break;
              case 'throughput_tasks':
                bucket.count += 1;
                break;
              case 'success_rate':
                bucket.count += 1;
                if (parsed.s === 'success') {
                  bucket.success += 1;
                } else {
                  bucket.failed += 1;
                }
                break;
            }
          } else {
            // Legacy format: full IStat
            const stat = parsed as IStat;
            switch (metric) {
              case 'events_per_minute':
                bucket.events += stat.eventCount || 0;
                bucket.count += 1;
                break;
              case 'block_avg_processing_time':
                if (stat.blockInfo) {
                  bucket.sum += stat.threadTimeSpent || 0;
                  bucket.count += 1;
                }
                break;
              case 'tick_avg_processing_time':
                if (stat.tickInfo) {
                  bucket.sum += stat.threadTimeSpent || 0;
                  bucket.count += 1;
                }
                break;
              case 'throughput_tasks':
                bucket.count += 1;
                break;
              case 'success_rate':
                bucket.count += 1;
                if (stat.status === 'success') {
                  bucket.success += 1;
                } else {
                  bucket.failed += 1;
                }
                break;
            }
          }
        } catch {
          continue;
        }
      }
    } catch {
      continue;
    }
  }

  // Convert buckets to time series points
  const data: ITimeSeriesPoint[] = Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([timestamp, bucket]) => {
      let value = 0;

      switch (metric) {
        case 'events_per_minute':
          // Total events in this bucket divided by interval minutes
          value = bucket.count > 0 ? bucket.events / intervalMinutes : 0;
          break;

        case 'block_avg_processing_time':
        case 'tick_avg_processing_time':
          // Average processing time in this bucket
          value = bucket.count > 0 ? bucket.sum / bucket.count : 0;
          break;

        case 'throughput_tasks':
          // Tasks per minute
          value = bucket.count / intervalMinutes;
          break;

        case 'success_rate':
          // Success rate as percentage
          value =
            bucket.count > 0 ? (bucket.success / bucket.count) * 100 : 100;
          break;
      }

      return {
        timestamp: dayjs(timestamp).toISOString(),
        value: Math.round(value * 100) / 100, // Round to 2 decimal places
      };
    })
    .filter((point) => {
      // Only include buckets that have data (except for metrics where 0 is valid)
      return (
        point.value > 0 ||
        metric === 'events_per_minute' ||
        metric === 'throughput_tasks' ||
        metric === 'success_rate'
      );
    });

  // Return in format compatible with Grafana JSON API plugin
  // The plugin expects an array of objects with timestamp and value fields
  return {
    metric,
    interval: `${intervalMinutes}m`,
    data,
    // Also provide a frames array for better Grafana compatibility
    frames: [
      {
        schema: {
          fields: [
            {
              name: 'Time',
              type: 'time',
            },
            {
              name: 'Value',
              type: 'number',
            },
          ],
        },
        data: {
          values: [
            data.map((d) => new Date(d.timestamp).getTime()),
            data.map((d) => d.value),
          ],
        },
      },
    ],
  };
}
