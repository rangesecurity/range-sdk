import { RedisKeys } from '../../utils/redis-keys';
import { redisGetJson, redisSetJson } from '../alerting-redis';
import { isTestEnv } from '../../utils/basic';
import { fetchCached } from '../cached-requests';

// Base helper class with shared functionality
export class BaseHelper {
  async loadCache<T>(rule: any): Promise<T> {
    if (isTestEnv && rule.cache) {
      return rule.cache;
    }

    const cacheKey = RedisKeys.getParamsForRuleByRuleGroupIdAndRuleId({
      ruleGroupId: rule.ruleGroupId,
      ruleId: rule.id,
    });

    const cacheParams = await redisGetJson<T>(cacheKey);

    return cacheParams || ({} as T);
  }

  async saveCache(rule: any, cache: any) {
    const cacheKey = RedisKeys.getParamsForRuleByRuleGroupIdAndRuleId({
      ruleGroupId: rule.ruleGroupId,
      ruleId: rule.id,
    });

    const serializedCache = JSON.parse(
      JSON.stringify(cache, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      })
    );

    await redisSetJson(cacheKey, serializedCache);
    return true;
  }

  async fetchCached<T>(func: () => T, uniqueKey: string): Promise<T> {
    return fetchCached(func, uniqueKey);
  }
}
