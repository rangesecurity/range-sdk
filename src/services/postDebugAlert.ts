import axios from 'axios';
import { constants } from '../constants';

export interface DebugAlert {
  runnerId: string;
  alert: Record<string, unknown>;
  blockNetwork?: string;
  blockHeight?: string;
  ruleGroupId?: string;
  ruleId?: string;
}

export async function postDebugAlert(args: {
  token: string;
  ping: boolean;
  debugAlerts: DebugAlert[];
}): Promise<{ success: boolean }> {
  const { token, ping, debugAlerts } = args;
  const url = `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.POST_DEBUG_ALERT_PATH}`;

  const { data } = await axios.post<{ success: boolean }>(
    url,
    {
      debugAlerts: debugAlerts.map((da) => ({
        ...da,
        alert: JSON.stringify(da.alert, null, 2),
      })),
      ping,
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
