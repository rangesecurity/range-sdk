export interface IRangeMessage {
  type: string
  success: boolean
  value: any
  involved_account_addresses: string[]
  height: number
  hash: string
}
