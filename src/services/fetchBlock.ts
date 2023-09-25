import { LRUCache } from 'lru-cache';
import axios from 'axios';
import { IRangeBlock } from '../types/chain/IRangeBlock';
import { constants } from '../constants';

const blockCache = new LRUCache<string, IRangeBlock>({
  max: constants.BLOCK_CACHE.MAX,
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

  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.FETCH_BLOCK_BY_NETWORK_AND_HEIGHT}`;
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
