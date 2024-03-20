import axios from 'axios';
import { RangeSDK, ISubEvent, OnTick } from '../src';

const myOnTick: OnTick = {
  callback: async (): Promise<ISubEvent[]> => {
    const rpcStatusUrl = `https://rpc.osmosis.zone/status`;
    try {
      await axios.get(rpcStatusUrl);
      return [];
    } catch (error) {
      return [
        {
          details: {
            message: 'Osmosis RPC is down',
          },
          caption: 'RPC Down',
        },
      ];
    }
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
      onTick: myOnTick,
    },
  );
})();
