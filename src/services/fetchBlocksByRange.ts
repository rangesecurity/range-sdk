import axios from 'axios';
import { IRangeBlock } from '../types/chain/IRangeBlock';
import { constants } from '../constants';

export async function fetchBlocksByRange(args: {
  token: string;
  network: string;
  startHeight: string;
  endHeight: string;
}): Promise<IRangeBlock[]> {
  const { token, startHeight, endHeight, network } = args;
  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.FETCH_BLOCKS_BY_RANGE}`;

  try {
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
    });

    return blocks;
  } catch (err: any) {
    if (err.response?.data?.msg) {
      throw new Error(err.response.data.msg);
    }

    throw err;
  }
}
