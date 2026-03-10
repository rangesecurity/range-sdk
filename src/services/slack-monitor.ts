import cron from 'node-cron';
import axios from 'axios';
import { env } from '../env';
import { logger } from '../utils/logger';
import { getStatsSummary, checkStanding, getLagStats } from './stats-service';

let lastSentAt = 0;

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function buildSummary(): string {
  const stats = getStatsSummary();
  const standing = checkStanding();
  const lag = getLagStats();

  const network = env.RUNNER_NETWORK;
  const health = standing.status;
  const icon = health === 'healthy' ? ':large_green_circle:' : ':red_circle:';

  const lines: string[] = [
    `${icon} *Runner Summary — ${network}*`,
    `Health: ${health} | Rules: ${stats.total_healthy_rules}/${stats.total_rules_available} healthy | Uptime: ${stats.uptime.uptime_human}`,
    `Block lag: ${lag.block_lag_seconds}s | Tick lag: ${lag.tick_lag_seconds}s | Caught up: ${lag.is_caught_up ? 'yes' : 'no'}`,
    `Memory: Heap ${stats.memory.heap_used_mb}MB / RSS ${stats.memory.rss_mb}MB`,
    `Block: ${formatNumber(stats.block.total_tasks)} processed, avg ${stats.block.average_processing_time.toFixed(1)}ms, ${stats.block.success_rate.toFixed(1)}% success`,
    `Tick: ${formatNumber(stats.tick.total_tasks)} processed, avg ${stats.tick.average_processing_time.toFixed(1)}ms, ${stats.tick.success_rate.toFixed(1)}% success`,
    `Events emitted: ${formatNumber(stats.total_events_emitted)}`,
  ];

  const blockedRules = stats.details.filter((d) => d.status === 'blocked');
  if (blockedRules.length > 0) {
    lines.push('');
    lines.push(
      `*Blocked rules:* ${blockedRules.map((r) => `\`${r.alert_rule_id}\``).join(', ')}`
    );

    const errors = blockedRules.flatMap((r) => r.last_3_errors).filter(Boolean);
    if (errors.length > 0) {
      const unique = [...new Set(errors)].slice(0, 5);
      lines.push(`Recent errors:\n${unique.map((e) => `> ${e}`).join('\n')}`);
    }
  }

  return lines.join('\n');
}

export function startSlackMonitor() {
  const webhookUrl = env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const intervalMs = env.SLACK_ALERT_INTERVAL_HR * 60 * 60 * 1000;

  logger.info(
    `Slack monitor enabled — summary every ${env.SLACK_ALERT_INTERVAL_HR}h`
  );

  cron.schedule('* * * * *', async () => {
    const now = Date.now();
    if (now - lastSentAt < intervalMs) return;

    try {
      const text = buildSummary();
      await axios.post(webhookUrl, { text }, { timeout: 10_000 });
      lastSentAt = now;
      logger.info('Slack summary sent');
    } catch (err: any) {
      logger.error(`Slack summary failed: ${err.message || err}`);
    }
  });
}
