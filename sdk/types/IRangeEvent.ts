export interface IRangeEvent {
  // id: string
  ruleType: string
  details: { message: string },
  network: string,
  // timestamp: Date,
  // createdAt: Date,
  // txHash: string,
  // blockNumber: string,
  // addressesInvolved: string[],
  // resolved: boolean,
  // workspaceId: string,
}

export interface IRangeError {
  details: {
    error: string,
  },
  network: string,
  blockNumber: number,
}

export type IRangeResult = IRangeEvent | IRangeError