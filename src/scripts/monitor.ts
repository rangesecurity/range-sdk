import { config } from 'dotenv';
config({ quiet: true });

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Configuration
// =============================================================================

const RUNNERS: { name: string; port: number }[] = [
  { name: 'solana', port: 3100 },
  { name: 'arb1', port: 3101 },
  { name: 'bnb', port: 3102 },
  { name: 'eth', port: 3103 },
  { name: 'pol', port: 3104 },
];

const POLL_INTERVAL_MS = 30_000;
const STARTUP_DELAY_MS = 60_000;
const HOURLY_SUMMARY_INTERVAL_MS = 3_600_000;
const CACHE_DIR = path.join(process.cwd(), '.logs');
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!;

const http = axios.create({ timeout: 10_000 });

// =============================================================================
// Types
// =============================================================================

interface MonitorState {
  ruleIds: string[];
  ruleHealth: Record<string, string>;
  ruleErrors: Record<string, string[]>;
  overallHealth: string;
  runnerReachable: boolean;
  lastUpdated: string;
}

interface RuleDetail {
  alert_rule_id: string;
  trigger_mode: 'BLOCK' | 'TICK';
  status: 'healthy' | 'blocked';
  last_3_errors: string[];
  block_total_tasks?: number;
  block_total_tasks_completed?: number;
  block_average_processing_time?: number;
  block_total_events_emitted?: number;
  tick_total_tasks?: number;
  tick_total_tasks_completed?: number;
  tick_average_processing_time?: number;
  tick_total_events_emitted?: number;
}

interface StatsSummary {
  block: {
    total_blocks_processed?: number;
    total_tasks: number;
    total_tasks_completed: number;
    total_events_emitted: number;
    average_processing_time: number;
    success_rate: number;
  };
  tick: {
    total_ticks_processed?: number;
    total_tasks: number;
    total_tasks_completed: number;
    total_events_emitted: number;
    average_processing_time: number;
    success_rate: number;
  };
  total_rules_available: number;
  total_healthy_rules: number;
  total_blocked_rules: number;
  total_events_emitted: number;
  memory: {
    rss_mb: number;
    heap_used_mb: number;
    heap_total_mb: number;
  };
  uptime: {
    started_at: string;
    uptime_seconds: number;
    uptime_human: string;
  };
  details: RuleDetail[];
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  last_block_received_at?: string;
  last_tick_received_at?: string;
}

interface LagResponse {
  block_lag_seconds: number;
  tick_lag_seconds: number;
  last_block_height: number | null;
  is_caught_up: boolean;
}

// =============================================================================
// State (per runner)
// =============================================================================

const states: Record<string, MonitorState> = {};
const firstPoll: Record<string, boolean> = {};
const lastHourlyTotals: Record<string, { blocks: number; ticks: number }> = {};

function initState(name: string): MonitorState {
  return {
    ruleIds: [],
    ruleHealth: {},
    ruleErrors: {},
    overallHealth: 'unknown',
    runnerReachable: true,
    lastUpdated: new Date().toISOString(),
  };
}

function cachePath(name: string): string {
  return path.join(CACHE_DIR, `monitor-cache-${name}.json`);
}

// =============================================================================
// Cache (file-based persistence)
// =============================================================================

function loadCache(name: string): MonitorState | null {
  try {
    const fp = cachePath(name);
    if (fs.existsSync(fp)) {
      const raw = fs.readFileSync(fp, 'utf8');
      const cached = JSON.parse(raw) as MonitorState;
      log(
        `[${name}] Loaded cached state: ${cached.ruleIds.length} rules, health=${cached.overallHealth}`
      );
      return cached;
    }
  } catch (err) {
    log(`[${name}] Failed to load cache: ${err}`);
  }
  return null;
}

function saveCache(name: string) {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePath(name), JSON.stringify(states[name], null, 2));
  } catch (err) {
    log(`[${name}] Failed to save cache: ${err}`);
  }
}

// =============================================================================
// Logging
// =============================================================================

function log(msg: string) {
  const ts = new Date().toISOString();
  console.log(`${ts} | monitor | ${msg}`);
}

// =============================================================================
// Slack
// =============================================================================

async function sendSlack(text: string) {
  try {
    await http.post(SLACK_WEBHOOK_URL, { text });
  } catch (err: any) {
    log(`Slack send failed: ${err.message || err}`);
  }
}

// =============================================================================
// Polling (per runner)
// =============================================================================

async function fetchEndpoint<T>(
  baseUrl: string,
  endpoint: string
): Promise<T | null> {
  try {
    const res = await http.get<T>(`${baseUrl}${endpoint}`);
    return res.data;
  } catch {
    return null;
  }
}

async function pollRunner(runner: { name: string; port: number }) {
  const { name, port } = runner;
  const baseUrl = `http://127.0.0.1:${port}`;
  const state = states[name];

  const stats = await fetchEndpoint<StatsSummary>(baseUrl, '/stats');
  const health = await fetchEndpoint<HealthResponse>(baseUrl, '/health');
  const lag = await fetchEndpoint<LagResponse>(baseUrl, '/stats/lag');

  // Runner unreachable
  if (!stats || !health) {
    if (state.runnerReachable) {
      state.runnerReachable = false;
      saveCache(name);
      await sendSlack(
        `:red_circle: *[${name}] Runner Unreachable*\n` +
          `Could not reach \`${baseUrl}\`.\n` +
          `Last known state: ${state.overallHealth}, ${state.ruleIds.length} rules`
      );
    }
    return;
  }

  // Runner recovered from unreachable
  if (!state.runnerReachable) {
    state.runnerReachable = true;
    await sendSlack(
      `:large_green_circle: *[${name}] Runner Recovered*\n` +
        `Runner is reachable again. Uptime: ${stats.uptime.uptime_human}`
    );
  }

  // Build current snapshot
  const currentRuleIds = stats.details.map((d) => d.alert_rule_id);
  const currentHealth: Record<string, string> = {};
  const currentErrors: Record<string, string[]> = {};
  for (const d of stats.details) {
    currentHealth[d.alert_rule_id] = d.status;
    currentErrors[d.alert_rule_id] = d.last_3_errors || [];
  }

  const alerts: string[] = [];

  // --- Detect rule changes ---

  const prevSet = new Set(state.ruleIds);
  const currSet = new Set(currentRuleIds);

  // New rules
  const added = currentRuleIds.filter((id) => !prevSet.has(id));
  for (const id of added) {
    const detail = stats.details.find((d) => d.alert_rule_id === id);
    alerts.push(
      `:new: *[${name}] New Rule:* \`${id}\` (${detail?.trigger_mode || '?'})`
    );
  }

  // Deleted rules
  const removed = state.ruleIds.filter((id) => !currSet.has(id));
  for (const id of removed) {
    alerts.push(`:wastebasket: *[${name}] Rule Deleted:* \`${id}\``);
  }

  // --- Detect health transitions ---

  for (const id of currentRuleIds) {
    const prev = state.ruleHealth[id];
    const curr = currentHealth[id];

    if (prev && prev !== curr) {
      if (curr === 'blocked') {
        const errors = currentErrors[id];
        const errorText =
          errors.length > 0
            ? `\nRecent errors:\n${errors.map((e) => `> ${e}`).join('\n')}`
            : '';
        alerts.push(
          `:red_circle: *[${name}] Rule Unhealthy:* \`${id}\`${errorText}`
        );
      } else if (curr === 'healthy') {
        alerts.push(
          `:large_green_circle: *[${name}] Rule Recovered:* \`${id}\``
        );
      }
    }
  }

  // --- New errors on rules (not seen in previous poll) ---

  for (const id of currentRuleIds) {
    const prevErrors = new Set(state.ruleErrors[id] || []);
    const currErrors = currentErrors[id] || [];
    const newErrors = currErrors.filter((e) => !prevErrors.has(e));

    if (newErrors.length > 0 && state.ruleHealth[id] === currentHealth[id]) {
      alerts.push(
        `:warning: *[${name}] New errors on* \`${id}\`:\n${newErrors.map((e) => `> ${e}`).join('\n')}`
      );
    }
  }

  // --- Overall health change ---

  if (
    state.overallHealth !== 'unknown' &&
    state.overallHealth !== health.status
  ) {
    const lagText = lag
      ? `Block lag: ${lag.block_lag_seconds}s, Tick lag: ${lag.tick_lag_seconds}s, Caught up: ${lag.is_caught_up ? 'yes' : 'no'}`
      : 'Lag data unavailable';
    const icon =
      health.status === 'healthy' ? ':large_green_circle:' : ':red_circle:';
    alerts.push(
      `${icon} *[${name}] Overall Health:* ${state.overallHealth} -> ${health.status}\n${lagText}`
    );
  }

  // --- Send alerts ---

  if (!firstPoll[name] && alerts.length > 0) {
    await sendSlack(alerts.join('\n\n---\n\n'));
  }

  if (firstPoll[name] && alerts.length > 0) {
    log(
      `[${name}] First poll — skipping ${alerts.length} alert(s) to avoid startup spam`
    );
  }

  // --- Update state ---

  states[name] = {
    ruleIds: currentRuleIds,
    ruleHealth: currentHealth,
    ruleErrors: currentErrors,
    overallHealth: health.status,
    runnerReachable: true,
    lastUpdated: new Date().toISOString(),
  };
  saveCache(name);

  firstPoll[name] = false;

  log(
    `[${name}] Poll OK: ${health.status}, ${stats.total_healthy_rules}/${stats.total_rules_available} healthy, ` +
      `mem=${stats.memory.heap_used_mb}MB, alerts=${alerts.length}`
  );
}

async function pollAll() {
  await Promise.all(RUNNERS.map((r) => pollRunner(r)));
}

// =============================================================================
// Hourly Summary (unified)
// =============================================================================

async function hourlySummary() {
  const lines: string[] = [];

  for (const runner of RUNNERS) {
    const { name, port } = runner;
    const baseUrl = `http://127.0.0.1:${port}`;

    const stats = await fetchEndpoint<StatsSummary>(baseUrl, '/stats');

    if (!stats) {
      lines.push(`*${name}* — :red_circle: unreachable`);
      continue;
    }

    const state = states[name];
    const health = state?.overallHealth || 'unknown';
    const isHealthy = health === 'healthy';

    // Compute hourly block/tick deltas
    const currentBlocks =
      stats.block.total_blocks_processed ?? stats.block.total_tasks;
    const currentTicks =
      stats.tick.total_ticks_processed ?? stats.tick.total_tasks;
    const prev = lastHourlyTotals[name];
    let blocksLastHour = currentBlocks;
    let ticksLastHour = currentTicks;
    if (prev) {
      blocksLastHour =
        currentBlocks >= prev.blocks
          ? currentBlocks - prev.blocks
          : currentBlocks;
      ticksLastHour =
        currentTicks >= prev.ticks ? currentTicks - prev.ticks : currentTicks;
    }
    lastHourlyTotals[name] = { blocks: currentBlocks, ticks: currentTicks };

    const blockWarn = blocksLastHour < 30 ? ' :warning:' : '';
    const tickWarn = ticksLastHour < 30 ? ' :warning:' : '';
    const throughput = ` | Blocks/hr: ${blocksLastHour}${blockWarn} | Ticks/hr: ${ticksLastHour}${tickWarn}`;

    const headline =
      `*${name}* — ${isHealthy ? health : ':red_circle: ' + health}` +
      ` | ${stats.total_healthy_rules}/${stats.total_rules_available} rules` +
      ` | Uptime: ${stats.uptime.uptime_human}` +
      ` | heap ${stats.memory.heap_used_mb}MB / RSS ${stats.memory.rss_mb}MB` +
      throughput;

    if (isHealthy) {
      lines.push(headline);
      continue;
    }

    // Unhealthy — expand with details
    const detail: string[] = [headline];

    const lag = await fetchEndpoint<LagResponse>(baseUrl, '/stats/lag');
    const lagText = lag
      ? `Lag: block ${lag.block_lag_seconds}s, tick ${lag.tick_lag_seconds}s`
      : 'Lag data unavailable';
    detail.push(
      `  ${lagText} | Avg block: ${stats.block.average_processing_time.toFixed(1)}ms`
    );

    const blockedRules = stats.details
      .filter((d) => d.status === 'blocked')
      .map((d) => d.alert_rule_id);
    if (blockedRules.length > 0) {
      detail.push(
        `  Blocked: ${blockedRules.map((r) => `\`${r}\``).join(', ')}`
      );
    }

    const allErrors: string[] = [];
    for (const d of stats.details) {
      if (d.last_3_errors?.length > 0) {
        allErrors.push(...d.last_3_errors);
      }
    }
    const uniqueErrors = Array.from(new Set(allErrors));
    if (uniqueErrors.length > 0) {
      detail.push(
        `  Errors (${uniqueErrors.length}):\n${uniqueErrors
          .slice(0, 5)
          .map((e) => `  > ${e}`)
          .join('\n')}`
      );
    }

    lines.push(detail.join('\n'));
  }

  const text = `:clock1: *Hourly Summary*\n\n${lines.join('\n')}`;

  await sendSlack(text);
  log('Hourly summary sent');
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  log(
    `Monitor starting. Runners: ${RUNNERS.map((r) => `${r.name}:${r.port}`).join(', ')}`
  );
  log(`Waiting ${STARTUP_DELAY_MS / 1000}s before first poll...`);

  // Load persisted state per runner
  for (const runner of RUNNERS) {
    const cached = loadCache(runner.name);
    if (cached) {
      states[runner.name] = cached;
      firstPoll[runner.name] = false;
    } else {
      states[runner.name] = initState(runner.name);
      firstPoll[runner.name] = true;
    }
  }

  // Wait for runners to warm up
  await new Promise((resolve) => setTimeout(resolve, STARTUP_DELAY_MS));

  log('Starting poll loop');

  // First poll
  await pollAll();

  // Startup summary (same format as hourly)
  await hourlySummary();

  // Poll loop
  setInterval(async () => {
    try {
      await pollAll();
    } catch (err) {
      log(`Poll error: ${err}`);
    }
  }, POLL_INTERVAL_MS);

  // Hourly summary
  setInterval(async () => {
    try {
      await hourlySummary();
    } catch (err) {
      log(`Hourly summary error: ${err}`);
    }
  }, HOURLY_SUMMARY_INTERVAL_MS);
}

main().catch((err) => {
  console.error('Monitor fatal error:', err);
  process.exit(1);
});
