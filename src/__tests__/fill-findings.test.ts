import { fillFindings } from '../utils/fill-findings';

describe('fillFindings', () => {
  it('replaces template variables', () => {
    const result = fillFindings('Hello {{name}}, you have {{count}} items', {
      name: 'Alice',
      count: '3',
    });
    expect(result).toBe('Hello Alice, you have 3 items');
  });

  it('replaces missing variables with "unknown"', () => {
    const result = fillFindings('{{a}} and {{b}}', { a: 'yes' });
    expect(result).toBe('yes and unknown');
  });

  it('returns template unchanged when no variables', () => {
    expect(fillFindings('no vars here', {})).toBe('no vars here');
  });

  it('handles empty template', () => {
    expect(fillFindings('', { a: 'b' })).toBe('');
  });

  it('replaces multiple occurrences of same variable', () => {
    expect(fillFindings('{{x}} and {{x}}', { x: 'hi' })).toBe('hi and hi');
  });
});
