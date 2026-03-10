import { z } from 'zod';

const ISanctionedVal = z.record(
  z.string(),
  z.object({
    entity: z.string(),
  })
);

const EventAttributeVal = z.object({
  key: z.string(),
  value: z.string(),
});

const EventVal = z.object({
  type: z.string(),
  attributes: z.array(EventAttributeVal),
});

const CosmosMessageVal = z.object({
  network_id: z.string().optional(),
  tx_hash: z.string().optional(),
  index: z.number().optional(),
  type: z.string(),
  data: z.unknown(),
  status: z.string().optional(),
  addresses: z.array(z.string()).nullable().optional(),
  contract_addresses: z.array(z.string()).optional(),
  events: z.array(EventVal).optional(),
});

const CosmosTransactionVal = z.object({
  network: z.string().optional(),
  height: z.union([z.string(), z.number()]).optional(),
  hash: z.string(),
  index: z.number().optional(),
  messages: z.array(CosmosMessageVal),
  info: z.string().optional(),
  gas_wanted: z.union([z.string(), z.number()]).optional(),
  gas_used: z.union([z.string(), z.number()]).optional(),
  events: z.array(EventVal).optional(),
  data: z.unknown().optional(),
  status: z.string().optional(),
  success: z.boolean().optional(),
  codespace: z.string().optional(),
  code: z.number().optional(),
  log: z.string().optional(),
});

const BlockEventsVal = z.object({
  begin_block: z.array(EventVal).optional(),
  end_block: z.array(EventVal).optional(),
});

const BlockDataVal = z.object({
  malicious_addresses: z
    .union([z.array(z.string()), ISanctionedVal])
    .optional(),
  malicious_entities: z.array(z.unknown()).optional(),
  blacklisted_addresses: z
    .union([z.array(z.string()), ISanctionedVal])
    .optional(),
  blacklisted_entities: z.array(z.unknown()).optional(),
  sanctioned_addresses: z
    .union([z.array(z.string()), ISanctionedVal])
    .optional(),
  sanctioned_entities: z.array(z.unknown()).optional(),
});

export const CosmosBlockVal = z.object({
  network: z.string(),
  height: z.union([z.string(), z.number()]),
  timestamp: z.string(),
  transactions: z.array(CosmosTransactionVal),
  block_events: BlockEventsVal.optional(),
  block_data: BlockDataVal.optional(),
});

export type ICosmosBlock = z.infer<typeof CosmosBlockVal>;
export type ICosmosTransaction = z.infer<
  typeof CosmosBlockVal
>['transactions'][number];
export type ICosmosMessage = ICosmosTransaction['messages'][number];
