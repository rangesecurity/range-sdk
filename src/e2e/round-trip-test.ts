/**
 * Round-trip integrity test: JSON -> FlatBuffer encode -> decode -> field comparison
 *
 * For each Solana test block:
 *   1. Read raw RPC JSON, augment with height/timestamp/network
 *   2. Encode to FlatBuffer via createSolanaBlockFromJson
 *   3. Decode via SolanaBlockWrapper
 *   4. Compare decoded fields against original — report any mismatches
 *
 * Usage:
 *   npx ts-node src/e2e/round-trip-test.ts [block-dir]
 */

import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import {
  createSolanaBlockFromJson,
  SolanaBlockWrapper,
} from '../wrappers/solana-block-wrapper';

const DEFAULT_DIR = path.join(__dirname, '..', 'test_data', 'solana');
const blockDir = process.argv[2] || DEFAULT_DIR;

interface Mismatch {
  field: string;
  expected: unknown;
  got: unknown;
}

function compareFields(original: any, wrapper: SolanaBlockWrapper): Mismatch[] {
  const mismatches: Mismatch[] = [];

  function check(field: string, expected: unknown, got: unknown) {
    if (expected !== got) {
      mismatches.push({ field, expected, got });
    }
  }

  // Top-level fields
  check('height', original.height, wrapper.height);
  check('network', original.network, wrapper.network);
  check('timestamp', original.timestamp, wrapper.timestamp);

  // Block data
  const bd = wrapper.block_data;
  if (original.blockData) {
    check(
      'blockData.parentSlot',
      original.blockData.parentSlot,
      bd?.parentSlot
    );
    check(
      'blockData.previousBlockhash',
      original.blockData.previousBlockhash,
      bd?.previousBlockhash
    );
  }

  // Transaction count
  const origTxs = original.transactions || [];
  const decodedTxs = wrapper.transactions;
  check('transactions.length', origTxs.length, decodedTxs.length);

  // Per-transaction field checks
  const txCount = Math.min(origTxs.length, decodedTxs.length);
  for (let i = 0; i < txCount; i++) {
    const oTx = origTxs[i];
    const dTx = decodedTxs[i];
    const prefix = `tx[${i}]`;

    // Signatures
    const oSigs = oTx.transaction?.signatures || [];
    const dSigs = dTx.transaction?.signatures || [];
    check(`${prefix}.signatures.length`, oSigs.length, dSigs.length);
    for (let s = 0; s < Math.min(oSigs.length, dSigs.length); s++) {
      check(`${prefix}.signatures[${s}]`, oSigs[s], dSigs[s]);
    }

    // Account keys
    const oKeys = oTx.transaction?.message?.accountKeys || [];
    const dKeys = dTx.transaction?.message?.accountKeys || [];
    check(`${prefix}.accountKeys.length`, oKeys.length, dKeys.length);
    for (let k = 0; k < Math.min(oKeys.length, dKeys.length); k++) {
      check(
        `${prefix}.accountKeys[${k}].pubkey`,
        oKeys[k].pubkey,
        dKeys[k].pubkey
      );
      check(
        `${prefix}.accountKeys[${k}].signer`,
        oKeys[k].signer,
        dKeys[k].signer
      );
      check(
        `${prefix}.accountKeys[${k}].writable`,
        oKeys[k].writable,
        dKeys[k].writable
      );
      check(
        `${prefix}.accountKeys[${k}].source`,
        oKeys[k].source,
        dKeys[k].source
      );
    }

    // Instructions
    const oInsts = oTx.transaction?.message?.instructions || [];
    const dInsts = dTx.transaction?.message?.instructions || [];
    check(`${prefix}.instructions.length`, oInsts.length, dInsts.length);
    for (let ix = 0; ix < Math.min(oInsts.length, dInsts.length); ix++) {
      check(
        `${prefix}.instructions[${ix}].programId`,
        oInsts[ix].programId || '',
        dInsts[ix].programId
      );
      check(
        `${prefix}.instructions[${ix}].data`,
        oInsts[ix].data || '',
        dInsts[ix].data
      );
      const oAccs = oInsts[ix].accounts || [];
      const dAccs = dInsts[ix].accounts || [];
      check(
        `${prefix}.instructions[${ix}].accounts.length`,
        oAccs.length,
        dAccs.length
      );
    }

    // Meta
    const oMeta = oTx.meta || {};
    const dMeta = dTx.meta || {};
    check(`${prefix}.meta.fee`, oMeta.fee, dMeta.fee);
    check(
      `${prefix}.meta.computeUnitsConsumed`,
      oMeta.computeUnitsConsumed,
      dMeta.computeUnitsConsumed
    );

    // Balances
    const oPre = oMeta.preBalances || [];
    const dPre = dMeta.preBalances || [];
    check(`${prefix}.meta.preBalances.length`, oPre.length, dPre.length);

    const oPost = oMeta.postBalances || [];
    const dPost = dMeta.postBalances || [];
    check(`${prefix}.meta.postBalances.length`, oPost.length, dPost.length);

    // Token balances
    const oPreTB = oMeta.preTokenBalances || [];
    const dPreTB = dMeta.preTokenBalances || [];
    check(
      `${prefix}.meta.preTokenBalances.length`,
      oPreTB.length,
      dPreTB.length
    );
    for (let tb = 0; tb < Math.min(oPreTB.length, dPreTB.length); tb++) {
      check(
        `${prefix}.meta.preTokenBalances[${tb}].mint`,
        oPreTB[tb].mint,
        dPreTB[tb].mint
      );
      check(
        `${prefix}.meta.preTokenBalances[${tb}].owner`,
        oPreTB[tb].owner,
        dPreTB[tb].owner
      );
    }

    const oPostTB = oMeta.postTokenBalances || [];
    const dPostTB = dMeta.postTokenBalances || [];
    check(
      `${prefix}.meta.postTokenBalances.length`,
      oPostTB.length,
      dPostTB.length
    );
    for (let tb = 0; tb < Math.min(oPostTB.length, dPostTB.length); tb++) {
      check(
        `${prefix}.meta.postTokenBalances[${tb}].mint`,
        oPostTB[tb].mint,
        dPostTB[tb].mint
      );
      check(
        `${prefix}.meta.postTokenBalances[${tb}].owner`,
        oPostTB[tb].owner,
        dPostTB[tb].owner
      );
    }

    // Log messages
    const oLogs = oMeta.logMessages || [];
    const dLogs = dMeta.logMessages || [];
    check(`${prefix}.meta.logMessages.length`, oLogs.length, dLogs.length);

    // Inner instructions
    const oInner = oMeta.innerInstructions || [];
    const dInner = dMeta.innerInstructions || [];
    check(
      `${prefix}.meta.innerInstructions.length`,
      oInner.length,
      dInner.length
    );
  }

  return mismatches;
}

function augmentBlock(raw: any): any {
  return {
    ...raw,
    height: raw.blockHeight,
    timestamp: raw.blockTime,
    network: 'solana',
    blockData: {
      slot: String(raw.blockHeight),
      parentSlot: String(raw.parentSlot),
      previousBlockhash: raw.previousBlockhash || '',
    },
  };
}

const files = readdirSync(blockDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

console.log(
  `Round-trip integrity test: ${files.length} blocks from ${blockDir}\n`
);

let passCount = 0;
let failCount = 0;
let totalFields = 0;
let totalMismatches = 0;

for (const file of files) {
  const raw = JSON.parse(readFileSync(path.join(blockDir, file), 'utf8'));
  const augmented = augmentBlock(raw);

  const encoded = createSolanaBlockFromJson(augmented);
  const wrapper = new SolanaBlockWrapper(encoded);
  const mismatches = compareFields(augmented, wrapper);

  // Count checked fields (rough: mismatches + all the checks that passed)
  const txCount = augmented.transactions?.length || 0;
  const fieldsChecked = 3 + 2 + 1 + txCount * 10; // approximate
  totalFields += fieldsChecked;
  totalMismatches += mismatches.length;

  if (mismatches.length === 0) {
    passCount++;
  } else {
    failCount++;
    console.log(`FAIL: ${file} — ${mismatches.length} mismatches`);
    for (const m of mismatches.slice(0, 10)) {
      console.log(
        `  ${m.field}: expected ${JSON.stringify(m.expected)} got ${JSON.stringify(m.got)}`
      );
    }
    if (mismatches.length > 10) {
      console.log(`  ... and ${mismatches.length - 10} more`);
    }
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(
  `  RESULTS: ${passCount} passed, ${failCount} failed out of ${files.length} blocks`
);
console.log(
  `  Fields checked: ~${totalFields}, mismatches: ${totalMismatches}`
);
console.log(`${'='.repeat(60)}\n`);

if (failCount === 0) {
  console.log(`All ${files.length} blocks passed round-trip integrity check.`);
} else {
  process.exit(1);
}
