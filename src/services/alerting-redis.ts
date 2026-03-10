import * as Redis from 'redis';
import { RedisKeys } from './redis-keys';
import { IAlertRule } from '../types/IAlertRule';
import { isTestEnv } from '../utils/basic';
import { env } from '../env';

let redisClient: Redis.RedisClientType;
const testRedis = new Map();

async function initRedisClient() {
  if (isTestEnv) return;
  redisClient = Redis.createClient({
    url: `redis://${env.RUNNER_CACHE_REDIS_URL}`,
  });
  await redisClient.connect();
  redisClient.on('error', (error) => {
    throw error;
  });
}

export async function redisGet(key: string) {
  if (isTestEnv) {
    return testRedis.get(key);
  }

  if (!redisClient) await initRedisClient();
  return await redisClient.get(key);
}

export async function redisGetJson<T = any>(key: string): Promise<T> {
  if (isTestEnv) {
    const valueStr = testRedis.get(key);
    return valueStr ? JSON.parse(valueStr) : ({} as T);
  }

  if (!redisClient) await initRedisClient();
  const valueStr = await redisClient.get(key);
  return valueStr ? (JSON.parse(valueStr) as T) : ({} as T);
}

export async function redisSet(key: string, value: string, ttl?: number) {
  if (isTestEnv) {
    testRedis.set(key, value);
    return;
  }

  if (!redisClient) await initRedisClient();
  return await redisClient.set(key, value, { EX: ttl });
}

export async function redisSetJson(key: string, value: object, ttl?: number) {
  if (isTestEnv) {
    testRedis.set(key, JSON.stringify(value));
    return;
  }

  if (!redisClient) await initRedisClient();
  return await redisClient.set(key, JSON.stringify(value), { EX: ttl });
}

export async function loadCache<T>(rule: IAlertRule): Promise<T> {
  const key = RedisKeys.alertRuleCacheKey(rule);
  const cache = await redisGet(key);
  if (cache) {
    return JSON.parse(cache);
  }
  return {} as T;
}

export async function saveCache(rule: IAlertRule, cache: any) {
  const key = RedisKeys.alertRuleCacheKey(rule);
  return await redisSet(key, JSON.stringify(cache));
}
