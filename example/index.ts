import { range } from '../sdk'
import { IRangeNetwork } from '../sdk/types/IRangeNetwork'
import { IRangeBlock } from '../sdk/types/IRangeBlock'
import { IRangeEvent } from '../sdk/types/IRangeEvent'
import { IRangeMessage } from '../sdk/types/IRangeMessage'
import { IRangeTransaction } from '../sdk/types/IRangeTransaction'

// NOTE: A simple program to demonstrate how to use the SDK
// NOTE: to create a worker that listens to blocks
// NOTE: and return events when a block has more than 1 txs

// For creating a worker, we need to choose one option from onBlock, onTransaction or onMessage

void range.init({
  token: 'xyz',
  onBlock: { callback: onBlock, filter: { networks: ['osmo-test-5'] } },
  // onTransaction: { callback: onTransaction, filter: { networks: ['osmosis-1', 'cosmoshub-4'] } },
  // onMessage: { callback: onMessage, filter: { networks: ['osmosis-1', 'cosmoshub-4'], types: ['cosmos.bank.v1beta1.MsgSend'] } },
})

async function onBlock(block: IRangeBlock, network: IRangeNetwork): Promise<IRangeEvent[]> {
  if (block.transactions.length > 1) {
    return [
      {
        type: 'block-with-more-than-1-txs',
        message: 'a block with more than 1 txs is detected'
      },
    ]
  }

  return []
}

async function onTransaction(transaction: IRangeTransaction, network: IRangeNetwork): Promise<IRangeEvent[]> {
  console.log(transaction, network)
  return []
}

async function onMessage(message: IRangeMessage, network: IRangeNetwork) {
  console.log(message, network)
  return []
}
