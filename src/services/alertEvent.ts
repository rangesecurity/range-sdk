import axios from 'axios';
import { IRangeEvent } from '../types/IRangeEvent';
import { constants } from '../constants';

export async function createAlertEvents(args: {
  token: string;
  workspaceId: string | null;
  alertRuleId: string;
  alerts: IRangeEvent[];
}): Promise<{ success: boolean }> {
  const { token, workspaceId, alertRuleId, alerts } = args;

  const { data } = await axios.post<{ success: boolean }>(
    `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.CREATE_ALERT_EVENT_PATH}`,
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
