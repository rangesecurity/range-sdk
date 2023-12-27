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
  try {
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
    });

    blockCache.set(`${network}-${height}`, block);

    return block;
  } catch (err: any) {
    if (err.response?.data?.msg) {
      let msg = err.response.data.msg;
      const availableRanges = err.response.data.availableRanges;
      if (availableRanges) {
        msg += `. Available ranges of blocks are:: ${JSON.stringify(
          availableRanges,
        )}`;
      }

      throw new Error(msg);
    }

    throw err;
  }
}
