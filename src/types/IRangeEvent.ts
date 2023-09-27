export interface IRangeEvent {
  details: { message: string };
  workspaceId: string;
  alertRuleId: string;
  time: string;
  txHash: string;
  blockNumber: string;
  network: string;
  addressesInvolved: string[];
}

export interface ISubEvent {
  details: { message: string };
  txHash: string;
  addressesInvolved: string[];
}

export interface IRangeError {
  ruleId: string;
  error: string;
}

export type IRangeResult = IRangeEvent | IRangeError;
