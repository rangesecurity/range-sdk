import { IRangeNetwork } from "./types/IRangeNetwork";

require("dotenv").config();

interface Env {
  KAFKA_TOPIC: string;
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
    FETCH_RULES_BY_RULE_GROUP_ID_PATH: (ruleGroupId: string) => {};
    FETCH_BLOCK_BY_NETWORK_AND_HEIGHT: string;
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
  KAFKA_TOPIC: getEnvVar("KAFKA_TOPIC"),
  KAFKA: {
    HOSTS: getEnvVar("KAFKA_HOSTS"),
    SECURE: getEnvVar("KAFKA_SECURE", "false") === "false" ? false : true,
    // SSL: {
    //   CA_FILE: getEnvVar('KAFKA_SSL_CA_FILE'),
    //   KEY_FILE: getEnvVar('KAFKA_SSL_KEY_FILE'),
    //   CERT_FILE: getEnvVar('KAFKA_SSL_CERT_FILE'),
    // },
    // SASL: {
    //   USERNAME: getEnvVar('KAFKA_SASL_USERNAME'),
    //   PASSWORD: getEnvVar('KAFKA_SASL_PASSWORD'),
    // }
  },

  MANAGER_SERVICE: {
    DOMAIN: getEnvVar("NOTIFIER_SERVICE_DOMAIN"),
    CREATE_ALERT_EVENT_PATH: "/v1.0/rule-group/block/alerts/by-rule-id",
    ACK_TASK_PATH: "/v1.0/rule-group/block/ack",
    FETCH_RULES_BY_RULE_GROUP_ID_PATH: (ruleGroupId: string) =>
      `/v1.0/rule-group/${ruleGroupId}/rules`,
    FETCH_BLOCK_BY_NETWORK_AND_HEIGHT: "/v1.0/rule-group/block",
  },
};
