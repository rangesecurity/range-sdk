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
  includeAvailableRangeOnNotFound?: boolean;
}): Promise<IRangeBlock | null> {
  const { token, height, network, includeAvailableRangeOnNotFound } = args;

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
      ...(includeAvailableRangeOnNotFound && {
        includeAvailableRangeOnNotFound,
      }),
    },
    headers: {
      'X-API-KEY': token,
    },
    timeout: constants.AXIOS.TIMEOUT,
  });

  blockCache.set(`${network}-${height}`, block);

  return block;
}

export async function fetchBlockRange(args: {
  token: string;
  startHeight: string;
  endHeight: string;
  network: string;
}): Promise<IRangeBlock[]> {
  const { token, startHeight, endHeight, network } = args;

  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.FETCH_BLOCKS_BY_RANGE}`;
  const {
    data: { blocks },
  } = await axios.get<{
    blocks: IRangeBlock[];
  }>(url, {
    params: {
      network,
      startHeight,
      endHeight,
    },
    headers: {
      'X-API-KEY': token,
    },
    timeout: constants.AXIOS.TIMEOUT,
  });

  blocks.forEach(block => {
    blockCache.set(`${network}-${block.height}`, block);
  });

  return blocks;
}

