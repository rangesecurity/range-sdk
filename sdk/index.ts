import { env } from './env'
import { WorkPackageQueue } from './models/WorkPackageQueue'
import { IRangeNetwork } from './types/IRangeNetwork'
import { IRangeBlock } from './types/IRangeBlock'
import { IRangeEvent } from './types/IRangeEvent'
import { Channel, ConsumeMessage } from 'amqplib'
import { IRangeMessage } from './types/IRangeMessage'
import { IRangeTransaction } from './types/IRangeTransaction'
import { toBuffer } from './utils/toBuffer'

interface Options {
  token: string
  onBlock?: {
    callback: (block: IRangeBlock, network: IRangeNetwork) => Promise<IRangeEvent[]>
    filter?: { networks: IRangeNetwork[] }
  },
  onTransaction?: {
    callback: (transaction: IRangeTransaction, network: IRangeNetwork) => Promise<IRangeEvent[]>
    filter?: { networks: IRangeNetwork[], success?: boolean }
  },
  onMessage?: {
    callback: (message: IRangeMessage, network: IRangeNetwork) => Promise<IRangeEvent[]>
    filter?: { networks?: IRangeNetwork[], types?: string[] }
  }
}

let opts: Options

async function init(options: Options) {
  // tbd: Later we fetch the config from the scheduler
  // instead of defining it in .env. This will allow
  // the scheduler to filter events beforehand and it will
  // serve as auth layer. await axios.post(..., { token, options })

  opts = options
  const queue = new WorkPackageQueue(env.AMQP_HOST)
  await queue.connect()
  queue.consume(processTask)
}

async function processTask(msg: ConsumeMessage, channel: Channel) {
  try {
    const taskObj = JSON.parse(String(msg.content))
    console.log({ taskObj });

    if (opts.onBlock) {
      if (opts.onBlock.filter?.networks && !opts.onBlock.filter?.networks.includes(taskObj.network)) {
        return
      }

      const events = await opts.onBlock.callback(taskObj.block, taskObj.network)
      console.log({ events });

      if (events.length > 0) {
        channel.sendToQueue(
          msg.properties.replyTo,
          toBuffer({
            id: taskObj.id,
            events,
          }),
          {
            correlationId: taskObj.id,
          }
        )
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    channel.ack(msg)
  }
}

export const range = { init }
