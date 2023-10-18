export interface IRangeMessage {
  network_id: string;
  tx_hash: string;
  index: number;
  type: string;
  data: unknown;
  status: string;
  block_number: string;
  addresses: string[];
  contract_addresses?: any;
}
