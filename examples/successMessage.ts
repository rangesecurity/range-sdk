import { RangeSDK, ISubEvent, OnBlock, IRangeBlock } from '../src';

const myOnBlock: OnBlock = {
  callback: async (block: IRangeBlock): Promise<ISubEvent[]> => {
    const successMessages = block.transactions
      .filter((tx) => tx.success)
      .flatMap((tx: any) => tx.messages);

    return successMessages.map((m) => ({
      details: {
        message: 'Success message of type: ' + m.type,
      },
      caption: 'Success message',
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
