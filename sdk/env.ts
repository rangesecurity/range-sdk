require('dotenv').config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || '',
  AMQP_HOST: process.env.AMQP_HOST || '',
  BLOCK_QUEUE: process.env.BLOCK_QUEUE || '',
}
