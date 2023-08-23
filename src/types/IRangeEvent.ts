export interface IRangeEvent {
  // workspaceId: string
  // alertRuleId: string
  // time: string
  // txHash: string | null
  // blockNumber: string
  // addressesInvolved: string
  ruleType: string
  details: { message: string },
  network: string,
}

export interface IRangeError {
  details: {
    error: string,
  },
  network: string,
  blockNumber: number,
}

export type IRangeResult = IRangeEvent | IRangeError | any