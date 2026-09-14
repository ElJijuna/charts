import { defaultChartTheme } from '../theme/defaultTheme';
import { resolveSeries } from './resolveSeries';

describe('resolveSeries', () => {
  it('assigns theme defaults and preserves explicit values', () => {
    type Datum = { one: number; two: number };

    const resolved = resolveSeries<Datum, 'one' | 'two'>(
      [{ key: 'one' }, { key: 'two', color: '#000', strokeWidth: 8 }],
      defaultChartTheme,
    );

    expect(resolved).toEqual([
      { key: 'one', color: defaultChartTheme.colors[0], strokeWidth: 3 },
      { key: 'two', color: '#000', strokeWidth: 8 },
    ]);
  });

  it('uses the safe fallback when a theme has no palette', () => {
    type Datum = { value: number };

    expect(
      resolveSeries<Datum, 'value'>([{ key: 'value' }], { ...defaultChartTheme, colors: [] }),
    ).toEqual([{ key: 'value', color: '#6750a4', strokeWidth: 3 }]);
  });
});
