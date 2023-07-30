import { IRangeTransaction } from "./IRangeTransaction"

export interface IRangeBlock {
  height: number
  transactions: IRangeTransaction[]
}
