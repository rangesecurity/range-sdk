export interface IKeyValuePair {
  key: string;
  value: string;
}

export interface ITransactionEvent {
  type: string;
  attributes: IKeyValuePair[];
}

export interface ITransactionLog {
  events: ITransactionEvent[];
}

export interface IRangeTransaction {
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
