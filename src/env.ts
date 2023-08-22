import { IRangeNetwork } from "./types/IRangeNetwork"

require('dotenv').config()

interface Env {
  AMQP_HOST: string
  TASK_REPLY_QUEUE: string
  TASK_QUEUE: string
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

export const env: Env = {
  AMQP_HOST: getEnvVar('AMQP_HOST'),
  TASK_REPLY_QUEUE: getEnvVar('TASK_REPLY_QUEUE'),
  TASK_QUEUE: getEnvVar('TASK_QUEUE'),
}