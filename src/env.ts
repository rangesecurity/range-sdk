import { IRangeNetwork } from "./types/IRangeNetwork"

require('dotenv').config()

interface Env {
  AMQP_HOST: string
  TASK_REPLY_QUEUE: string
  TASK_QUEUE: string

  APPDB_PG_HOST: string
  APPDB_PG_PORT: number,
  APPDB_PG_USER: string,
  APPDB_PG_PASSWORD: string,
  APPDB_PG_DATABASE: string,
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
  APPDB_PG_HOST: getEnvVar('APPDB_PG_HOST'),
  APPDB_PG_PORT: Number(getEnvVar('APPDB_PG_PORT')),
  APPDB_PG_USER: getEnvVar('APPDB_PG_USER'),
  APPDB_PG_PASSWORD: getEnvVar('APPDB_PG_PASSWORD'),
  APPDB_PG_DATABASE: getEnvVar('APPDB_PG_DATABASE'),
}