/**
 * Benchmark: Solana block FlatBuffer encode/decode pipeline
 *
 * Compares JSON pipeline (parse + encode + decode) vs Binary pipeline (decode only).
 * Processes all .json blocks in the given directory, repeating each block N times.
 *
 * Usage:
 *   yarn build
 *   npx ts-node src/e2e/bench-decode.ts [block-dir] [iterations-per-block]
 *
 * Examples:
 *   npx ts-node src/e2e/bench-decode.ts                           # default: src/test_data/solana/, 100 iterations
 *   npx ts-node src/e2e/bench-decode.ts /path/to/blocks/          # custom dir, 100 iterations
 *   npx ts-node src/e2e/bench-decode.ts /path/to/blocks/ 50       # custom dir, 50 iterations
 *   node dist/e2e/bench-decode.js /path/to/blocks/                # run from built dist
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import * as path from 'path';
import {
  createSolanaBlockFromJson,
  SolanaBlockWrapper,
} from '../wrappers/solana-block-wrapper';

const DEFAULT_DIR = path.join(__dirname, '..', 'test_data', 'solana');
const blockDir = process.argv[2] || DEFAULT_DIR;
const REPEAT = parseInt(process.argv[3] || '100', 10);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function computeStats(times: number[]) {
  const sorted = [...times].sort((a, b) => a - b);
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  return {
    avg,
    p50: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99),
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

function printStats(s: ReturnType<typeof computeStats>) {
  console.log(`  Avg:  ${s.avg.toFixed(2)} ms`);
  console.log(`  P50:  ${s.p50.toFixed(2)} ms`);
  console.log(`  P95:  ${s.p95.toFixed(2)} ms`);
  console.log(`  P99:  ${s.p99.toFixed(2)} ms`);
  console.log(`  Min:  ${s.min.toFixed(2)} ms`);
  console.log(`  Max:  ${s.max.toFixed(2)} ms`);
}

function fullDecode(encoded: Uint8Array) {
  const wrapper = new SolanaBlockWrapper(encoded);
  void wrapper.height;
  void wrapper.network;
  void wrapper.timestamp;
  void wrapper.block_data;
  const txs = wrapper.transactions;
  if (txs.length > 0) {
    void txs[0].transaction.signatures;
    void txs[txs.length - 1].meta.fee;
  }
}

async function main() {
  if (!existsSync(blockDir)) {
    console.error(`Directory not found: ${blockDir}`);
    console.error(
      `Usage: npx ts-node src/e2e/bench-decode.ts [block-dir] [iterations]`
    );
    process.exit(1);
  }

  const files = readdirSync(blockDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    console.error(`No .json files found in: ${blockDir}`);
    process.exit(1);
  }

  console.log(`Solana FlatBuffer Benchmark`);
  console.log(`Directory:  ${blockDir}`);
  console.log(`Blocks:     ${files.length}`);
  console.log(
    `Iterations: ${REPEAT} per block (${files.length * REPEAT} total samples)`
  );
  console.log(`Date:       ${new Date().toISOString().split('T')[0]}`);
  console.log(`Node:       ${process.version}`);
  console.log(`Platform:   ${process.platform} ${process.arch}`);

  // Collect per-block metadata (first iteration only)
  const perBlock: {
    name: string;
    txCount: number;
    jsonBytes: number;
    fbBytes: number;
  }[] = [];

  // All timing samples
  const allParse: number[] = [];
  const allEncode: number[] = [];
  const allDecode: number[] = [];
  const allDecodeBin: number[] = [];
  let totalJsonBytes = 0;
  let totalFbBytes = 0;
  let totalTxCount = 0;

  for (const file of files) {
    const filePath = path.join(blockDir, file);
    const jsonStr = readFileSync(filePath, 'utf8');
    const jsonBytes = Buffer.byteLength(jsonStr, 'utf8');
    let firstTxCount = 0;
    let firstFbBytes = 0;

    for (let r = 0; r < REPEAT; r++) {
      const parseStart = performance.now();
      const blockData = JSON.parse(jsonStr);
      const parseMs = performance.now() - parseStart;

      const encodeStart = performance.now();
      const encoded = createSolanaBlockFromJson(blockData);
      const encodeMs = performance.now() - encodeStart;

      const decodeStart = performance.now();
      fullDecode(encoded);
      const decodeMs = performance.now() - decodeStart;

      const decodeBinStart = performance.now();
      fullDecode(encoded);
      const decodeBinMs = performance.now() - decodeBinStart;

      allParse.push(parseMs);
      allEncode.push(encodeMs);
      allDecode.push(decodeMs);
      allDecodeBin.push(decodeBinMs);

      if (r === 0) {
        firstTxCount = blockData.transactions?.length ?? 0;
        firstFbBytes = encoded.length;
      }
    }

    perBlock.push({
      name: file.replace('.json', ''),
      txCount: firstTxCount,
      jsonBytes,
      fbBytes: firstFbBytes,
    });
    totalJsonBytes += jsonBytes;
    totalFbBytes += firstFbBytes;
    totalTxCount += firstTxCount;
  }

  // --- Results ---
  const n = allParse.length;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  RESULTS (${n} samples across ${files.length} blocks)`);
  console.log(`${'='.repeat(60)}`);

  console.log(`\nTotal transactions: ${totalTxCount.toLocaleString()}`);
  console.log(`Avg tx/block: ${(totalTxCount / files.length).toFixed(0)}`);
  console.log(`Total JSON size: ${formatBytes(totalJsonBytes)}`);
  console.log(`Total FB size:   ${formatBytes(totalFbBytes)}`);
  console.log(`Avg JSON size:   ${formatBytes(totalJsonBytes / files.length)}`);
  console.log(`Avg FB size:     ${formatBytes(totalFbBytes / files.length)}`);
  console.log(
    `Avg compression: ${((1 - totalFbBytes / totalJsonBytes) * 100).toFixed(1)}%`
  );

  const parseStats = computeStats(allParse);
  console.log(`\n--- JSON.parse ---`);
  printStats(parseStats);

  const encodeStats = computeStats(allEncode);
  console.log(`\n--- Encode (obj -> FlatBuffer) ---`);
  printStats(encodeStats);

  const decodeStats = computeStats(allDecode);
  console.log(`\n--- Decode (FlatBuffer -> Wrapper) ---`);
  printStats(decodeStats);

  const jsonTimes = allParse.map((p, i) => p + allEncode[i] + allDecode[i]);
  const jsonStats = computeStats(jsonTimes);
  console.log(`\n--- JSON Pipeline (parse + encode + decode) ---`);
  printStats(jsonStats);
  console.log(`  Throughput: ~${(1000 / jsonStats.avg).toFixed(0)} blocks/sec`);

  const binStats = computeStats(allDecodeBin);
  console.log(`\n--- Binary Pipeline (decode only) ---`);
  printStats(binStats);
  console.log(`  Throughput: ~${(1000 / binStats.avg).toFixed(0)} blocks/sec`);

  // --- Comparison ---
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  COMPARISON`);
  console.log(`${'='.repeat(60)}`);
  const speedup = (jsonStats.avg / binStats.avg).toFixed(1);
  const saved = (jsonStats.avg - binStats.avg).toFixed(2);
  const pct = ((1 - binStats.avg / jsonStats.avg) * 100).toFixed(0);
  console.log(`\n  JSON pipeline:   ${jsonStats.avg.toFixed(2)} ms/block`);
  console.log(`  Binary pipeline: ${binStats.avg.toFixed(2)} ms/block`);
  console.log(`  Speedup:         ${speedup}x`);
  console.log(`  Time saved:      ${saved} ms/block (${pct}%)`);

  const parsePct = ((parseStats.avg / jsonStats.avg) * 100).toFixed(0);
  const encodePct = ((encodeStats.avg / jsonStats.avg) * 100).toFixed(0);
  const decodePct = ((decodeStats.avg / jsonStats.avg) * 100).toFixed(0);
  console.log(`\n  Breakdown (JSON mode):`);
  console.log(
    `    JSON.parse:  ${parseStats.avg.toFixed(2)} ms (${parsePct}%)`
  );
  console.log(
    `    Encode:      ${encodeStats.avg.toFixed(2)} ms (${encodePct}%)`
  );
  console.log(
    `    Decode:      ${decodeStats.avg.toFixed(2)} ms (${decodePct}%)`
  );

  console.log(`\n  Peak RSS: ${formatBytes(process.memoryUsage().rss)}`);
}

main().catch(console.error);
