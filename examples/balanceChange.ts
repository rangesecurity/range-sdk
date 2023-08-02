import { RangeSDK, IRangeNetwork, IRangeEvent, networkArray, IRangeMessage } from "../sdk";

const range = new RangeSDK({
    token: "xyz",
    onMessage: {
        callback: onMessage,
        filter: {
            networks: ['osmosis-1'],
        }
    },
    endpoints: {
        'osmosis-1': 'https://rpc.osmosis.zone:443'
    },
});
range.init();

const address = "osmo14lzvt4gdwh2q4ymyjqma0p4j4aykpn929zx75y"
const denom = "uosmo";
let lastBalance: string | undefined;


async function onMessage(
    m: IRangeMessage,
    network: IRangeNetwork
): Promise<IRangeEvent[]> {
    const cosmosClient = range.getCosmosClient('osmosis-1')

    const res = await cosmosClient.balance(address, denom)
    const currentBalance = res.balance?.amount

    if (currentBalance) {
        if (lastBalance) {
            if (lastBalance !== currentBalance) {
                lastBalance = currentBalance
                return [{
                    type: "balanceChange",
                    message: `Balance changed to ${currentBalance}`,
                    network
                }];
            }
        }
        lastBalance = currentBalance
    }

    return [];
}
