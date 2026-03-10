import { z } from 'zod';

// ── Instruction ──

const InstructionVal = z.object({
  parsed: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  programId: z.string(),
  program: z.string().optional(),
  accounts: z.array(z.string()).optional(),
  data: z.string().optional(),
  stackHeight: z.number().nullable(),
});

// ── Address table lookups ──

const AddressTableLookupVal = z.object({
  accountKey: z.string(),
  readonlyIndexes: z.array(z.number()),
  writableIndexes: z.array(z.number()),
});

// ── Token balance ──

const TokenBalanceVal = z.object({
  accountIndex: z.number(),
  mint: z.string(),
  owner: z.string(),
  programId: z.string(),
  uiTokenAmount: z.object({
    amount: z.string(),
    decimals: z.number(),
    uiAmount: z.number().nullable(),
    uiAmountString: z.string(),
  }),
});

// ── Sanctioned addresses ──

const ISanctionedVal = z.record(
  z.string(),
  z.object({
    entity: z.string(),
  })
);

// ── Block events ──

const BlockEventsVal = z.object({
  begin_block: z.array(z.unknown()).optional(),
  end_block: z.array(z.unknown()).optional(),
});

// ── Block ──

const SolanaBlockVal = z.object({
  network: z.literal('solana'),
  height: z.string(),
  hash: z.string(),
  timestamp: z.string(),
  block_data: z.object({
    slot: z.string(),
    parent_slot: z.string(),
    previous_blockhash: z.string(),
    malicious_addresses: z.union([
      ISanctionedVal,
      z.record(z.string(), z.never()),
    ]),
    sanctioned_addresses: z.union([
      ISanctionedVal,
      z.record(z.string(), z.never()),
    ]),
    blacklisted_addresses: z.union([
      ISanctionedVal,
      z.record(z.string(), z.never()),
    ]),
  }),
  block_events: BlockEventsVal.optional(),
  transactions: z.array(
    z.object({
      version: z.union([z.string(), z.number()]),
      transaction: z.object({
        message: z.object({
          accountKeys: z.array(
            z.object({
              pubkey: z.string(),
              signer: z.boolean(),
              source: z.string(),
              writable: z.boolean(),
            })
          ),
          instructions: z.array(InstructionVal),
          recentBlockhash: z.string(),
          addressTableLookups: z.array(AddressTableLookupVal).optional(),
        }),
        signatures: z.array(z.string()),
      }),
      meta: z.object({
        computeUnitsConsumed: z.number(),
        costUnits: z.number(),
        err: z.any().nullable(),
        fee: z.number(),
        innerInstructions: z.array(
          z.object({
            index: z.number(),
            instructions: z.array(InstructionVal),
          })
        ),
        logMessages: z.array(z.string()),
        preBalances: z.array(z.number()),
        postBalances: z.array(z.number()),
        preTokenBalances: z.array(TokenBalanceVal),
        postTokenBalances: z.array(TokenBalanceVal),
        rewards: z.array(z.unknown()),
        status: z.union([
          z.object({ Ok: z.null() }),
          z.object({ Err: z.unknown() }),
        ]),
      }),
    })
  ),
});

export { SolanaBlockVal };
export type ISolanaBlock = z.infer<typeof SolanaBlockVal>;
export type ISolanaTransaction = z.infer<
  typeof SolanaBlockVal
>['transactions'][number];
