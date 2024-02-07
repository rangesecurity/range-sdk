import axios from 'axios';
import { constants } from '../constants';
import { IRangeConfig } from '../types/IRangeConfig';

export async function fetchConfig(args: { token: string }) {
  const { token } = args;
  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.FETCH_CONFIG_PATH}`;

  const { data } = await axios.get<IRangeConfig>(url, {
    headers: {
      'X-API-KEY': token,
    },
    timeout: constants.AXIOS.TIMEOUT
  });

  return data;
}
