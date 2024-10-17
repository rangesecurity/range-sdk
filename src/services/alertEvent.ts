import axios from 'axios';
import { IRangeEvent } from '../types/IRangeEvent';
import { constants } from '../constants';

export async function createAlertEvents(args: {
  token: string;
  workspaceId: string | null;
  ruleGroupId: string;
  alertRuleId: string;
  alerts: IRangeEvent[];
}): Promise<{ success: true } | { success: false; retryAfterUnixSec: number }> {
  const { token, workspaceId, ruleGroupId, alertRuleId, alerts } = args;

  const { data } = await axios.post<
    { success: true } | { success: false; retryAfterUnixSec: number }
  >(
    `${constants.MANAGER_SERVICE.DOMAIN}${constants.MANAGER_SERVICE.CREATE_ALERT_EVENT_PATH}`,
    {
      workspaceId,
      ruleGroupId,
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
