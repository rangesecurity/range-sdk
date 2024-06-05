interface IKeyValuePair {
  key: string;
  value: string;
  type?: 'binary';
}

export interface IRangeMessageEvent {
  type: string;
  attributes: IKeyValuePair[];
}

export interface IRangeMessage {
  network_id: string;
  tx_hash: string;
  index: number;
  type: string;
  data: unknown;
  status: string;
  addresses: string[];
  events: IRangeMessageEvent[];
  contract_addresses?: any;
}
