/**
 * E2E Solana Pipeline Test (plain Node.js — no test framework)
 *
 * Run: yarn test:e2e:solana
 *
 * Full pipeline:
 *   Solana blocks → Piscina thread pool → processors (FlatBuffer path) → events
 *
 * Tests both JSON and binary (FlatBuffer) block processing paths,
 * plus Redis stream round-trips for JSON and binary payloads.
 */
import 'reflect-metadata';
import assert from 'node:assert/strict';
import { join } from 'path';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import {
  createRedisClient,
  publishToStream,
  publishBinaryToStream,
} from '../services/consumer-redis';
import {
  convertSolanaBlockJsonToBuffer,
  SolanaBlockWrapper,
} from '../wrappers/solana-block-wrapper';
import { initPool, closePool } from '../threadpool/pool';
import { processPayload } from '../processors/taskProcessor';
import { IAlertRule } from '../types/IAlertRule';
import { IEvent } from '../types/IEvent';

// ── Constants ───────────────────────────────────────────────────

const BLOCK_COUNT = 5;
const TICK_COUNT = 5;
const BLOCK_RULE_COUNT = 5;
const TICK_RULE_COUNT = 5;
const EXPECTED_EVENTS =
  BLOCK_COUNT * BLOCK_RULE_COUNT + TICK_COUNT * TICK_RULE_COUNT; // 50

const processorsFile = join(__dirname, 'test-processors.js');

// ── Helpers ─────────────────────────────────────────────────────

function makeBlockRules(): IAlertRule[] {
  return Array.from({ length: BLOCK_RULE_COUNT }, (_, i) => ({
    id: `block-rule-${i + 1}`,
    ruleType: `e2e-block-${i + 1}`,
    network: 'solana',
    parameters: {},
    createdAt: new Date().toISOString(),
    triggerMode: 'BLOCK' as const,
    severity: 'info',
  }));
}

function makeTickRules(): IAlertRule[] {
  return Array.from({ length: TICK_RULE_COUNT }, (_, i) => ({
    id: `tick-rule-${i + 1}`,
    ruleType: `e2e-tick-${i + 1}`,
    network: 'solana',
    parameters: {},
    createdAt: new Date().toISOString(),
    triggerMode: 'TICK' as const,
    severity: 'info',
  }));
}

function makeSolanaBlock(height: number) {
  return {
    height,
    network: 'solana',
    timestamp: Math.floor(Date.now() / 1000),
    blockData: {
      slot: String(height),
      parentSlot: String(height - 1),
      previousBlockhash: 'abc123',
    },
    transactions: [],
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
  let container: StartedTestContainer | null = null;

  try {
    // ── 1. Start Redis ──
    console.log('\n⏳ Starting Redis container...');
    container = await new GenericContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(6379);
    const redisUrl = `${host}:${port}`;
    console.log(`✓ Redis running on ${redisUrl}`);

    // Set env vars the SDK reads
    process.env.BLOCK_REDIS_URL = redisUrl;
    process.env.TICK_REDIS_URL = redisUrl;
    process.env.NOTIFICATIONS_REDIS_URL = redisUrl;
    process.env.RUNNER_CACHE_REDIS_URL = redisUrl;
    process.env.RANGE_SDK_TOKEN = 'e2e-test-runner.fake-token';

    // ── 2. Load test processors (triggers @Rule decorators) ──
    console.log('⏳ Loading test processors...');
    await import('./test-processors');
    console.log('✓ 10 processors registered (5 block + 5 tick)');

    // ── 3. Init Piscina thread pool ──
    console.log('⏳ Starting thread pool...');
    const workerFile = join(__dirname, '..', 'threadpool', 'worker.js');
    await initPool({
      filename: workerFile,
      maxThreads: 2,
    });
    console.log('✓ Thread pool ready (2 threads)');

    // ── 4. Process Solana blocks (JSON path → FlatBuffer encoding) ──
    console.log('\n── Processing Solana blocks (JSON → FlatBuffer path) ──');
    const blockRules = makeBlockRules();
    const tickRules = makeTickRules();
    const allEvents: IEvent[] = [];

    for (let i = 1; i <= BLOCK_COUNT; i++) {
      const block = makeSolanaBlock(i);
      const results = await processPayload({
        blockData: block,
        ruleList: blockRules,
        processorsFile,
      });
      const events = results.flatMap((r) => r.events);
      allEvents.push(...events);
      console.log(`  Block ${i}: ${events.length} events`);
    }

    // ── 5. Process ticks ──
    console.log('\n── Processing ticks ──');
    for (let i = 1; i <= TICK_COUNT; i++) {
      const timestamp = new Date(Date.now() + i * 1000).toISOString();
      const results = await processPayload({
        time: timestamp,
        ruleList: tickRules,
        processorsFile,
      });
      const events = results.flatMap((r) => r.events);
      allEvents.push(...events);
      console.log(`  Tick ${i}: ${events.length} events`);
    }

    // ── 6. Assertions ──
    console.log('\n── Assertions ──');

    const blockEvents = allEvents.filter((e) =>
      e.caption.startsWith('e2e-block-')
    );
    const tickEvents = allEvents.filter((e) =>
      e.caption.startsWith('e2e-tick-')
    );

    check(`Total events = ${EXPECTED_EVENTS}`, () => {
      assert.equal(allEvents.length, EXPECTED_EVENTS);
    });

    check(`Block events = ${BLOCK_COUNT * BLOCK_RULE_COUNT}`, () => {
      assert.equal(blockEvents.length, BLOCK_COUNT * BLOCK_RULE_COUNT);
    });

    check(`Tick events = ${TICK_COUNT * TICK_RULE_COUNT}`, () => {
      assert.equal(tickEvents.length, TICK_COUNT * TICK_RULE_COUNT);
    });

    // Each block rule produced events for each block
    for (let ruleIdx = 1; ruleIdx <= BLOCK_RULE_COUNT; ruleIdx++) {
      const ruleEvents = blockEvents.filter(
        (e) => e.alertRuleId === `block-rule-${ruleIdx}`
      );
      check(`block-rule-${ruleIdx} fired ${BLOCK_COUNT} times`, () => {
        assert.equal(ruleEvents.length, BLOCK_COUNT);
      });
    }

    // Each tick rule produced events for each tick
    for (let ruleIdx = 1; ruleIdx <= TICK_RULE_COUNT; ruleIdx++) {
      const ruleEvents = tickEvents.filter(
        (e) => e.alertRuleId === `tick-rule-${ruleIdx}`
      );
      check(`tick-rule-${ruleIdx} fired ${TICK_COUNT} times`, () => {
        assert.equal(ruleEvents.length, TICK_COUNT);
      });
    }

    // Block numbers are correct
    for (let height = 1; height <= BLOCK_COUNT; height++) {
      const heightEvents = blockEvents.filter(
        (e) => e.blockNumber === String(height)
      );
      check(`block height ${height} has ${BLOCK_RULE_COUNT} events`, () => {
        assert.equal(heightEvents.length, BLOCK_RULE_COUNT);
      });
    }

    // Event shape
    check('All events have required fields', () => {
      for (const event of allEvents) {
        assert.ok(event.id, 'missing id');
        assert.ok(event.alertRuleId, 'missing alertRuleId');
        assert.ok(event.caption, 'missing caption');
        assert.ok(event.details, 'missing details');
        assert.ok(event.details.message, 'missing details.message');
        assert.ok(event.time, 'missing time');
        assert.ok(event.severity, 'missing severity');
      }
    });

    // All IDs are unique
    check('All event IDs are unique', () => {
      const ids = new Set(allEvents.map((e) => e.id));
      assert.equal(ids.size, allEvents.length);
    });

    // ── 7. Redis stream JSON round-trip ──
    console.log('\n── Redis stream JSON round-trip ──');
    const client = await createRedisClient(redisUrl);
    const streamName = `e2e-test-${Date.now()}`;

    await publishToStream({
      client: client as any,
      streamName,
      payload: makeSolanaBlock(999),
    });

    const messages = await (client as any).xRange(streamName, '-', '+');
    check('Published and read back 1 message from Redis stream', () => {
      assert.equal(messages.length, 1);
    });

    const payload = JSON.parse(messages[0].message.message);
    check('Payload round-trips correctly', () => {
      assert.equal(payload.height, 999);
      assert.equal(payload.network, 'solana');
    });

    // ── 8. Binary Redis stream round-trip (FlatBuffer) ──
    console.log('\n── Binary Redis stream round-trip (FlatBuffer) ──');
    const binaryClient = await createRedisClient(redisUrl);
    const binaryStreamName = `e2e-binary-test-${Date.now()}`;

    const solanaBlock = makeSolanaBlock(12345);
    const binary = convertSolanaBlockJsonToBuffer(solanaBlock);

    await publishBinaryToStream({
      client: binaryClient as any,
      streamName: binaryStreamName,
      payload: binary,
    });

    const binaryMessages = await (binaryClient as any).xRange(
      binaryStreamName,
      '-',
      '+'
    );
    check('Published and read back 1 binary message from Redis stream', () => {
      assert.equal(binaryMessages.length, 1);
    });

    check('Binary message has buffer field', () => {
      assert.ok(binaryMessages[0].message.buffer);
    });

    const decoded = Buffer.from(binaryMessages[0].message.buffer, 'base64');
    const wrapper = new SolanaBlockWrapper(
      new Uint8Array(decoded.buffer, decoded.byteOffset, decoded.byteLength)
    );
    check('Binary payload round-trips correctly', () => {
      assert.equal(wrapper.height, 12345);
      assert.equal(wrapper.network, 'solana');
    });

    await (binaryClient as any).disconnect();
    await (client as any).disconnect();

    // ── Summary ──
    console.log(`\n${'─'.repeat(40)}`);
    if (failed === 0) {
      console.log(`✅ All ${passed} checks passed`);
    } else {
      console.log(`❌ ${failed} failed, ${passed} passed`);
    }
  } finally {
    // ── Cleanup ──
    console.log('\n⏳ Cleaning up...');
    await closePool();
    if (container) await container.stop();
    console.log('✓ Done\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('E2E test crashed:', err);
  process.exit(1);
});
