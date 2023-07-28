import { range } from '../sdk'
import { IRangeNetwork } from '../sdk/types/IRangeNetwork'
import { IRangeBlock } from '../sdk/types/IRangeBlock'
import { IRangeEvent } from '../sdk/types/IRangeEvent'
import { IRangeMessage } from '../sdk/types/IRangeMessage'
import { IRangeTransaction } from '../sdk/types/IRangeTransaction'

void range.init({
  token: 'xyz',
  onBlock: { callback: onBlock, filter: { networks: ['osmosis-1', 'cosmoshub-4'] } },
  onTransaction: { callback: onTransaction, filter: { networks: ['osmosis-1', 'cosmoshub-4'] } },
  onMessage: { callback: onMessage, filter: { networks: ['osmosis-1', 'cosmoshub-4'], types: ['cosmos.bank.v1beta1.MsgSend'] } },
})

async function onBlock (block: IRangeBlock, network: IRangeNetwork): Promise<IRangeEvent[]> {
  console.log(block, network)
  return []
}

async function onTransaction (transaction: IRangeTransaction, network: IRangeNetwork): Promise<IRangeEvent[]> {
  console.log(transaction, network)
  return []
}

async function onMessage (message: IRangeMessage, network: IRangeNetwork) {
  console.log(message, network)
  return []
}
