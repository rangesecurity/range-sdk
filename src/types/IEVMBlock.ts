import { z } from 'zod';

// ── Transaction ──

const EVMAccessListVal = z.object({
  address: z.string(),
  storageKeys: z.array(z.string()),
});

const EVMAuthorizationVal = z.object({
  chainId: z.string(),
  address: z.string(),
  nonce: z.string(),
  yParity: z.string(),
  r: z.string(),
  s: z.string(),
});

const EVMTransactionVal = z.object({
  blockHash: z.string(),
  blockNumber: z.string(),
  from: z.string(),
  gas: z.string(),
  gasPrice: z.string(),
  maxFeePerGas: z.string().optional(),
  maxPriorityFeePerGas: z.string().optional(),
  maxFeePerBlobGas: z.string().optional(),
  hash: z.string(),
  input: z.string(),
  nonce: z.string(),
  to: z.string().nullable(),
  transactionIndex: z.string(),
  value: z.string(),
  type: z.string(),
  accessList: z.array(EVMAccessListVal).optional(),
  chainId: z.string().optional(),
  blobVersionedHashes: z.array(z.string()).optional(),
  v: z.string(),
  r: z.string(),
  s: z.string(),
  yParity: z.string().optional(),
  // EIP-7702
  authorizationList: z.array(EVMAuthorizationVal).optional(),
  // OP stack
  depositReceiptVersion: z.string().optional(),
  sourceHash: z.string().optional(),
  mint: z.string().optional(),
});

// ── Block result ──

const WithdrawalVal = z.object({
  index: z.string(),
  validatorIndex: z.string(),
  address: z.string(),
  amount: z.string(),
});

const EVMResultVal = z.object({
  baseFeePerGas: z.string(),
  blobGasUsed: z.string().optional(),
  difficulty: z.string(),
  excessBlobGas: z.string().optional(),
  extraData: z.string(),
  gasLimit: z.string(),
  gasUsed: z.string(),
  hash: z.string(),
  logsBloom: z.string(),
  miner: z.string(),
  mixHash: z.string(),
  nonce: z.string(),
  number: z.string(),
  parentBeaconBlockRoot: z.string().optional(),
  parentHash: z.string(),
  receiptsRoot: z.string(),
  sha3Uncles: z.string(),
  size: z.string(),
  stateRoot: z.string(),
  timestamp: z.string(),
  transactions: z.array(EVMTransactionVal),
  transactionsRoot: z.string().optional(),
  uncles: z.array(z.unknown()).optional(),
  withdrawals: z.array(WithdrawalVal).optional(),
  withdrawalsRoot: z.string().optional(),
  requestsHash: z.string().optional(),
  // L2 / chain-specific
  l1BlockNumber: z.string().optional(),
  sendCount: z.string().optional(),
  sendRoot: z.string().optional(),
  milliTimestamp: z.string().optional(),
  totalDifficulty: z.string().optional(),
});

export const EVMBlockRPCVal = z.object({
  jsonrpc: z.string(),
  id: z.union([z.string(), z.number()]),
  result: EVMResultVal,
});

// ── Receipt ──

const EVMLogVal = z.object({
  address: z.string(),
  topics: z.array(z.string()),
  data: z.string(),
  blockNumber: z.string(),
  transactionHash: z.string(),
  transactionIndex: z.string(),
  blockHash: z.string(),
  blockTimestamp: z.string().optional(),
  logIndex: z.string(),
  removed: z.boolean(),
});

const EVMReceiptVal = z.object({
  blockHash: z.string(),
  blockNumber: z.string(),
  contractAddress: z.string().nullable(),
  cumulativeGasUsed: z.string(),
  effectiveGasPrice: z.string(),
  from: z.string(),
  gasUsed: z.string(),
  logs: z.array(EVMLogVal),
  logsBloom: z.string(),
  status: z.string(),
  to: z.string().nullable(),
  transactionHash: z.string(),
  transactionIndex: z.string(),
  type: z.string(),
  // L2 / chain-specific
  gasUsedForL1: z.string().optional(),
  l1BlockNumber: z.string().optional(),
  l1Fee: z.string().optional(),
  l1GasPrice: z.string().optional(),
  l1GasUsed: z.string().optional(),
  l1BaseFeeScalar: z.string().optional(),
  l1BlobBaseFee: z.string().optional(),
  l1BlobBaseFeeScalar: z.string().optional(),
  daFootprintGasScalar: z.string().optional(),
  blobGasUsed: z.string().optional(),
  blobGasPrice: z.string().optional(),
  depositNonce: z.string().optional(),
  depositReceiptVersion: z.string().optional(),
  timeboosted: z.boolean().optional(),
});

// ── Transfer ──

const EVMTransferVal = z.object({
  sender: z.string(),
  receiver: z.string(),
  amount: z.string(),
  asset: z.string(),
  block_time: z.string(),
  native: z.boolean(),
  native_inside_contract: z.boolean(),
});

// ── Top-level block ──

export const EVMBlockVal = z.object({
  network: z.string(),
  height: z.union([z.string(), z.number()]),
  timestamp: z.string(),
  chain_id: z.number(),
  block: EVMBlockRPCVal,
  receipts: z.record(z.string(), EVMReceiptVal),
  transfers: z.record(z.string(), z.array(EVMTransferVal)),
});

// ── Exported types ──

export type IEVMBlockRPC = z.infer<typeof EVMBlockRPCVal>;
export type IEVMBlock = z.infer<typeof EVMBlockVal>;
export type IEVMTransaction = z.infer<
  typeof EVMBlockRPCVal
>['result']['transactions'][number];
export type IEVMReceipt = z.infer<typeof EVMReceiptVal>;
export type IEVMLog = z.infer<typeof EVMLogVal>;
export type IEVMTransfer = z.infer<typeof EVMTransferVal>;
