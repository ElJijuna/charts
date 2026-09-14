import { defaultChartTheme } from './defaultTheme';
import { resolveChartTheme } from './resolveTheme';

describe('resolveChartTheme', () => {
  it('returns the default theme', () => {
    expect(resolveChartTheme()).toEqual(defaultChartTheme);
  });

  it('merges an override without discarding defaults', () => {
    expect(resolveChartTheme({ labelColor: '#fff' })).toEqual({
      ...defaultChartTheme,
      labelColor: '#fff',
    });
  });
});
