import { LRUCache } from 'lru-cache';
import axios from 'axios';
import { IRangeBlock } from '../types/chain/IRangeBlock';
import { env } from '../env';

const blockCache = new LRUCache<string, IRangeBlock>({
  max: 100, // We will keep max of 100 blocks in memory
});

export async function fetchBlock(args: {
  token: string;
  height: string;
  network: string;
}): Promise<IRangeBlock | null> {
  const { token, height, network } = args;

  const cachedBlock = blockCache.get(`${network}-${height}`);
  if (cachedBlock) {
    return cachedBlock;
  }

  const url = `${env.MANAGER_SERVICE.DOMAIN}${env.MANAGER_SERVICE.FETCH_BLOCK_BY_NETWORK_AND_HEIGHT}`;
  const {
    data: { block },
  } = await axios.get<{
    block: IRangeBlock;
  }>(url, {
    params: {
      network,
      height,
    },
    headers: {
      'X-API-KEY': token,
    },
  });

  blockCache.set(`${network}-${height}`, block);

  return block;
}
