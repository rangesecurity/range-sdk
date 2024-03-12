import axios from 'axios';
import { constants } from '../constants';

export async function tickTaskAck(args: {
  token: string;
  timestamp: string;
  ruleGroupId: string;
  runnerId: string;
  errors?: {
    ruleId: string;
    error: string;
  }[];
}): Promise<{ ackId: string }> {
  const { token, timestamp, ruleGroupId, runnerId, errors } = args;
  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.ACK_TICK_TASK_PATH}`;

  const { data } = await axios.post<{ ackId: string }>(
    url,
    {
      timestamp,
      ruleGroupId,
      runnerId,
      ...(errors?.length ? { errors } : {}),
    },
    {
      headers: {
        'X-API-KEY': token,
      },
      timeout: constants.AXIOS.TIMEOUT,
    },
  );

  return data;
}
