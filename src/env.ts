import { config } from 'dotenv';
import { ISDKConfig } from './types/IRunnerConfig';
config({ quiet: true });

function getEnvVar(name: string, defaultValue?: string) {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export const env = {
  get PORT() {
    return Number(getEnvVar('PORT', '3000'));
  },
  get NODE_ENV() {
    return getEnvVar('NODE_ENV', 'local');
  },
  get LOG_LEVEL() {
    return getEnvVar('LOG_LEVEL', 'info');
  },

  get RUNNER_CACHE_REDIS_URL() {
    return getEnvVar('RUNNER_CACHE_REDIS_URL', this.BLOCK_REDIS_URL);
  },
  get BLOCK_REDIS_URL() {
    return getEnvVar('BLOCK_REDIS_URL', '127.0.0.1:6379');
  },
  get TICK_REDIS_URL() {
    return getEnvVar('TICK_REDIS_URL', this.BLOCK_REDIS_URL);
  },

  get RPC_PROXY_HOST() {
    return getEnvVar('RPC_PROXY_HOST');
  },
  get RPC_PROXY_TOKEN() {
    return getEnvVar('RPC_PROXY_TOKEN');
  },
  get RANGE_API_HOST() {
    return getEnvVar('RANGE_API_HOST');
  },
  get RANGE_API_KEY() {
    return getEnvVar('RANGE_API_KEY');
  },
  get SOL_DECODER_HOST() {
    return getEnvVar('SOL_DECODER_HOST');
  },
  get SOL_DECODER_TOKEN() {
    return getEnvVar('SOL_DECODER_TOKEN');
  },
  get BLOCK_DECODER_HOST() {
    return getEnvVar('BLOCK_DECODER_HOST');
  },
  get BLOCK_DECODER_TOKEN() {
    return getEnvVar('BLOCK_DECODER_TOKEN');
  },
  get REGISTER_RULE_TYPES() {
    return (
      getEnvVar('REGISTER_RULE_TYPES', 'false') === 'true' ||
      getEnvVar('REGISTER_TEMPLATES', 'false') === 'true'
    );
  },
  get REGISTER_EXTERNAL_RULE_TYPES_ENDPOINT() {
    return getEnvVar('REGISTER_EXTERNAL_RULE_TYPES_ENDPOINT', '123');
  },
  get RANGE_SDK_TOKEN() {
    return getEnvVar('RANGE_SDK_TOKEN');
  },
  get RUNNER_ID() {
    return getEnvVar('RANGE_SDK_TOKEN').split('.')[0];
  },
  get RUNNER_NETWORK() {
    // piscina-runner-eth → eth, piscina-runner-pol → pol
    return this.RUNNER_ID.replace('piscina-runner-', '');
  },
  get FETCH_RULE_ENDPOINT() {
    return getEnvVar(
      'FETCH_RULE_ENDPOINT',
      'https://api-app.range.org/api/runners/rules'
    );
  },

  get NOTIFICATIONS_REDIS_URL() {
    return getEnvVar('NOTIFICATIONS_REDIS_URL', this.BLOCK_REDIS_URL);
  },
  get NOTIFICATIONS_REDIS_STREAM_NAME() {
    return getEnvVar('NOTIFICATIONS_REDIS_STREAM_NAME', 'test-events-stream');
  },

  get RECORD_STATS() {
    return getEnvVar('RECORD_STATS', 'false') === 'true';
  },

  get BLOCK_REDIS_STREAM_NAME() {
    return getEnvVar('BLOCK_REDIS_STREAM_NAME', 'test-blocks-stream');
  },
  get BLOCK_REDIS_CONSUMER_GROUP() {
    return getEnvVar('BLOCK_REDIS_CONSUMER_GROUP', 'default-group');
  },
  get BLOCK_REDIS_CONSUMER_NAME() {
    return getEnvVar('BLOCK_REDIS_CONSUMER_NAME', 'default-consumer-0');
  },

  get TICK_REDIS_STREAM_NAME() {
    return getEnvVar('TICK_REDIS_STREAM_NAME', 'test-ticks-stream');
  },
  get TICK_REDIS_CONSUMER_GROUP() {
    return getEnvVar('TICK_REDIS_CONSUMER_GROUP', 'default-group');
  },
  get TICK_REDIS_CONSUMER_NAME() {
    return getEnvVar('TICK_REDIS_CONSUMER_NAME', 'default-consumer-0');
  },

  get MONITORING_ENABLED() {
    return getEnvVar('MONITORING_ENABLED', 'false') === 'true';
  },
  get MONITORING_SERVER_URL() {
    return getEnvVar('MONITORING_SERVER_URL', 'test');
  },
  get MONITORING_SERVER_TOKEN() {
    return getEnvVar('MONITORING_SERVER_TOKEN', 'test');
  },

  get STAT_RETENTION_DAYS() {
    return Number(getEnvVar('STAT_RETENTION_DAYS', '7'));
  },
  get STATS_LOG_DIR() {
    return getEnvVar('STATS_LOG_DIR', '/tmp/.range-logs');
  },

  get SLACK_WEBHOOK_URL() {
    return process.env.SLACK_WEBHOOK_URL || '';
  },
  get SLACK_ALERT_INTERVAL_HR() {
    return Number(process.env.SLACK_ALERT_INTERVAL_HR || '1');
  },
};

export function applyConfig(config: ISDKConfig) {
  const map: [any, string][] = [
    [config.rangeSdkToken, 'RANGE_SDK_TOKEN'],
    [config.redisUrl, 'BLOCK_REDIS_URL'],
    [config.redis?.alertingUrl || config.redisUrl, 'RUNNER_CACHE_REDIS_URL'],
    [
      config.redis?.notificationsUrl || config.redisUrl,
      'NOTIFICATIONS_REDIS_URL',
    ],
    [config.redis?.tickUrl || config.redisUrl, 'TICK_REDIS_URL'],
    [config.blockStream?.name, 'BLOCK_REDIS_STREAM_NAME'],
    [config.blockStream?.consumerGroup, 'BLOCK_REDIS_CONSUMER_GROUP'],
    [config.blockStream?.consumerName, 'BLOCK_REDIS_CONSUMER_NAME'],
    [config.tickStream?.name, 'TICK_REDIS_STREAM_NAME'],
    [config.tickStream?.consumerGroup, 'TICK_REDIS_CONSUMER_GROUP'],
    [config.tickStream?.consumerName, 'TICK_REDIS_CONSUMER_NAME'],
    [config.notificationsStreamName, 'NOTIFICATIONS_REDIS_STREAM_NAME'],
    [config.port, 'PORT'],
    [config.logLevel, 'LOG_LEVEL'],
    [config.rpcProxy?.host, 'RPC_PROXY_HOST'],
    [config.rpcProxy?.token, 'RPC_PROXY_TOKEN'],
    [config.rangeApi?.host, 'RANGE_API_HOST'],
    [config.rangeApi?.key, 'RANGE_API_KEY'],
    [config.slack?.webhookUrl, 'SLACK_WEBHOOK_URL'],
    [config.slack?.intervalHr, 'SLACK_ALERT_INTERVAL_HR'],
    [config.monitoring?.enabled, 'MONITORING_ENABLED'],
    [config.monitoring?.serverUrl, 'MONITORING_SERVER_URL'],
    [config.monitoring?.serverToken, 'MONITORING_SERVER_TOKEN'],
  ];

  for (const [value, key] of map) {
    if (value !== undefined && value !== null) {
      process.env[key] = String(value);
    }
  }
}
