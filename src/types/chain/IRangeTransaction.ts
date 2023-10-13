import { IRangeMessage } from './IRangeMessage';

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
  data: string;
  hash: string;
  logs: { events: ITransactionEvent[] }[];
  index: number;
  height: number;
  status: string;
  network: string;
  success: boolean;
  messages: IRangeMessage[];
}
