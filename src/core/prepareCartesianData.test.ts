import { prepareCartesianData } from './prepareCartesianData';

describe('prepareCartesianData', () => {
  it('preserves valid values, zero, negatives and caller objects', () => {
    const input = Object.freeze([
      Object.freeze({ x: 'A', y: 0 }),
      Object.freeze({ x: 'B', y: -5 }),
    ]);
    expect(prepareCartesianData(input, 'x', ['y'])).toEqual({ data: input, hasData: true });
  });

  it('preserves gaps, normalizes invalid Y and removes invalid X without mutation', () => {
    const input = [
      { x: 0, y: 12, other: 3 },
      { x: 1, y: Number.NaN, other: Number.POSITIVE_INFINITY },
      { x: 2, y: null, other: undefined },
      { x: Number.POSITIVE_INFINITY, y: 99, other: 5 },
      { x: null, y: 99, other: 5 },
      { x: 3, y: '12', other: 8 },
    ];
    const result = prepareCartesianData(input, 'x', ['y', 'other']);
    expect(result.data).toEqual([
      input[0],
      { x: 1, y: null, other: null },
      input[2],
      { x: 3, y: null, other: 8 },
    ]);
    expect(input[1]?.y).toBeNaN();
    expect(result.hasData).toBe(true);
  });

  it('detects empty, missing-only and unconfigured series', () => {
    expect(prepareCartesianData([], 'x', ['y']).hasData).toBe(false);
    expect(prepareCartesianData([{ x: 1, y: Number.NaN }], 'x', ['y']).hasData).toBe(false);
    expect(prepareCartesianData([{ x: 1, y: 12 }], 'x', []).hasData).toBe(false);
  });

  it('requires complete numeric samples for ranges, bubbles and candles', () => {
    const input = [
      { x: 1, y: 5, size: Number.NaN },
      { x: 2, y: 6, size: 8 },
    ];
    expect(prepareCartesianData(input, 'x', ['y'], ['y', 'size'])).toEqual({
      data: [input[1]],
      hasData: true,
    });
  });
});
