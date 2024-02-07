import axios from 'axios';
import { constants } from '../constants';

export async function taskAck(args: {
  token: string;
  block: {
    network: string;
    height: string;
  };
  ruleGroupId: string;
  runnerId: string;
  errors?: {
    ruleId: string;
    error: string;
  }[];
}): Promise<{ ackId: string }> {
  const { token, block, ruleGroupId, runnerId, errors } = args;
  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.ACK_TASK_PATH}`;

  const { data } = await axios.post<{ ackId: string }>(
    url,
    {
      block: block,
      ruleGroupId: ruleGroupId,
      runnerId,
      ...(errors?.length ? { errors } : {}),
    },
    {
      headers: {
        'X-API-KEY': token,
      },
      timeout: constants.AXIOS.TIMEOUT
    },
  );

  return data;
}

export async function errorTaskAck(args: {
  token: string;
  errorId: string;
  error?: string;
  retry: boolean;
}) {
  const { token, errorId, error, retry } = args;
  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.ACK_ERROR_TASK_PATH}`;

  const { data } = await axios.patch<{ success: boolean }>(
    url,
    {
      errorId,
      ...(error && { error }),
      retry,
    },
    {
      headers: {
        'X-API-KEY': token,
      },
    },
  );

  return data;
}
