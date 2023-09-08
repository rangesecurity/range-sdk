export interface IRangeEvent {
  ruleType: string
  details: { message: string },
  workspaceId: string
  alertRuleId: string
  time: string
  txHash: string
  blockNumber: string
  network: string
  addressesInvolved: string[]
}

export interface IRangeError {
  details: {
    error: string,
  },
  network: string,
  blockNumber: number,
}

export type IRangeResult = IRangeEvent | IRangeError

export type MaybeIRangeResult = IRangeResult | null;
