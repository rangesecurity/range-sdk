import {
  validParam,
  invalidParam,
  validGreaterThan,
  invalidGreaterThan,
  validSubString,
  isSmallerThan,
  isNotSmallerThan,
} from '../utils/validParam';

describe('validParam', () => {
  it('returns true when ruleParam is undefined', () => {
    expect(validParam('anything', undefined)).toBe(true);
  });

  it('matches string to string', () => {
    expect(validParam('alice', 'alice')).toBe(true);
    expect(validParam('alice', 'bob')).toBe(false);
  });

  it('checks if string input is in array ruleParam', () => {
    expect(validParam('alice', ['alice', 'bob'])).toBe(true);
    expect(validParam('charlie', ['alice', 'bob'])).toBe(false);
  });

  it('returns true for empty array ruleParam', () => {
    expect(validParam('anything', [])).toBe(true);
  });

  it('checks if array input contains string ruleParam', () => {
    expect(validParam(['alice', 'bob'], 'alice')).toBe(true);
    expect(validParam(['alice', 'bob'], 'charlie')).toBe(false);
  });

  it('checks overlap between two arrays', () => {
    expect(validParam(['a', 'b'], ['b', 'c'])).toBe(true);
    expect(validParam(['a', 'b'], ['c', 'd'])).toBe(false);
  });

  it('returns true for empty ruleParam array with array input', () => {
    expect(validParam(['a'], [])).toBe(true);
  });
});

describe('invalidParam', () => {
  it('negates validParam', () => {
    expect(invalidParam('alice', 'alice')).toBe(false);
    expect(invalidParam('alice', 'bob')).toBe(true);
  });
});

describe('validGreaterThan', () => {
  it('returns true when threshold is undefined', () => {
    expect(validGreaterThan(5, undefined)).toBe(true);
  });
  it('compares numbers', () => {
    expect(validGreaterThan(10, 5)).toBe(true);
    expect(validGreaterThan(5, 10)).toBe(false);
    expect(validGreaterThan(5, 5)).toBe(false);
  });
  it('handles string inputs', () => {
    expect(validGreaterThan('10', '5')).toBe(true);
  });
});

describe('invalidGreaterThan', () => {
  it('negates validGreaterThan', () => {
    expect(invalidGreaterThan(10, 5)).toBe(false);
    expect(invalidGreaterThan(5, 10)).toBe(true);
  });
});

describe('validSubString', () => {
  it('returns true when param is falsy', () => {
    expect(validSubString('hello', undefined)).toBe(true);
  });
  it('checks substring', () => {
    expect(validSubString('hello world', 'world')).toBe(true);
    expect(validSubString('hello', 'world')).toBe(false);
  });
});

describe('isSmallerThan', () => {
  it('returns true when threshold is undefined', () => {
    expect(isSmallerThan(5, undefined)).toBe(true);
  });
  it('compares numbers', () => {
    expect(isSmallerThan(5, 10)).toBe(true);
    expect(isSmallerThan(10, 5)).toBe(false);
  });
});

describe('isNotSmallerThan', () => {
  it('negates isSmallerThan', () => {
    expect(isNotSmallerThan(5, 10)).toBe(false);
    expect(isNotSmallerThan(10, 5)).toBe(true);
  });
});
