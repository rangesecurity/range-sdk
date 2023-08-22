import { Channel, connect as amqpConnect, ConsumeMessage } from 'amqplib'
import { env } from '../env'
import { IRangeResult } from '../types/IRangeEvent'

export class WorkPackageQueue {
  private channel: Channel | null = null

  constructor(readonly ampqHost: string) { }

  async connect() {
    const conn = await amqpConnect(this.ampqHost)
    this.channel = await conn.createChannel()
    this.channel.prefetch(1, true) // Per consumer limit
    await this.channel.assertQueue(env.TASK_REPLY_QUEUE)
  }

  async close() {
    await this.channel?.close()
  }

  async reply(events: IRangeResult[]) {
    this.channel?.sendToQueue(env.TASK_REPLY_QUEUE, Buffer.from(JSON.stringify({
      events
    })), { persistent: true })
  }

  async listen(onMessage: (msg: ConsumeMessage | null) => Promise<void>) {
    this.channel?.consume(env.TASK_QUEUE, onMessage)
  }
}
