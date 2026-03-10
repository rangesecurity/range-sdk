import { dayjs } from '../utils/dayjs';
import { RedisKeys } from '../utils/redis-keys';
import { redisGetJson, redisSetJson } from './alerting-redis';

const DEFAULT_CACHE_TIME_IN_MINUTES = 5;

export async function fetchCached<T>(
  func: () => T,
  uniqueKey: string
): Promise<T> {
  const currentTime = dayjs();

  const cacheKey = RedisKeys.getCachedFunctionKey(uniqueKey);

  const cached = await redisGetJson(cacheKey);

  if (
    cached?.timestamp &&
    currentTime.diff(dayjs(cached.timestamp), 'minute') <
      DEFAULT_CACHE_TIME_IN_MINUTES
  ) {
    console.log(`get cached value ${uniqueKey} fetched at ${cached.timestamp}`);
    return cached.value;
  }

  const value = await func();

  console.log(`set ${uniqueKey} at ${currentTime.toISOString()}`);
  redisSetJson(cacheKey, {
    value,
    timestamp: currentTime.toISOString(),
  });
  return value;
}
