require('dotenv').config()

export const test_env = {
  AMQP_HOST: process.env.AMQP_HOST || '',
  TASK_QUEUE: process.env.TASK_QUEUE || '',
}
