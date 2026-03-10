/**
 * Multi-chain FlatBuffer benchmark report.
 *
 * Benchmarks encode/decode for Solana, ETH, and Cosmos blocks,
 * then writes a combined report to block_decoding_benchmark_results.txt.
 *
 * Usage:
 *   node dist/e2e/generate-report.js [-c cycles]
 *
 * Examples:
 *   node dist/e2e/generate-report.js          # 1 cycle per block
 *   node dist/e2e/generate-report.js -c 10    # 10 cycles per block
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import * as path from 'path';
import {
  createSolanaBlockFromJson,
  SolanaBlockWrapper,
} from '../wrappers/solana-block-wrapper';

// ── Args ──

function parseArgs() {
  const args = process.argv.slice(2);
  let cycles = 1;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-c' && args[i + 1]) {
      cycles = parseInt(args[++i], 10);
    }
  }
  return { cycles };
}

const { cycles: REPEAT } = parseArgs();
const BASE = path.join(process.cwd(), 'src', 'test_data');
const OUTPUT_FILE = path.join(
  process.cwd(),
  'block_decoding_benchmark_results.txt'
);

// ── Chain configs ──

interface ChainConfig {
  name: string;
  dir: string;
  encode: (data: any) => Uint8Array;
  fullDecode: (buf: Uint8Array) => void;
  prepare: (raw: any) => any;
  getTxCount: (data: any) => number;
}

const CHAINS: ChainConfig[] = [
  {
    name: 'Solana',
    dir: path.join(BASE, 'solana'),
    encode: createSolanaBlockFromJson,
    fullDecode: (buf) => {
      const w = new SolanaBlockWrapper(buf);
      void w.height;
      void w.network;
      void w.timestamp;
      void w.block_data;
      const txs = w.transactions;
      if (txs.length > 0) {
        void txs[0].transaction.signatures;
        void txs[txs.length - 1].meta.fee;
      }
    },
    prepare: (raw) => ({
      ...raw,
      height: raw.blockHeight,
      timestamp: raw.blockTime,
      network: 'solana',
      blockData: {
        slot: String(raw.blockHeight),
        parentSlot: String(raw.parentSlot),
        previousBlockhash: raw.previousBlockhash || '',
      },
    }),
    getTxCount: (data) => data.transactions?.length ?? 0,
  },
];

// ── Helpers ──

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
  };
}

function fmtStats(s: ReturnType<typeof computeStats>): string {
  return `Avg: ${s.avg.toFixed(2)} ms | P50: ${s.p50.toFixed(2)} ms | P95: ${s.p95.toFixed(2)} ms`;
}

// ── Benchmark one chain ──

interface ChainResult {
  name: string;
  blockCount: number;
  totalTxCount: number;
  totalJsonBytes: number;
  totalFbBytes: number;
  parseStats: ReturnType<typeof computeStats>;
  encodeStats: ReturnType<typeof computeStats>;
  decodeStats: ReturnType<typeof computeStats>;
  jsonStats: ReturnType<typeof computeStats>;
  binStats: ReturnType<typeof computeStats>;
  top5: {
    name: string;
    txCount: number;
    jsonBytes: number;
    avgTotal: number;
  }[];
}

function benchmarkChain(
  chain: ChainConfig,
  repeat: number,
  out: (s?: string) => void
): ChainResult | null {
  if (!existsSync(chain.dir)) {
    out(`  Skipping ${chain.name} — directory not found: ${chain.dir}`);
    out();
    return null;
  }

  const files = readdirSync(chain.dir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    out(`  Skipping ${chain.name} — no .json files`);
    out();
    return null;
  }

  const allParse: number[] = [];
  const allEncode: number[] = [];
  const allDecode: number[] = [];
  const allDecodeBin: number[] = [];
  let totalJsonBytes = 0;
  let totalFbBytes = 0;
  let totalTxCount = 0;

  const perBlock: {
    name: string;
    txCount: number;
    jsonBytes: number;
    fbBytes: number;
    avgTotal: number;
  }[] = [];

  for (const file of files) {
    const jsonStr = readFileSync(path.join(chain.dir, file), 'utf8');
    const jsonBytes = Buffer.byteLength(jsonStr, 'utf8');
    let firstTxCount = 0;
    let firstFbBytes = 0;
    const blockTotals: number[] = [];

    for (let r = 0; r < repeat; r++) {
      const parseStart = performance.now();
      const raw = JSON.parse(jsonStr);
      const parseMs = performance.now() - parseStart;

      const prepared = chain.prepare(raw);

      const encodeStart = performance.now();
      const encoded = chain.encode(prepared);
      const encodeMs = performance.now() - encodeStart;

      const decodeStart = performance.now();
      chain.fullDecode(encoded);
      const decodeMs = performance.now() - decodeStart;

      const decodeBinStart = performance.now();
      chain.fullDecode(encoded);
      const decodeBinMs = performance.now() - decodeBinStart;

      allParse.push(parseMs);
      allEncode.push(encodeMs);
      allDecode.push(decodeMs);
      allDecodeBin.push(decodeBinMs);
      blockTotals.push(parseMs + encodeMs + decodeMs);

      if (r === 0) {
        firstTxCount = chain.getTxCount(raw);
        firstFbBytes = encoded.length;
      }
    }

    perBlock.push({
      name: file.replace('.json', ''),
      txCount: firstTxCount,
      jsonBytes,
      fbBytes: firstFbBytes,
      avgTotal: blockTotals.reduce((a, b) => a + b, 0) / blockTotals.length,
    });
    totalJsonBytes += jsonBytes;
    totalFbBytes += firstFbBytes;
    totalTxCount += firstTxCount;
  }

  const parseStats = computeStats(allParse);
  const encodeStats = computeStats(allEncode);
  const decodeStats = computeStats(allDecode);
  const jsonTimes = allParse.map((p, i) => p + allEncode[i] + allDecode[i]);
  const jsonStats = computeStats(jsonTimes);
  const binStats = computeStats(allDecodeBin);

  const top5 = [...perBlock]
    .sort((a, b) => b.avgTotal - a.avgTotal)
    .slice(0, 5);

  // Print chain section
  const speedup = (jsonStats.avg / binStats.avg).toFixed(1);
  const pct = ((1 - binStats.avg / jsonStats.avg) * 100).toFixed(0);
  const parsePct = ((parseStats.avg / jsonStats.avg) * 100).toFixed(0);
  const encodePct = ((encodeStats.avg / jsonStats.avg) * 100).toFixed(0);
  const decodePct = ((decodeStats.avg / jsonStats.avg) * 100).toFixed(0);

  out(
    `  Blocks: ${files.length} | Txs: ${totalTxCount.toLocaleString()} | Avg tx/block: ${(totalTxCount / files.length).toFixed(0)}`
  );
  out(
    `  JSON: ${formatBytes(totalJsonBytes)} | FB: ${formatBytes(totalFbBytes)} | Compression: ${((1 - totalFbBytes / totalJsonBytes) * 100).toFixed(1)}%`
  );
  out();
  out(`  --- JSON.parse ---`);
  out(`    ${fmtStats(parseStats)}`);
  out(`  --- Encode (obj -> FlatBuffer) ---`);
  out(`    ${fmtStats(encodeStats)}`);
  out(`  --- Decode (FlatBuffer -> Wrapper) ---`);
  out(`    ${fmtStats(decodeStats)}`);
  out();
  out(
    `  JSON pipeline:   ${jsonStats.avg.toFixed(2)} ms/block (~${(1000 / jsonStats.avg).toFixed(0)} blocks/sec)`
  );
  out(
    `  Binary pipeline: ${binStats.avg.toFixed(2)} ms/block (~${(1000 / binStats.avg).toFixed(0)} blocks/sec)`
  );
  out(`  Speedup:         ${speedup}x (${pct}% faster)`);
  out();
  out(
    `  Breakdown: Parse ${parseStats.avg.toFixed(1)}ms (${parsePct}%) | Encode ${encodeStats.avg.toFixed(1)}ms (${encodePct}%) | Decode ${decodeStats.avg.toFixed(1)}ms (${decodePct}%)`
  );
  out();

  out(`  Top 5 heaviest:`);
  out(
    `  ${'Block'.padEnd(18)}${'TXs'.padStart(6)}${'JSON'.padStart(10)}${'Total'.padStart(10)}`
  );
  for (const b of top5) {
    out(
      `  ${b.name.padEnd(18)}${String(b.txCount).padStart(6)}${formatBytes(b.jsonBytes).padStart(10)}${(b.avgTotal.toFixed(1) + 'ms').padStart(10)}`
    );
  }
  out();

  return {
    name: chain.name,
    blockCount: files.length,
    totalTxCount,
    totalJsonBytes,
    totalFbBytes,
    parseStats,
    encodeStats,
    decodeStats,
    jsonStats,
    binStats,
    top5,
  };
}

// ── Main ──

async function main() {
  const lines: string[] = [];
  const out = (s = '') => {
    lines.push(s);
    console.log(s);
  };

  const sep = '='.repeat(64);

  out(`FlatBuffer Benchmark Report`);
  out(`Date:       ${new Date().toISOString().split('T')[0]}`);
  out(`Cycles:     ${REPEAT} per block`);
  out(`Node:       ${process.version}`);
  out(`Platform:   ${process.platform} ${process.arch}`);
  out();

  const results: ChainResult[] = [];

  for (const chain of CHAINS) {
    out(sep);
    out(`  ${chain.name.toUpperCase()}`);
    out(sep);
    out();

    const result = benchmarkChain(chain, REPEAT, out);
    if (result) results.push(result);
  }

  // ── Combined Summary ──
  if (results.length > 1) {
    out(sep);
    out(`  COMBINED SUMMARY`);
    out(sep);
    out();

    const header = `${'Chain'.padEnd(10)}${'Blocks'.padStart(8)}${'Txs'.padStart(8)}${'JSON'.padStart(10)}${'FB'.padStart(10)}${'JSON ms'.padStart(10)}${'Bin ms'.padStart(10)}${'Speedup'.padStart(10)}`;
    out(header);

    for (const r of results) {
      out(
        `${r.name.padEnd(10)}${String(r.blockCount).padStart(8)}${r.totalTxCount.toLocaleString().padStart(8)}${formatBytes(r.totalJsonBytes).padStart(10)}${formatBytes(r.totalFbBytes).padStart(10)}${(r.jsonStats.avg.toFixed(1) + 'ms').padStart(10)}${(r.binStats.avg.toFixed(1) + 'ms').padStart(10)}${((r.jsonStats.avg / r.binStats.avg).toFixed(1) + 'x').padStart(10)}`
      );
    }

    out();

    // Totals
    const totalBlocks = results.reduce((s, r) => s + r.blockCount, 0);
    const totalTxs = results.reduce((s, r) => s + r.totalTxCount, 0);
    const totalJson = results.reduce((s, r) => s + r.totalJsonBytes, 0);
    const totalFb = results.reduce((s, r) => s + r.totalFbBytes, 0);

    out(`  Total: ${totalBlocks} blocks, ${totalTxs.toLocaleString()} txs`);
    out(
      `  Total JSON: ${formatBytes(totalJson)} | Total FB: ${formatBytes(totalFb)}`
    );
    out();
  }

  out(`  Peak RSS: ${formatBytes(process.memoryUsage().rss)}`);
  out();

  writeFileSync(OUTPUT_FILE, lines.join('\n') + '\n');
  console.log(`Report written to ${OUTPUT_FILE}`);
}

main().catch(console.error);
