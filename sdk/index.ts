import { env } from './env'
import { WorkPackageQueue } from './models/WorkPackageQueue'
import { IRangeNetwork } from './types/INetwork'
import { IRangeBlock } from './types/IRangeBlock'
import { IRangeEvent } from './types/IRangeEvent'

interface Options {
  onBlock: {
    callback: (block: IRangeBlock, network: IRangeNetwork) => Promise<IRangeEvent[]>
    filter?: { networks: IRangeNetwork[] }
  }
}

let opts: Options

async function init (options: Options) {
  opts = options
  const queue = new WorkPackageQueue(env.AMQP_HOST)
  await queue.connect()
  queue.consume(processTask)
}

async function processTask() {

}

export const range = { init }
