import { IRangeMessage } from './IRangeMessage'

export interface IRangeTransaction {
  height: number
  messages: IRangeMessage[]
}
