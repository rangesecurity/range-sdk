import { IAlertRule } from './IAlertRule';

export interface ISDKConfig {
  // Required — minimum to run
  rangeSdkToken: string;
  blockStream?: { name: string; consumerGroup: string; consumerName: string };
  tickStream?: { name: string; consumerGroup: string; consumerName: string };
  notificationsStreamName?: string;

  // Redis — single URL for everything, optional per-connection overrides
  redisUrl?: string; // default '127.0.0.1:6379', used for block, alerting, and notifications
  redis?: {
    alertingUrl?: string; // override for alerting connection
    notificationsUrl?: string; // override for notifications connection
    tickUrl?: string; // override for tick stream connection (defaults to redisUrl)
  };

  // Optional
  port?: number;
  logLevel?: string;
  rpcProxy?: { host: string; token: string };
  rangeApi?: { host: string; key: string };
  slack?: { webhookUrl: string; intervalHr?: number };
  monitoring?: { enabled: boolean; serverUrl: string; serverToken: string };
}

export interface IRunnerConfig {
  processors: string;
  range_sdk_token?: string;
  config?: ISDKConfig;
  testAlertRules?: IAlertRule[];
}
