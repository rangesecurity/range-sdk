export const RedisKeys = {
  getParamsForRuleByRuleGroupIdAndRuleId: (input: {
    ruleGroupId: string;
    ruleId: string;
  }) => {
    return `{${input.ruleGroupId}}:rule:${input.ruleId}:parameters`;
  },

  getCachedFunctionKey(funName: string) {
    return `cached:function:{${funName}}`;
  },

  getBgAggregationKey(aggName: string) {
    return `bg:aggregation:${aggName}`;
  },

  getProgramIdlKey(programId: string) {
    return `solanafm:idl:${programId}`;
  },
};
