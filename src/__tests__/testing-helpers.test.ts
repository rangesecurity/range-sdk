import { createNewAlertRule, getTestTimestamp } from '../utils/testing-helpers';

describe('createNewAlertRule', () => {
  it('creates a rule with defaults', () => {
    const rule = createNewAlertRule({ ruleType: 'test-rule' });
    expect(rule.ruleType).toBe('test-rule');
    expect(rule.id).toBeDefined();
    expect(rule.network).toBe('osmosis-1');
    expect(rule.severity).toBe('debug');
    expect(rule.triggerMode).toBe('BLOCK');
    expect(rule.parameters).toEqual({});
  });

  it('throws when ruleType is missing', () => {
    expect(() => createNewAlertRule({ ruleType: '' })).toThrow(
      'You forget to set ruleType'
    );
  });

  it('allows overriding defaults', () => {
    const rule = createNewAlertRule({
      ruleType: 'custom',
      network: 'solana',
      severity: 'high',
      parameters: { threshold: 10 },
    });
    expect(rule.network).toBe('solana');
    expect(rule.severity).toBe('high');
    expect(rule.parameters.threshold).toBe(10);
  });
});

describe('getTestTimestamp', () => {
  it('returns ISO string', () => {
    const ts = getTestTimestamp();
    expect(new Date(ts).toISOString()).toBe(ts);
  });

  it('adds hours offset', () => {
    const now = new Date();
    const ts = getTestTimestamp(1);
    const diff = new Date(ts).getTime() - now.getTime();
    // Should be roughly 1 hour (allow 5 second tolerance)
    expect(diff).toBeGreaterThan(3595000);
    expect(diff).toBeLessThan(3605000);
  });
});
