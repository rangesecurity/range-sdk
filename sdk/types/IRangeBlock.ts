import { IRangeTransaction } from "./IRangeTransaction"

export interface IRangeBlock {
  hash: string,
  height: number
  transactions: IRangeTransaction[]
  networks: string,
  timestamp: string,
}
