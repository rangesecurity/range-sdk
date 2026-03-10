/**
 * Tests the in-memory testRedis Map path used when NODE_ENV=test.
 * No real Redis connection is needed.
 */
import {
  redisGet,
  redisSet,
  redisGetJson,
  redisSetJson,
  loadCache,
  saveCache,
} from '../services/alerting-redis';

describe('alerting-redis (test env — in-memory Map)', () => {
  describe('redisGet / redisSet', () => {
    it('returns undefined for missing key', async () => {
      const val = await redisGet('nonexistent-key-' + Date.now());
      expect(val).toBeUndefined();
    });

    it('stores and retrieves a string value', async () => {
      const key = 'test-key-' + Date.now();
      await redisSet(key, 'hello');
      const val = await redisGet(key);
      expect(val).toBe('hello');
    });

    it('overwrites existing value', async () => {
      const key = 'overwrite-key-' + Date.now();
      await redisSet(key, 'first');
      await redisSet(key, 'second');
      const val = await redisGet(key);
      expect(val).toBe('second');
    });
  });

  describe('redisGetJson / redisSetJson', () => {
    it('returns empty object for missing key', async () => {
      const val = await redisGetJson('missing-json-' + Date.now());
      expect(val).toEqual({});
    });

    it('stores and retrieves JSON object', async () => {
      const key = 'json-key-' + Date.now();
      await redisSetJson(key, { count: 42, items: ['a', 'b'] });
      const val = await redisGetJson(key);
      expect(val).toEqual({ count: 42, items: ['a', 'b'] });
    });
  });

  describe('loadCache / saveCache', () => {
    it('returns empty object when no cache exists', async () => {
      const rule = { id: 'no-cache-rule-' + Date.now() } as any;
      const cache = await loadCache(rule);
      expect(cache).toEqual({});
    });

    it('saves and loads cache for a rule', async () => {
      const rule = { id: 'cached-rule-' + Date.now() } as any;
      await saveCache(rule, { lastBlock: 100, state: 'ok' });
      const cache = await loadCache(rule);
      expect(cache).toEqual({ lastBlock: 100, state: 'ok' });
    });

    it('overwrites cache on second save', async () => {
      const rule = { id: 'overwrite-cache-' + Date.now() } as any;
      await saveCache(rule, { v: 1 });
      await saveCache(rule, { v: 2 });
      const cache = await loadCache(rule);
      expect(cache).toEqual({ v: 2 });
    });
  });
});
