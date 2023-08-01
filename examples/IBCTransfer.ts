import { RangeSDK, IRangeNetwork, IRangeEvent, networkArray, IRangeMessage } from "../sdk";

const messageTypes = {
  sent: 'ibc.applications.transfer.v1.MsgTransfer',
  received: 'ibc.core.channel.v1.MsgRecvPacket',
}
const range = new RangeSDK({
  token: "xyz",
  onMessage: {
    callback: onMessage,
    filter: {
      networks: networkArray,
      types: Object.values(messageTypes)
    }
  }
});
range.init();

async function onMessage(
  m: IRangeMessage,
  network: IRangeNetwork
): Promise<IRangeEvent[]> {
  return [{
    type: "IBCTransfer",
    message: "IBC Transfer message of type: " + m.type,
    network,
  }];
}
