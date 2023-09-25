import {
  RangeSDK,
  IRangeEvent,
  OnBlock,
  IRangeBlock,
  IRangeAlertRule,
} from '../src';

const myOnBlock: OnBlock = {
  callback: async (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ): Promise<IRangeEvent[]> => {
    const successMessages = block.transactions
      .filter((tx) => tx.success)
      .flatMap((tx) => tx.messages);

    return successMessages.map((m) => ({
      details: {
        message: 'Success message of type: ' + m.type,
      },
      workspaceId: rule.workspaceId,
      alertRuleId: rule.id,
      time: block.timestamp,
      txHash: m.hash,
      blockNumber: String(block.height),
      network: block.network,
      addressesInvolved: m.addresses,
    }));
  },
};

(async () => {
  if (!process.env.RANGE_SDK_TOKEN) {
    throw new Error('Range SDK Token is required');
  }

  // Defining the RangeSDK instance
  const range = await RangeSDK.build({
    token: process.env.RANGE_SDK_TOKEN,
    onBlock: myOnBlock,
    networks: ['osmosis-1'],
    endpoints: { 'osmosis-1': 'https://rpc.osmosis.zone' },
  });
})();
