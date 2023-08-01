import { Network } from "../network"

export interface IRangeEvent {
  type: string
  message: string
  network: Network
}
