import { axios } from '../services/axios';
import { dayjs } from './dayjs';

export const EXPLORER_API = 'https://explorer.range.org';

export async function fetchCrossChainTransactions(
  bridge: string,
  min_usd: string
) {
  if (!min_usd) min_usd = '0';
  if (!bridge) bridge = '';

  const url = `${EXPLORER_API}/api/payments?direction=first&limit=100&bridge=${bridge}&anchorTxn=&status=&min_usd=${min_usd}`;

  const res = await axios.get(url);

  return res.data.resources;
}

interface ICctpTransfer {
  id: string;
  burn_hash: string | null;
  mint_hash: string | null;
  transfer_hash: string;
  from: string;
  destination: string;
  from_network: string;
  destination_network: string;
  amount: string;
  denom: string;
  status: string;
  from_timestamp: string;
  destination_timestamp: string;
  from_block: string;
  destination_block: string | null;
  nonce: string;
}

export async function fetchCctpLatestTimestamps() {
  const res = await axios.get(
    `${EXPLORER_API}/usdc/api/usdc-helpers/latest-transfer-timestamp`
  );

  return res.data;
}

export function cleanOldNotifiedLogs(
  notified: Record<string, string>,
  timestamp: string
) {
  return Object.fromEntries(
    Object.entries(notified)
      .map((e) => {
        const [, from_timestamp] = e;
        const diffInHours = dayjs(timestamp).diff(
          dayjs(from_timestamp as string),
          'hours'
        );
        if (diffInHours < 6) {
          return e;
        }
        return null;
      })
      .filter(Boolean) as any
  );
}

interface ITransfer {
  sender_symbol: string;
  status: string;
  receiver_address: string;
  sender_address: string;
  time: string;
  bridge_info: any;
  id: string;
  sender_network: string;
  receiver_network: string;
  sender_amount: number;
  sender_tx_hash: string;
}

export async function fetchCctpPendingTransfers({
  any_network,
  begin_time,
}: {
  any_network: string;
  begin_time: string;
}): Promise<ITransfer[]> {
  const res = await axios.get(
    `${EXPLORER_API}/usdc/api/usdc-helpers/pending-transfers?any_network=${any_network}&begin_time=${begin_time}`
  );
  return res.data.resources;
}

export interface IRateLimit {
  asset_name: string;
  name: string;
  inflow: string;
  outflow: string;
  netflow: string;
  percentage_filled: string;
  base_denom_exponent: string;
  price: string;
}

export async function getRateLimits(network: string): Promise<IRateLimit[]> {
  const res = await axios.get(
    `${EXPLORER_API}/api/rate-limits?network=${network}`
  );
  return res.data.resources;
}

interface IIbcTransfer {
  id: string;
  amount: string;
  denom: string;
  sender: string;
  receiver: string;
  source_chain_id: string;
  source_channel_id: string;
  destination_chain_id: string;
  destination_channel_id: string;
  source_block_height: string;
  source_block_time: string;
  source_tx_hash: string;
  asset_symbol: string;
  ibc_status: string;
  usd: number;
  destination_ibccallbackerror_context?: string;
}

export async function getPendingTransfers({
  sourceNetworks,
  destinationNetworks,
  min_usd,
}: {
  sourceNetworks?: string;
  destinationNetworks?: string;
  min_usd?: string;
}): Promise<IIbcTransfer[]> {
  const limit = 100;
  const direction = 'first';
  const status = 'PENDING';
  const max_usd = '';

  sourceNetworks = sourceNetworks || '';
  destinationNetworks = destinationNetworks || '';
  min_usd = min_usd || '';

  const res = await axios.get(
    `${EXPLORER_API}/ibc/api/transfers?txHash=&anchorTxn=&sourceNetworks=${sourceNetworks}&destinationNetworks=${destinationNetworks}&limit=${limit}&direction=${direction}&status=${status}&min_usd=${min_usd}&max_usd=${max_usd}`
  );
  return res.data.resources;
}

export async function getErrorTransfers({
  sourceNetworks,
  destinationNetworks,
  min_usd,
}: {
  sourceNetworks?: string;
  destinationNetworks?: string;
  min_usd?: string;
}): Promise<IIbcTransfer[]> {
  const limit = 100;
  const direction = 'first';
  const status = 'ERROR_ON_DESTINATION';
  const max_usd = '';
  const res = await axios.get(
    `${EXPLORER_API}/ibc/api/transfers?txHash=&anchorTxn=&sourceNetworks=${sourceNetworks}&destinationNetworks=${destinationNetworks}&limit=${limit}&direction=${direction}&status=${status}&min_usd=${min_usd}&max_usd=${max_usd}`
  );
  return res.data.resources;
}
