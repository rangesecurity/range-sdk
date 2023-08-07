import { IRangeNetwork } from "./types/IRangeNetwork"

require('dotenv').config()

interface Env {
  KAFKA: {
    HOSTS: string
    SECURE: boolean
    SSL?: {
      CA_FILE: string
      KEY_FILE: string
      CERT_FILE: string
    }
    SASL?: {
      USERNAME: string
      PASSWORD: string
    }
  },

  KAFKA_TOPICS: Record<IRangeNetwork, string>

  AMQP_HOST: string
  TASK_REPLY_QUEUE: string
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

export const env: Env = {
  KAFKA: {
    HOSTS: getEnvVar('KAFKA_HOSTS'),
    SECURE: getEnvVar('KAFKA_SECURE', 'false') === 'false' ? false : true,
    SSL: {
      CA_FILE: getEnvVar('KAFKA_SSL_CA_FILE'),
      KEY_FILE: getEnvVar('KAFKA_SSL_KEY_FILE'),
      CERT_FILE: getEnvVar('KAFKA_SSL_CERT_FILE'),
    },
    SASL: {
      USERNAME: getEnvVar('KAFKA_SASL_USERNAME'),
      PASSWORD: getEnvVar('KAFKA_SASL_PASSWORD'),
    }
  },

  KAFKA_TOPICS: {
    "osmosis-1": getEnvVar('KAFKA_TOPIC_OSMOSIS_1'),
    "osmo-test-5": getEnvVar('KAFKA_TOPIC_OSMO_TEST_5'),
    "cosmoshub-4": getEnvVar('KAFKA_TOPIC_COSMOSHUB_4'),
    "mocha-3": getEnvVar('KAFKA_TOPIC_MOCHA_3'),
  },

  AMQP_HOST: getEnvVar('AMQP_HOST'),
  TASK_REPLY_QUEUE: getEnvVar('TASK_REPLY_QUEUE'),
}