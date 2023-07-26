import { Channel, connect as amqpConnect, ConsumeMessage } from 'amqplib'
import { env } from '../env'

export class WorkPackageQueue {
  private channel: Channel | null = null

  constructor(readonly ampqHost: string) {}

  async connect(): Promise<{ channel: Channel }> {
    const conn = await amqpConnect(this.ampqHost)

    this.channel = await conn.createChannel()
    this.channel.prefetch(1, true) // Per consumer limit

    await this.channel.assertQueue(env.BLOCK_QUEUE)
    return { channel: this.channel }
  }

  async consume(fn: (m: ConsumeMessage, channel: Channel) => void) {
    this.channel?.consume(env.BLOCK_QUEUE, (msg: ConsumeMessage | null) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (msg) fn(msg, this.channel!)
    })
  }
}
