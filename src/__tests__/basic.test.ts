import {
  capitalizeFirstLetter,
  camelCaseToTitleCase,
  safeJsonParse,
  deepClone,
  filterCommonAddresses,
  formatAddresses,
  splitAmountDenom,
  getRunnerNetwork,
  arraySum,
  safeJsonStringify,
  removeBigintFromObject,
  findValuesFromAttributes,
  getObjectFromAttributes,
  getSenderFromMessage,
} from '../utils/basic';

describe('capitalizeFirstLetter', () => {
  it('capitalizes first letter', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });
  it('handles empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });
});

describe('camelCaseToTitleCase', () => {
  it('converts camelCase to Title Case', () => {
    expect(camelCaseToTitleCase('helloWorld')).toBe('Hello World');
  });
  it('handles single word', () => {
    expect(camelCaseToTitleCase('hello')).toBe('Hello');
  });
  it('handles multiple uppercase letters', () => {
    expect(camelCaseToTitleCase('myTestValue')).toBe('My Test Value');
  });
});

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
  });
  it('returns null for invalid JSON', () => {
    expect(safeJsonParse('not json')).toBeNull();
  });
});

describe('deepClone', () => {
  it('creates a deep copy', () => {
    const obj = { a: { b: 1 } };
    const clone = deepClone(obj);
    clone.a.b = 2;
    expect(obj.a.b).toBe(1);
  });
});

describe('filterCommonAddresses', () => {
  it('returns addresses present in both arrays', () => {
    expect(filterCommonAddresses(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual([
      'b',
      'c',
    ]);
  });
  it('returns empty array when no overlap', () => {
    expect(filterCommonAddresses(['a'], ['b'])).toEqual([]);
  });
  it('handles empty arrays', () => {
    expect(filterCommonAddresses([], ['b'])).toEqual([]);
  });
  it('deduplicates input addresses', () => {
    expect(filterCommonAddresses(['a', 'a', 'b'], ['a'])).toEqual(['a']);
  });
});

describe('formatAddresses', () => {
  it('returns empty string for empty array', () => {
    expect(formatAddresses([])).toBe('');
  });
  it('joins up to 3 addresses', () => {
    expect(formatAddresses(['a', 'b', 'c'])).toBe('a, b, c');
  });
  it('truncates with count for more than 3', () => {
    expect(formatAddresses(['a', 'b', 'c', 'd', 'e'])).toBe(
      'a, b, c and 2 others'
    );
  });
});

describe('splitAmountDenom', () => {
  it('splits amount and denom', () => {
    expect(splitAmountDenom('1000uosmo')).toEqual({
      amount: 1000,
      denom: 'uosmo',
    });
  });
  it('throws for invalid format', () => {
    expect(() => splitAmountDenom('invalid')).toThrow(
      'String format is incorrect'
    );
  });
});

describe('getRunnerNetwork', () => {
  it('extracts network from range-runner prefix', () => {
    expect(getRunnerNetwork('range-runner-eth.abc123')).toBe('eth');
  });
  it('extracts network from piscina-runner prefix', () => {
    expect(getRunnerNetwork('piscina-runner-solana.xyz')).toBe('solana');
  });
  it('extracts network from zerodhadow-runner prefix', () => {
    expect(getRunnerNetwork('zerodhadow-runner-arb1.token')).toBe('arb1');
  });
  it('handles cosmos chain IDs', () => {
    expect(getRunnerNetwork('range-runner-osmosis-1.xyz')).toBe('osmosis-1');
  });
});

describe('arraySum', () => {
  it('sums numbers', () => {
    expect(arraySum([1, 2, 3])).toBe(6);
  });
  it('returns 0 for empty array', () => {
    expect(arraySum([])).toBe(0);
  });
});

describe('safeJsonStringify', () => {
  it('stringifies regular objects', () => {
    expect(safeJsonStringify({ a: 1 })).toBe('{"a":1}');
  });
  it('converts bigint to string', () => {
    expect(safeJsonStringify({ val: BigInt(123) })).toBe('{"val":"123"}');
  });
});

describe('removeBigintFromObject', () => {
  it('converts bigints to strings', () => {
    expect(removeBigintFromObject({ a: BigInt(42), b: 'hello' })).toEqual({
      a: '42',
      b: 'hello',
    });
  });
  it('handles nested objects', () => {
    expect(removeBigintFromObject({ a: { b: BigInt(1) } })).toEqual({
      a: { b: '1' },
    });
  });
  it('handles arrays with objects containing bigints', () => {
    expect(
      removeBigintFromObject([{ a: BigInt(1) }, { b: BigInt(2) }])
    ).toEqual([{ a: '1' }, { b: '2' }]);
  });
  it('returns primitives as-is', () => {
    expect(removeBigintFromObject(null)).toBeNull();
    expect(removeBigintFromObject(42)).toBe(42);
  });
});

describe('findValuesFromAttributes', () => {
  const attrs = [
    { key: 'sender', value: 'alice' },
    { key: 'receiver', value: 'bob' },
    { key: 'amount', value: '100' },
  ];

  it('returns values for requested keys', () => {
    expect(findValuesFromAttributes(attrs, ['sender', 'amount'])).toEqual({
      sender: 'alice',
      amount: '100',
    });
  });
  it('returns null for null attributes', () => {
    expect(findValuesFromAttributes(null, ['sender'])).toBeNull();
  });
});

describe('getObjectFromAttributes', () => {
  it('converts attributes array to object', () => {
    const attrs = [
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
    ];
    expect(getObjectFromAttributes(attrs)).toEqual({ a: '1', b: '2' });
  });
  it('returns null for null input', () => {
    expect(getObjectFromAttributes(null)).toBeNull();
  });
});

describe('getSenderFromMessage', () => {
  it('finds sender from events', () => {
    const msg = {
      events: [{ attributes: [{ key: 'sender', value: 'alice' }] }],
    };
    expect(getSenderFromMessage(msg)).toBe('alice');
  });
  it('returns null when no sender', () => {
    const msg = {
      events: [{ attributes: [{ key: 'receiver', value: 'bob' }] }],
    };
    expect(getSenderFromMessage(msg)).toBeNull();
  });
});
