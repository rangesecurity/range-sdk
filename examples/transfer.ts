import { RangeSDK, IRangeNetwork, IRangeEvent, networkArray, IRangeMessage } from "../sdk";

const TRANSFER_MESSAGE_TYPE = 'cosmos.bank.v1beta1.MsgSend'

const range = new RangeSDK({
  token: "xyz",
  onMessage: {
    callback: onMessage,
    filter: {
      types: [TRANSFER_MESSAGE_TYPE]
    }
  },
  networks: networkArray,
});
range.init();

async function onMessage(
  m: IRangeMessage,
  network: IRangeNetwork
): Promise<IRangeEvent[]> {
  return [{
    type: "transfer",
    message: "Transfer message of type: " + m.type,
    network,
  }];
}
