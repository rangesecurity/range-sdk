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
    POST_DEBUG_ALERT_PATH: string;
  };

  RULE_QUARANTINE: {
    PER_EXEC_TIME_CUT_OFF_MS: number;
    AVG_EXEC_TIME_CUT_OFF_MS: number;
    AVG_EXEC_TIME_DEBUG_ALERT_MS: number;
    QUARANTINE_TIME_MINS: number;
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

function getEnvVarNumber(
  key: string,
  defaultValue?: number,
  validations?: {
    min?: number;
    max?: number;
  },
): number {
  const value = process.env[key];
  if ([undefined, null, ''].includes(value) || Number.isNaN(Number(value))) {
    if ((!defaultValue && defaultValue !== 0) || Number.isNaN(defaultValue)) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    return defaultValue;
  }

  const parsed = Number(value);
  if (validations) {
    if (
      Object.prototype.hasOwnProperty.call(validations, 'min') &&
      parsed < (validations.min as number)
    ) {
      throw new Error(
        `Environment variable fails validation: min allowed val: ${validations.min}`,
      );
    }
    if (
      Object.prototype.hasOwnProperty.call(validations, 'max') &&
      parsed > (validations.max as number)
    ) {
      throw new Error(
        `Environment variable fails validation: max allowed val: ${validations.max}`,
      );
    }
  }

  return parsed;
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
    POST_DEBUG_ALERT_PATH: '/v1.0/range-sdk/debug-alert',
  },

  RULE_QUARANTINE: {
    PER_EXEC_TIME_CUT_OFF_MS: getEnvVarNumber(
      'RULE_QUARANTINE_PER_EXEC_TIME_CUT_OFF_MS',
      15000,
      {
        min: 5000,
        max: 15000,
      },
    ),
    AVG_EXEC_TIME_CUT_OFF_MS: getEnvVarNumber(
      'RULE_QUARANTINE_AVG_EXEC_TIME_CUT_OFF_MS',
      1000,
      {
        min: 1000,
        max: 3000,
      },
    ),
    AVG_EXEC_TIME_DEBUG_ALERT_MS: getEnvVarNumber(
      'RULE_QUARANTINE_AVG_EXEC_TIME_DEBUG_ALERT_MS',
      400,
      {
        min: 400,
        max: 3000,
      },
    ),
    QUARANTINE_TIME_MINS: getEnvVarNumber(
      'RULE_QUARANTINE_QUARANTINE_TIME_MINS',
      15,
      {
        min: 5,
        max: 30,
      },
    ),
  },

  BLOCK_CACHE: {
    MAX: 100,
  },
  AXIOS: {
    TIMEOUT: 15000, // 15 seconds
  },
};
