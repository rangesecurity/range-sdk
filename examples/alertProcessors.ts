import {
  RangeSDK,
  ISubEvent,
  OnBlock,
  IRangeBlock,
  IRangeAlertRule,
} from '../src';

const myOnBlock: OnBlock = {
  callback: async (
    block: IRangeBlock,
    rule: IRangeAlertRule,
  ): Promise<ISubEvent[]> => {
    const successMessages = block.transactions
      .filter((tx) => tx.success)
      .flatMap((tx) => tx.messages);

    return successMessages.map((m) => ({
      details: {
        message: 'Success message of type: ' + m.type,
      },
      workspaceId: rule.workspaceId || null,
      txHash: m.hash,
      addressesInvolved: m.addresses,
    }));
  },
};

(async () => {
  if (!process.env.RANGE_SDK_TOKEN) {
    throw new Error('Range SDK Token is required');
  }

  // Defining the RangeSDK instance
  await RangeSDK.build(
    {
      token: process.env.RANGE_SDK_TOKEN,
    },
    {
      onBlock: myOnBlock,
    },
  );
})();
