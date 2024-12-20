import { RangeSDK, ISubEvent, OnBlock, IRangeBlock } from '../src';

const myOnBlock: OnBlock = {
  callback: {
    successMessage: async (block: IRangeBlock): Promise<ISubEvent[]> => {
      const alerts: ISubEvent[] = [];

      for (const tx of block.transactions) {
        if (!tx.success) {
          continue;
        }

        for (const m of tx.messages) {
          alerts.push({
            details: {
              message: 'Success message of type: ' + m.type,
            },
            caption: 'Success message',
          });
        }
      }

      return alerts;
    },
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
