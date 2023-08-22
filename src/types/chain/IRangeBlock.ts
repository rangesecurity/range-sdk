import { IRangeNetwork } from "../IRangeNetwork"
import { IRangeTransaction } from "./IRangeTransaction"

export interface IRangeBlock {
  hash: string,
  height: number
  transactions: IRangeTransaction[]
  network: IRangeNetwork,
  timestamp: string,
}
