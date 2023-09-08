import { RangeSDK, IRangeNetwork, IRangeEvent, IRangeMessage, OnMessage, OnBlock, IRangeBlock, IRangeAlertRule, IRangeResult } from "../src";

const myOnBlock: OnBlock = {
    callback: async (
        block: IRangeBlock,
        rule: IRangeAlertRule,
    ): Promise<IRangeResult[]> => {
        const messages = block.transactions.flatMap((tx) => tx.messages);
        const successMessages = messages.filter((m) => m.success);

        return successMessages.map(m => ({
            details: {
                message: "Success message of type: " + m.type,
            },
            workspaceId: rule.workspaceId,
            alertRuleId: rule.id,
            time: block.timestamp,
            txHash: m.hash,
            blockNumber: String(block.height),
            network: block.network,
            addressesInvolved: m.addresses,
        }))
    },
}

// const onMessageFailed: OnMessage = {
//     callback: async (
//         m: IRangeMessage,
//         rule,
//         block: IRangeBlock,
//     ): Promise<MaybeIRangeResult> => {
//         return {
//             ruleType: "failedMessage",
//             details: {
//                 message: "Failed message of type: " + m.type,
//             },
//         };
//     },
//     filter: {
//         success: false,
//     }
// }

// const onMessageTransfer: OnMessage = {
//     callback: async (
//         m: IRangeMessage,
//         rule,
//         block: IRangeBlock,
//     ): Promise<MaybeIRangeResult> => {
//         return {
//             ruleType: "transfer",
//             details: {
//                 message: "Transfer message of type: " + m.type,
//             },
//         };
//     },
//     filter: {
//         types: ["cosmos-sdk/MsgSend"],
//     }
// }

// const onMessageIBCTransfer: OnMessage = {
//     callback: async (
//         m: IRangeMessage,
//         rule,
//         block: IRangeBlock,
//     ): Promise<MaybeIRangeResult> => {
//         return {
//             ruleType: "IBCTransfer",
//             details: {
//                 message: "IBC Transfer message of type: " + m.type,
//             },
//         };
//     },
//     filter: {
//         types: ["cosmos-sdk/MsgTransfer"],
//     }
// }

// const address = "osmo14lzvt4gdwh2q4ymyjqma0p4j4aykpn929zx75y"
// const denom = "uosmo";
// let lastBalance: string | null = null;

// const onBlockBalanceChange: OnBlock = {
//     callback: async (
//         block: IRangeBlock,
//         rule: IRangeAlertRule,
//     ): Promise<MaybeIRangeResult> => {
//         const isInvolved = block.transactions.some((tx) => {
//             return tx.messages.some((m) => {
//                 return m.addresses.includes(address);
//             })
//         });

//         if (isInvolved) {
//             const cosmosClient = range.getCosmosClient(block.network)
//             const res = await cosmosClient.balance(address, denom)
//             const currentBalance = res.balance?.amount

//             if (currentBalance) {
//                 if (lastBalance !== null) {
//                     if (lastBalance !== currentBalance) {
//                         lastBalance = currentBalance
//                         return {
//                             ruleType: "balanceChange",
//                             details: {
//                                 message: `Balance changed to ${currentBalance}`,
//                             },
//                         };
//                     }
//                 }
//                 lastBalance = currentBalance
//             }
//         }

//         return null;
//     },
//     filter: {
//     }
// }

// Defining the RangeSDK instance
const range = new RangeSDK({
    token: "xyz",
    onBlock: myOnBlock,
    networks: ["osmosis-1"],
    endpoints: { "osmosis-1": "https://rpc.osmosis.zone" },
});

// Running the RangeSDK instance
range.init();
