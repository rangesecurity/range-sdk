import { RangeSDK } from "../sdk";
import { IRangeNetwork } from "../sdk/types/IRangeNetwork";
import { IRangeBlock } from "../sdk/types/IRangeBlock";
import { IRangeEvent } from "../sdk/types/IRangeEvent";
import { IRangeMessage } from "../sdk/types/IRangeMessage";
import { IRangeTransaction } from "../sdk/types/IRangeTransaction";

const range = new RangeSDK({
  token: "xyz",
  onBlock: { callback: onBlock, filter: { networks: ['osmo-test-5'] } },
  onTransaction: {
    callback: onTransaction,
    filter: { networks: ["osmo-test-5"] },
  },
  onMessage: {
    callback: onMessage,
    filter: {
      networks: ["osmo-test-5"],
      types: ["cosmwasm.wasm.v1.MsgExecuteContract"],
      success: true,
    },
  },
});
range.init();

async function onBlock(
  block: IRangeBlock,
  network: IRangeNetwork
): Promise<IRangeEvent[]> {
  // balanceChange
  // stateChange
  // contractQueryChange
  if (block.transactions.length > 1) {
    return [{
      type: "blockWithMoreThanOneTx",
      message: "Block with multiple txs detected: " + block.transactions.length,
    }]
  }

  return [];
}

async function onTransaction(
  transaction: IRangeTransaction,
  network: IRangeNetwork
): Promise<IRangeEvent[]> {
  if (transaction.success) {
    return transaction.messages.map((m) => ({
      type: "successTransaction",
      message: "Success transaction of type: " + m.type,
    }));
  }

  if (!transaction.success) {
    return transaction.messages.map((m) => ({
      type: "failedTransaction",
      message: "Failed transaction of type: " + m.type,
    }));
  }

  return [];
}

async function onMessage(
  message: IRangeMessage,
  network: IRangeNetwork
): Promise<IRangeEvent[]> {
  return [{
    type: "contractMessageExecution",
    message: "Contract message execution of type: " + message.type,
  }]
}
