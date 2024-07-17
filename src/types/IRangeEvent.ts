export interface IRangeEvent {
  details: { message: string } & Record<string, any>;
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

export type ISubEvent = Pick<IRangeEvent, 'details' | 'severity' | 'caption'> &
  Partial<Pick<IRangeEvent, 'txHash' | 'addressesInvolved'>>;

export interface IRangeError {
  ruleId: string;
  error: string;
}

export type IRangeResult = IRangeEvent | IRangeError;
