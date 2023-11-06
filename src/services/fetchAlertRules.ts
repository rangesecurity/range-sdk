import axios from 'axios';
import { IRangeAlertRule } from '../types/IRangeAlertRule';
import { constants } from '../constants';

export async function fetchAlertRulesByRuleGroupID(args: {
  token: string;
  ruleGroupId: string;
}): Promise<IRangeAlertRule[]> {
  const { token, ruleGroupId } = args;
  const url = `${
    constants.MANAGER_SERVICE.DOMAIN
  }${constants.MANAGER_SERVICE.FETCH_RULES_BY_RULE_GROUP_ID_PATH(ruleGroupId)}`;

  try {
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
  } catch (err: any) {
    if (err.response?.data?.msg) {
      throw new Error(err.response.data.msg);
    }

    throw err;
  }
}

export async function fetchAlertRuleByRuleGroupAndRuleID(args: {
  token: string;
  ruleGroupId: string;
  ruleId: string;
}) {
  const { token, ruleGroupId, ruleId } = args;
  const url = `${
    constants.MANAGER_SERVICE.DOMAIN
  }${constants.MANAGER_SERVICE.FETCH_RULE_BY_RULE_GROUP_ID_AND_RULE_ID_PATH({
    ruleGroupId,
    ruleId,
  })}`;

  try {
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
  } catch (err: any) {
    if (err.response?.data?.msg) {
      throw new Error(err.response.data.msg);
    }

    throw err;
  }
}
