import { RangeSDK, IRangeNetwork, IRangeEvent, networkArray, IRangeMessage } from "../sdk";

const range = new RangeSDK({
  token: "xyz",
  onMessage: {
    callback: onMessage,
    filter: {
      success: false,
    },
  },
  networks: networkArray,
});
range.init();

async function onMessage(
  m: IRangeMessage,
  network: IRangeNetwork
): Promise<IRangeEvent[]> {
  return [{
    type: "failedMessage",
    message: "Failed message of type: " + m.type,
    network
  }];
}
