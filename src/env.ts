import { IRangeNetwork } from './types/IRangeNetwork';

require('dotenv').config();

interface Env {
  KAFKA_TOPIC: string;
  KAFKA_ERROR_TOPIC: string;
  KAFKA: {
    HOSTS: string;
    SECURE: boolean;
    SSL?: {
      CA_FILE: string;
      KEY_FILE: string;
      CERT_FILE: string;
    };
    SASL?: {
      USERNAME: string;
      PASSWORD: string;
    };
  };

  MANAGER_SERVICE: {
    DOMAIN: string;
    CREATE_ALERT_EVENT_PATH: string;
    ACK_TASK_PATH: string;
    FETCH_BLOCK_BY_NETWORK_AND_HEIGHT: string;
    FETCH_RULES_BY_RULE_GROUP_ID_PATH: (ruleGroupId: string) => string;
    FETCH_RULE_BY_RULE_GROUP_ID_AND_RULE_ID_PATH: (args: {
      ruleGroupId: string;
      ruleId: string;
    }) => string;
    ACK_ERROR_TASK_PATH: string;
  };
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const env: Env = {
  KAFKA_TOPIC: getEnvVar('KAFKA_TOPIC'),
  KAFKA_ERROR_TOPIC: getEnvVar('KAFKA_ERROR_TOPIC'),
  KAFKA: {
    HOSTS: getEnvVar('KAFKA_HOSTS'),
    SECURE: getEnvVar('KAFKA_SECURE', 'false') === 'false' ? false : true,
  },

  MANAGER_SERVICE: {
    DOMAIN: getEnvVar('NOTIFIER_SERVICE_DOMAIN'),
    CREATE_ALERT_EVENT_PATH: '/v1.0/rule-group/block/alerts/by-rule-id',
    ACK_TASK_PATH: '/v1.0/rule-group/block/ack',
    FETCH_BLOCK_BY_NETWORK_AND_HEIGHT: '/v1.0/rule-group/block',
    FETCH_RULES_BY_RULE_GROUP_ID_PATH: (ruleGroupId: string) =>
      `/v1.0/rule-group/${ruleGroupId}/rules`,
    FETCH_RULE_BY_RULE_GROUP_ID_AND_RULE_ID_PATH: (args: {
      ruleGroupId: string;
      ruleId: string;
    }) => `/v1.0/rule-group/${args.ruleGroupId}/rule/${args.ruleId}`,
    ACK_ERROR_TASK_PATH: '/v1.0/rule-group/block/error/ack',
  },
};
