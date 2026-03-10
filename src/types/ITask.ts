import { IAlertRule } from './IAlertRule';
import { IEvent } from './IEvent';

export interface ITask {
  alertRule: IAlertRule;
  blockInfo?: {
    network: string;
    height: string;
    time: string;
  };
  tickInfo?: {
    time: string;
  };
  sharedBuffer?: SharedArrayBuffer;
  sharedBufferLength?: number; // actual payload byte count within the SharedArrayBuffer
  flatBuffer?: boolean; // true = sharedBuffer contains FlatBuffer bytes (not JSON)
  // Add timing communication buffer for thread begin time tracking
  timingBuffer?: SharedArrayBuffer; // 16 bytes: [threadBeginTime, isProcessing]
  processorsFile: string;
}

export type ITaskStatus = 'success' | 'failure' | 'timeout';

export interface ITaskResult {
  status: ITaskStatus;
  events: IEvent[];
  threadTimeSpent: number;
  threadBeginTime?: number; // Add thread begin time to result
  error?: string;
}

export interface IStat {
  alertRuleId: string;
  blockInfo?: {
    network: string;
    height: string;
    time: string;
  };
  tickInfo?: {
    time: string;
  };
  events: IEvent[];
  eventCount: number;
  status: ITaskStatus;
  threadTimeSpent: number;
  waitTimeSpent: number;
  error?: string;
  startedAt: string;
}
