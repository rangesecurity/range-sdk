import { RangeSDK } from '../sdk'
import { IRangeNetwork } from '../sdk/types/IRangeNetwork'
import { IRangeBlock } from '../sdk/types/IRangeBlock'
import { IRangeEvent } from '../sdk/types/IRangeEvent'
import { IRangeMessage } from '../sdk/types/IRangeMessage'
import { IRangeTransaction } from '../sdk/types/IRangeTransaction'

// NOTE: A simple program to demonstrate how to use the SDK
// NOTE: to create a worker that listens to blocks
// NOTE: and return events when a block has more than 1 txs

// For creating a worker, we need to choose one option from onBlock, onTransaction or onMessage

const range = new RangeSDK({
  token: 'xyz',
  // onBlock: { callback: onBlock, filter: { networks: ['osmo-test-5'] } },
  onTransaction: { callback: onTransaction, filter: { networks: ['osmo-test-5'] } },
  // onMessage: { callback: onMessage, filter: { networks: ['osmo-test-5'] } },
})
range.init();

async function onBlock(block: IRangeBlock, network: IRangeNetwork): Promise<IRangeEvent[]> {
  // balanceChange
  // stateChange
  // contractQueryChange
  console.log({ block });
  return []
}

async function onTransaction(transaction: IRangeTransaction, network: IRangeNetwork): Promise<IRangeEvent[]> {
  if (transaction.success) {
    return transaction.messages.map(m => ({
      type: "successTransaction",
      message: "Success transaction of type: " + m.type,
    }))
  }

  if (!transaction.success) {
    return transaction.messages.map(m => ({
      type: "failedTransaction",
      message: "Failed transaction of type: " + m.type,
    }))
  }

  return []
}

async function onMessage(message: IRangeMessage, network: IRangeNetwork): Promise<IRangeEvent[]> {
  let alertEvents: any[] = [];

  if (message) {
    const events = [{
      type: "successTransaction",
      message: "Success transaction",
    }]
    alertEvents = [...alertEvents, ...events]
  }

  if (!message) {
    const events = [{
      type: "failedTransaction",
      message: "Failed transaction",
    }]
    alertEvents = [...alertEvents, ...events]
  }

  return alertEvents
}
