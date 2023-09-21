import axios from 'axios';
import { IRangeAlertRule } from '../types/IRangeAlertRule';
import { env } from '../env';

export async function fetchAlertRulesByRuleGroupID(args: {
  token: string;
  ruleGroupId: string;
}): Promise<IRangeAlertRule[]> {
  const { token, ruleGroupId } = args;
  const url = `${
    env.MANAGER_SERVICE.DOMAIN
  }${env.MANAGER_SERVICE.FETCH_RULES_BY_RULE_GROUP_ID_PATH(ruleGroupId)}`;

  const {
    data: { rules },
  } = await axios.get<{
    rules: IRangeAlertRule[];
  }>(url, {
    headers: {
      'X-API-KEY': token,
    },
  });

  return rules;
}

export async function fetchAlertRuleByRuleGroupAndRuleID(args: {
  token: string;
  ruleGroupId: string;
  ruleId: string;
}) {
  const { token, ruleGroupId, ruleId } = args;
  const url = `${
    env.MANAGER_SERVICE.DOMAIN
  }${env.MANAGER_SERVICE.FETCH_RULE_BY_RULE_GROUP_ID_AND_RULE_ID_PATH({
    ruleGroupId,
    ruleId,
  })}`;

  const {
    data: { rule },
  } = await axios.get<{
    rule: IRangeAlertRule | null | undefined;
  }>(url, {
    headers: {
      'X-API-KEY': token,
    },
  });

  return rule;
}
