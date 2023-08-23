import { RangeSDK, IRangeNetwork, IRangeEvent, IRangeMessage, OnMessage, OnBlock, IRangeBlock } from "../src";

const onMessageSuccess: OnMessage = {
    callback: async (
        m: IRangeMessage,
        network: IRangeNetwork,
        timestamp: string,
        taskPackage: any
    ): Promise<IRangeEvent[]> => {
        return [{
            ruleType: "successMessage",
            details: {
                message: "Success message of type: " + m.type,
            },
            network
        }];
    },
    filter: {
        success: true,
    }
}

const onMessageFailed: OnMessage = {
    callback: async (
        m: IRangeMessage,
        network: IRangeNetwork
    ): Promise<IRangeEvent[]> => {
        return [{
            ruleType: "failedMessage",
            details: {
                message: "Failed message of type: " + m.type,
            },
            network
        }];
    },
    filter: {
        success: false,
    }
}

const onMessageTransfer: OnMessage = {
    callback: async (
        m: IRangeMessage,
        network: IRangeNetwork
    ): Promise<IRangeEvent[]> => {
        return [{
            ruleType: "transfer",
            details: {
                message: "Transfer message of type: " + m.type,
            },
            network
        }];
    },
    filter: {
        types: ["cosmos-sdk/MsgSend"],
    }
}

const onMessageIBCTransfer: OnMessage = {
    callback: async (
        m: IRangeMessage,
        network: IRangeNetwork
    ): Promise<IRangeEvent[]> => {
        return [{
            ruleType: "IBCTransfer",
            details: {
                message: "IBC Transfer message of type: " + m.type,
            },
            network
        }];
    },
    filter: {
        types: ["cosmos-sdk/MsgTransfer"],
    }
}

const address = "osmo14lzvt4gdwh2q4ymyjqma0p4j4aykpn929zx75y"
const denom = "uosmo";
let lastBalance: string | null = null;

const onBlockBalanceChange: OnBlock = {
    callback: async (
        block: IRangeBlock,
        network: IRangeNetwork
    ): Promise<IRangeEvent[]> => {
        const isInvolved = block.transactions.some((tx) => {
            return tx.messages.some((m) => {
                return m.addresses.includes(address);
            })
        });

        if (isInvolved) {
            const cosmosClient = range.getCosmosClient(network)
            const res = await cosmosClient.balance(address, denom)
            const currentBalance = res.balance?.amount

            if (currentBalance) {
                if (lastBalance !== null) {
                    if (lastBalance !== currentBalance) {
                        lastBalance = currentBalance
                        return [{
                            ruleType: "balanceChange",
                            details: {
                                message: `Balance changed to ${currentBalance}`,
                            },
                            network
                        }];
                    }
                }
                lastBalance = currentBalance
            }
        }

        return []
    },
    filter: {
    }
}

// Defining the RangeSDK instance
const range = new RangeSDK({
    token: "xyz",
    onMessages: [onMessageSuccess, onMessageFailed, onMessageTransfer, onMessageIBCTransfer],
    onBlocks: [onBlockBalanceChange],
    networks: ["osmosis-1"],
    endpoints: { "osmosis-1": "https://rpc.osmosis.zone" },
});

// Running the RangeSDK instance
range.init();
