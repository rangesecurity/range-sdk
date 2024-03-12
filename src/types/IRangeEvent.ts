export interface IRangeEvent {
  details: { message: string };
  workspaceId: string | null;
  alertRuleId: string;
  time: string;
  txHash: string;
  blockNumber?: string;
  network?: string;
  addressesInvolved: string[];
  severity?: string;
  caption: string;
}

export type ISubEvent = Pick<
  IRangeEvent,
  'details' | 'txHash' | 'addressesInvolved' | 'severity' | 'caption'
>;

export interface IRangeError {
  ruleId: string;
  error: string;
}

export type IRangeResult = IRangeEvent | IRangeError;
