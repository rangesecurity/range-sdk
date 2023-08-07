import { Channel, connect as amqpConnect, ConsumeMessage } from 'amqplib'
import { env } from '../env'

export class WorkPackageQueue {
  private channel: Channel | null = null

  constructor(readonly ampqHost: string) { }

  async connect() {
    const conn = await amqpConnect(this.ampqHost)
    this.channel = await conn.createChannel()
    this.channel.prefetch(1, true) // Per consumer limit
    await this.channel.assertQueue(env.TASK_REPLY_QUEUE)
  }

  async reply(events: any[]) {
    this.channel?.sendToQueue(env.TASK_REPLY_QUEUE, Buffer.from(JSON.stringify({
      events
    })), { persistent: true })
  }
}
