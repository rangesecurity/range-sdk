import {
  secToHumanReadable,
  fmtMsgType,
  fmtSec,
  fmtMin,
  format,
} from '../utils/number-fmt';

describe('format (number formatting)', () => {
  it('formats 0', () => {
    expect(format(0)).toBe('0');
  });
  it('formats small numbers', () => {
    expect(format(42)).toBe('42');
    expect(format(999.99)).toBe('999.99');
  });
  it('formats thousands as K', () => {
    expect(format(1500)).toBe('1.5K');
    expect(format(50000)).toBe('50K');
  });
  it('formats millions as M', () => {
    expect(format(1_500_000)).toBe('1.5M');
  });
  it('formats billions as B', () => {
    expect(format(2_500_000_000)).toBe('2.5B');
  });
  it('formats trillions as T', () => {
    expect(format(1_000_000_000_000)).toBe('1T');
  });
  it('formats negative numbers', () => {
    expect(format(-1500)).toBe('-1.5K');
  });
  it('formats very small numbers as ~0', () => {
    expect(format(0.0000001)).toBe('~0');
  });
  it('formats very large numbers in scientific notation', () => {
    const result = format(1e16);
    expect(result).toMatch(/e\+/);
  });
});

describe('secToHumanReadable', () => {
  it('formats seconds', () => {
    expect(secToHumanReadable(30, 'second')).toBe('30 seconds');
  });
  it('formats minutes', () => {
    expect(secToHumanReadable(90, 'second')).toBe('1 minute 30 seconds');
  });
  it('formats hours', () => {
    expect(secToHumanReadable(3661, 'second')).toBe('1 hour 1 minute 1 second');
  });
});

describe('fmtMsgType', () => {
  it('formats cosmos message type', () => {
    expect(fmtMsgType('cosmos.gov.v1.MsgVote')).toBe('MsgVote(cosmos)');
  });
  it('handles simple type', () => {
    expect(fmtMsgType('transfer')).toBe('transfer(transfer)');
  });
});

describe('fmtSec', () => {
  it('delegates to secToHumanReadable with seconds', () => {
    expect(fmtSec(60)).toBe('1 minute');
  });
});

describe('fmtMin', () => {
  it('delegates to secToHumanReadable with minutes', () => {
    expect(fmtMin(60)).toBe('1 hour');
  });
});
