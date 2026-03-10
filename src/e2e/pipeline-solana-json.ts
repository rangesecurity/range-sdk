/**
 * E2E Solana JSON Pipeline Test
 *
 * Run: yarn test:e2e:solana-json
 *
 * Configure BLOCKS and RULES below, then run. Fetches real blocks via
 * getCachedBlock, processes them through the full pipeline, and logs results.
 */
import { join } from 'path';

import {
  setupPipeline,
  destroyPipeline,
  processPayload,
  getCachedBlock,
  IAlertRule,
} from './../index';

// ── Configure your test ─────────────────────────────────────────

const BLOCKS = [
  { network: 'solana', height: '327418425' },
  { network: 'solana', height: '327418426' },
  { network: 'solana', height: '327418427' },
  { network: 'solana', height: '327418428' },
  { network: 'solana', height: '327418429' },
];

const RULES: IAlertRule[] = [
  {
    id: 'rule-1',
    ruleType: 'e2e-block-1',
    network: 'solana',
    parameters: {},
    createdAt: new Date().toISOString(),
    triggerMode: 'BLOCK',
    severity: 'info',
  },
];

const processorsFile = join(__dirname, 'test-processors.js');

// ── Main ────────────────────────────────────────────────────────

async function main() {
  const ctx = await setupPipeline({ processorsFile, maxThreads: 1 });

  let totalEvents = 0;

  for (const { network, height } of BLOCKS) {
    const block = await getCachedBlock(network, height);

    const results = await processPayload({
      blockData: block,
      ruleList: RULES,
      processorsFile,
    });

    const events = results.flatMap((r) => r.events);
    totalEvents += events.length;

    console.log(`${network}/${height}: ${events.length} events`);
    for (const e of events) {
      console.log(`  [${e.alertRuleId}] ${e.caption}`);
    }
  }

  console.log(
    `\n${BLOCKS.length} blocks × ${RULES.length} rules → ${totalEvents} events`
  );
  await destroyPipeline(ctx);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
