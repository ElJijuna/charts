import { describeSeries } from '@/accessibility/describeSeries';

describe('describeSeries', () => {
  it('lists X and Y values in data order with default separators', () => {
    const data = [
      { day: 'Mon', visits: 40 },
      { day: 'Tue', visits: 70 },
    ];

    expect(describeSeries(data, { xKey: 'day', yKey: 'visits' })).toBe('Mon, 40, Tue, 70');
  });

  it('uses app-provided formatters and separators', () => {
    const data = [
      { day: 'lun', visits: 1234.5 },
      { day: 'mar', visits: 70 },
    ];
    const number = new Intl.NumberFormat('es-ES');

    expect(
      describeSeries(data, {
        xKey: 'day',
        yKey: 'visits',
        formatX: (day) => day.toUpperCase(),
        formatY: (value) => number.format(value),
        valueSeparator: ': ',
        pointSeparator: '; ',
      }),
    ).toBe(`LUN: ${number.format(1234.5)}; MAR: 70`);
  });

  it('skips points the chart cannot plot and sorts numeric X values', () => {
    const data = [
      { x: 3, y: 30 },
      { x: 1, y: 10 },
      { x: 2, y: Number.NaN },
      { x: Number.POSITIVE_INFINITY, y: 5 },
      { x: 4, y: null },
      null as unknown as { x: number; y: number },
    ];

    expect(describeSeries(data, { xKey: 'x', yKey: 'y' })).toBe('1, 10, 3, 30');
  });

  it('keeps category order and returns an empty string without plottable points', () => {
    expect(
      describeSeries(
        [
          { x: 'b', y: 2 },
          { x: 'a', y: 1 },
        ],
        { xKey: 'x', yKey: 'y' },
      ),
    ).toBe('b, 2, a, 1');
    expect(describeSeries([] as { x: string; y: number }[], { xKey: 'x', yKey: 'y' })).toBe('');
  });
});
