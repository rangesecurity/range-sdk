import { RedisKeys } from '../services/redis-keys';

describe('RedisKeys', () => {
  it('generates alert rule cache key', () => {
    expect(RedisKeys.alertRuleCacheKey({ id: 'rule-123' })).toBe(
      'rule-cache:rule-123'
    );
  });

  it('generates cached function key', () => {
    expect(RedisKeys.getCachedFunctionKey('myFunc')).toBe(
      'cached:function:{myFunc}'
    );
  });

  it('generates bg aggregation key', () => {
    expect(RedisKeys.getBgAggregationKey('volume')).toBe(
      'bg:aggregation:volume'
    );
  });

  it('generates program IDL key', () => {
    expect(RedisKeys.getProgramIdlKey('11111111111111111111111111111111')).toBe(
      'solanafm:idl:11111111111111111111111111111111'
    );
  });
});
