import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

interface SlackDevContext {
  ruleId?: string;
  ruleType?: string;
  network?: string;
  triggerMode?: 'BLOCK' | 'TICK';
  blockHeight?: string | number;
  blockTime?: string;
  tickTime?: string;
}

/**
 * Send a dev alert to Slack with context about the current block/tick and rule.
 *
 * Usage from a BlockProcessor:
 *   slackSendDev({ ruleId: rule.id, ruleType: rule.ruleType, network: rule.network, triggerMode: 'BLOCK', blockHeight: block.height }, payload)
 *
 * Or simply:
 *   slackSendDev({}, 'something weird happened')
 *   slackSendDev({}, { count: 42, txHash: '...' })
 */
export function slackSendDev(context: SlackDevContext, payload: unknown): void {
  const ts = new Date().toISOString();

  const ctxParts: string[] = [];
  if (context.ruleId) ctxParts.push(`Rule: \`${context.ruleId}\``);
  if (context.ruleType) ctxParts.push(`Type: \`${context.ruleType}\``);
  if (context.network) ctxParts.push(`Network: \`${context.network}\``);
  if (context.triggerMode === 'BLOCK') {
    ctxParts.push(`Block: \`${context.blockHeight ?? '?'}\``);
    if (context.blockTime) ctxParts.push(`Block Time: ${context.blockTime}`);
  } else if (context.triggerMode === 'TICK') {
    if (context.tickTime) ctxParts.push(`Tick: ${context.tickTime}`);
  }

  let payloadStr: string;
  if (typeof payload === 'string') {
    payloadStr = payload;
  } else {
    try {
      payloadStr = '```' + JSON.stringify(payload, null, 2) + '```';
    } catch {
      payloadStr = String(payload);
    }
  }

  const text =
    `:eyes: *Dev Alert* — ${ts}\n` +
    (ctxParts.length > 0 ? ctxParts.join(' | ') + '\n' : '') +
    payloadStr;

  // Fire-and-forget — don't block the processor
  if (!SLACK_WEBHOOK_URL) return;
  axios.post(SLACK_WEBHOOK_URL, { text }, { timeout: 5_000 }).catch(() => {});
}
