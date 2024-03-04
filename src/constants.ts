interface Constants {
  MANAGER_SERVICE: {
    DOMAIN: string;
    FETCH_CONFIG_PATH: string;
    CREATE_ALERT_EVENT_PATH: string;
    ACK_TASK_PATH: string;
    ACK_TICK_TASK_PATH: string;
    FETCH_BLOCK_BY_NETWORK_AND_HEIGHT: string;
    FETCH_BLOCKS_BY_RANGE: string;
    FETCH_RULES_BY_RULE_GROUP_ID_PATH: (ruleGroupId: string) => string;
    FETCH_RULE_BY_RULE_GROUP_ID_AND_RULE_ID_PATH: (args: {
      ruleGroupId: string;
      ruleId: string;
    }) => string;
    ACK_ERROR_TASK_PATH: string;
  };

  BLOCK_CACHE: {
    MAX: number;
  };

  AXIOS: {
    TIMEOUT: number;
  };
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const constants: Constants = {
  MANAGER_SERVICE: {
    DOMAIN: getEnvVar(
      'RANGE_SDK_MANAGER_SERVICE_DOMAIN',
      'https://manager.range.org',
    ),
    FETCH_CONFIG_PATH: '/v1.0/range-sdk/config',
    CREATE_ALERT_EVENT_PATH: '/v1.0/alert-event',
    ACK_TASK_PATH: '/v1.0/rule-group/block/ack',
    ACK_TICK_TASK_PATH: '/v1.0/rule-group/tick/ack',
    FETCH_BLOCK_BY_NETWORK_AND_HEIGHT: '/v1.0/rule-group/block',
    FETCH_BLOCKS_BY_RANGE: '/v1.0/rule-group/block/by-range',
    FETCH_RULES_BY_RULE_GROUP_ID_PATH: (ruleGroupId: string) =>
      `/v1.0/rule-group/${ruleGroupId}/rules`,
    FETCH_RULE_BY_RULE_GROUP_ID_AND_RULE_ID_PATH: (args: {
      ruleGroupId: string;
      ruleId: string;
    }) => `/v1.0/rule-group/${args.ruleGroupId}/rule/${args.ruleId}`,
    ACK_ERROR_TASK_PATH: '/v1.0/rule-group/block/error/ack',
  },

  BLOCK_CACHE: {
    MAX: 100,
  },
  AXIOS: {
    TIMEOUT: 3000, // 3 seconds
  },
};
