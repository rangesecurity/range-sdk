import { IRangeMessage } from './IRangeMessage'

export interface IKeyValuePair {
  key: string,
  value: string,
}

export interface ITransactionEvent {
  type: string,
  attributes: IKeyValuePair[],
}

export interface ITransactionLog {
  events: ITransactionEvent[],
}

export interface IRangeTransaction {
  height: number
  messages: IRangeMessage[]
  success: boolean
  hash: string
  logs: { events: ITransactionEvent }[]
}
