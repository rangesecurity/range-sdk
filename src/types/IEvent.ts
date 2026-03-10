export interface IEventDetails {
  message: string;
  customAttributes?: any;
  [key: string]: any;
}

export interface IEvent {
  id: string;
  details: IEventDetails;
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

export type ISubEvent = Pick<IEvent, 'details' | 'severity' | 'caption'> &
  Partial<Pick<IEvent, 'txHash' | 'addressesInvolved'>>;
