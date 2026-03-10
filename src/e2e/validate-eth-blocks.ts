/**
 * Strict Zod validation for EVM block JSON files (Range-wrapped format).
 *
 * Usage:
 *   node dist/e2e/validate-eth-blocks.js [block-dir]
 */

import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import { EVMBlockVal } from '../types/IEVMBlock';

// ── Run validation ──

const DEFAULT_DIR = path.join(process.cwd(), 'src', 'test_data', 'eth');
const blockDir = process.argv[2] || DEFAULT_DIR;

const files = readdirSync(blockDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

console.log(`Validating ${files.length} ETH blocks from ${blockDir}\n`);

interface Issue {
  file: string;
  path: string;
  message: string;
  received: unknown;
}

const allIssues: Issue[] = [];
let passCount = 0;
let failCount = 0;

for (const file of files) {
  const filePath = path.join(blockDir, file);
  const raw = readFileSync(filePath, 'utf8');

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    allIssues.push({
      file,
      path: '(root)',
      message: `Invalid JSON: ${e}`,
      received: null,
    });
    failCount++;
    continue;
  }

  const result = EVMBlockVal.strict().safeParse(json);

  if (result.success) {
    passCount++;
  } else {
    failCount++;
    for (const issue of result.error.issues) {
      allIssues.push({
        file,
        path: issue.path.join('.'),
        message: issue.message,
        received: (issue as any).received,
      });
    }
  }
}

// ── Summary ──

console.log(`${'='.repeat(60)}`);
console.log(
  `  RESULTS: ${passCount} passed, ${failCount} failed out of ${files.length}`
);
console.log(`${'='.repeat(60)}\n`);

if (allIssues.length === 0) {
  console.log(`All ${files.length} ETH blocks passed strict validation.`);
  process.exit(0);
}

// Group issues by path+message
const grouped = new Map<
  string,
  { count: number; files: string[]; received: Set<string> }
>();

for (const issue of allIssues) {
  const key = `${issue.path} → ${issue.message}`;
  const entry = grouped.get(key) || {
    count: 0,
    files: [],
    received: new Set(),
  };
  entry.count++;
  if (entry.files.length < 3) entry.files.push(issue.file);
  if (issue.received !== undefined) {
    const recv =
      typeof issue.received === 'object'
        ? JSON.stringify(issue.received)?.substring(0, 80)
        : String(issue.received);
    entry.received.add(recv);
  }
  grouped.set(key, entry);
}

console.log(
  `Found ${allIssues.length} total issues across ${failCount} blocks.\n`
);
console.log(`Unique issue types: ${grouped.size}\n`);

const sorted = [...grouped.entries()].sort((a, b) => b[1].count - a[1].count);

for (const [key, val] of sorted) {
  console.log(`--- ${key}`);
  console.log(`    Count:    ${val.count}`);
  console.log(`    Examples: ${val.files.join(', ')}`);
  if (val.received.size > 0) {
    const samples = [...val.received].slice(0, 3);
    console.log(`    Received: ${samples.join(' | ')}`);
  }
  console.log();
}

process.exit(1);
