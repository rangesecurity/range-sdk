import { skipTick } from '../utils/skip-tick';

// NODE_ENV=test → skipTick always returns false in test env
describe('skipTick (test env)', () => {
  it('always returns false in test environment', () => {
    const result = skipTick({
      timestamp: new Date().toISOString(),
      ticker: 30,
      salt: 'rule-123',
    });
    expect(result).toBe(false);
  });

  it('returns false regardless of threshold', () => {
    // Even with an old timestamp that would normally be skipped
    const oldTimestamp = new Date(Date.now() - 120 * 60 * 1000).toISOString(); // 2 hours ago
    const result = skipTick({
      timestamp: oldTimestamp,
      ticker: 30,
      threshold: 60,
      salt: 'any-salt',
    });
    expect(result).toBe(false);
  });
});
