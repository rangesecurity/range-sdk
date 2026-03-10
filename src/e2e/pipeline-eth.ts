/**
 * E2E ETH Pipeline Test (plain Node.js — no test framework)
 *
 * Run: yarn test:e2e:eth
 *
 * Validates that real EVM blocks from test_data/eth/ survive the full pipeline:
 *   JSON block → processPayload → JSON.stringify → SharedArrayBuffer → worker → TextDecoder → JSON.parse → processor callback
 *
 * The processor verifies the block object is fully intact (nested fields, arrays, hex values).
 */
import 'reflect-metadata';
import assert from 'node:assert/strict';
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import { initPool, closePool } from '../threadpool/pool';
import { processPayload } from '../processors/taskProcessor';
import { IAlertRule } from '../types/IAlertRule';
import { IEvent } from '../types/IEvent';

const processorsFile = join(__dirname, 'test-processors-eth.js');

const CHAIN_ID_TO_NETWORK: Record<string, string> = {
  '1': 'eth',
  '10': 'op',
  '137': 'pol',
  '42161': 'arb1',
  '56': 'bsc',
  '8453': 'base',
};

// ── Helpers ─────────────────────────────────────────────────────

/**
 * Normalize an EVM block to have top-level height, network, timestamp.
 * Mirrors what runner.ts normalizeBlock() does in production.
 */
function normalizeEvmBlock(raw: any, chainId: string = '1'): any {
  const block = { ...raw, chain_id: chainId };

  if (block.result?.number) {
    block.height = parseInt(block.result.number, 16);
    block.timestamp = block.result.timestamp
      ? new Date(parseInt(block.result.timestamp, 16) * 1000).toISOString()
      : undefined;
  }

  if (block.network === undefined && block.chain_id !== undefined) {
    block.network =
      CHAIN_ID_TO_NETWORK[String(block.chain_id)] || String(block.chain_id);
  }

  return block;
}

function makeEthBlockRule(): IAlertRule {
  return {
    id: 'eth-block-rule-1',
    ruleType: 'e2e-eth-block',
    network: 'eth',
    parameters: {},
    createdAt: new Date().toISOString(),
    triggerMode: 'BLOCK' as const,
    severity: 'info',
  };
}

let passed = 0;
let failed = 0;

function check(label: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${label}`);
  } catch (err: any) {
    failed++;
    console.error(`  ✗ ${label}`);
    console.error(`    ${err.message}`);
  }
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  try {
    // ── 1. Set minimal env vars ──
    process.env.RANGE_SDK_TOKEN = 'e2e-test-runner.fake-token';

    // ── 2. Load ETH test processors ──
    console.log('⏳ Loading ETH test processors...');
    await import('./test-processors-eth');
    console.log('✓ ETH processor registered');

    // ── 3. Init Piscina thread pool ──
    console.log('⏳ Starting thread pool...');
    const workerFile = join(__dirname, '..', 'threadpool', 'worker.js');
    await initPool({
      filename: workerFile,
      maxThreads: 2,
    });
    console.log('✓ Thread pool ready (2 threads)');

    // ── 4. Load real EVM blocks from test_data ──
    const testDataDir = join(process.cwd(), 'src', 'test_data', 'eth');
    const blockFiles = readdirSync(testDataDir)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .slice(0, 5); // test with 5 blocks

    console.log(
      `\n── Processing ${blockFiles.length} real ETH blocks (JSON pipeline) ──`
    );

    const rule = makeEthBlockRule();
    const allEvents: IEvent[] = [];

    for (const file of blockFiles) {
      const raw = JSON.parse(readFileSync(join(testDataDir, file), 'utf8'));
      const block = normalizeEvmBlock(raw);
      const txCount = block.result?.transactions?.length ?? 0;

      const results = await processPayload({
        blockData: block,
        ruleList: [rule],
        processorsFile,
      });

      const events = results.flatMap((r) => r.events);
      allEvents.push(...events);
      console.log(
        `  Block ${file.replace('.json', '')}: ${txCount} txs → ${events.length} event`
      );
    }

    // ── 5. Assertions ──
    console.log('\n── Assertions ──');

    check(`Processed ${blockFiles.length} blocks`, () => {
      assert.equal(allEvents.length, blockFiles.length);
    });

    check('All events report valid block structure', () => {
      for (const event of allEvents) {
        assert.equal(
          event.details.valid,
          true,
          `Block validation failed: ${event.details.message}`
        );
      }
    });

    check('All events have transaction counts', () => {
      for (const event of allEvents) {
        assert.ok(
          event.details.txCount !== undefined,
          'missing txCount in event details'
        );
      }
    });

    check('All events have required fields', () => {
      for (const event of allEvents) {
        assert.ok(event.id, 'missing id');
        assert.ok(event.alertRuleId, 'missing alertRuleId');
        assert.ok(event.caption, 'missing caption');
        assert.ok(event.time, 'missing time');
      }
    });

    check('All event IDs are unique', () => {
      const ids = new Set(allEvents.map((e) => e.id));
      assert.equal(ids.size, allEvents.length);
    });

    // ── Summary ──
    console.log(`\n${'─'.repeat(40)}`);
    if (failed === 0) {
      console.log(`✅ All ${passed} checks passed`);
    } else {
      console.log(`❌ ${failed} failed, ${passed} passed`);
    }
  } finally {
    console.log('\n⏳ Cleaning up...');
    await closePool();
    console.log('✓ Done\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('E2E ETH test crashed:', err);
  process.exit(1);
});
