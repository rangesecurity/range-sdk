export const RedisKeys = {
  alertRuleCacheKey: (input: { id: string }) => {
    return `rule-cache:${input.id}`;
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
