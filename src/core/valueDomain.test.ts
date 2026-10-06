import { zeroBasedDomain } from '@/core/valueDomain';

describe('zeroBasedDomain', () => {
  it('starts positive values at zero', () => {
    expect(
      zeroBasedDomain(
        [
          { a: 30, b: 42 },
          { a: 96, b: 74 },
        ],
        ['a', 'b'],
      ),
    ).toEqual({ y: [0, 96] });
  });

  it('keeps negative values and ends at zero for all-negative data', () => {
    expect(zeroBasedDomain([{ a: -5 }, { a: 8 }], ['a'])).toEqual({ y: [-5, 8] });
    expect(zeroBasedDomain([{ a: -5 }, { a: -2 }], ['a'])).toEqual({ y: [-5, 0] });
  });

  it('uses positive and negative stack totals for stacked charts', () => {
    expect(
      zeroBasedDomain(
        [
          { a: 42, b: 30, c: -4 },
          { a: 96, b: 74, c: -10 },
        ],
        ['a', 'b', 'c'],
        true,
      ),
    ).toEqual({ y: [-10, 170] });
  });

  it('ignores missing values and leaves empty or all-zero data to Victory', () => {
    expect(zeroBasedDomain([{ a: null }, { a: Number.NaN }], ['a'])).toBeUndefined();
    expect(zeroBasedDomain([{ a: 0 }, { a: 0 }], ['a'])).toBeUndefined();
    expect(zeroBasedDomain([{ a: 3, b: null }], ['a', 'b'], true)).toEqual({ y: [0, 3] });
  });
});
