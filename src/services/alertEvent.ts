import axios from 'axios';
import { IRangeEvent } from '../types/IRangeEvent';
import { env } from '../env';

export async function createAlertEvents(args: {
  token: string;
  workspaceId: string;
  alertRuleId: string;
  alerts: IRangeEvent[];
}): Promise<{ success: boolean }> {
  const { token, workspaceId, alertRuleId, alerts } = args;

  const { data } = await axios.post<{ success: boolean }>(
    `${env.MANAGER_SERVICE.DOMAIN}${env.MANAGER_SERVICE.CREATE_ALERT_EVENT_PATH}`,
    {
      workspaceId,
      alertRuleId,
      alerts,
    },
    {
      headers: {
        'X-API-KEY': token,
      },
    },
  );

  return data;
}
