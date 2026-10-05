import { defaultChartTheme } from '@/theme/defaultTheme';
import { resolveChartTheme } from '@/theme/resolveTheme';

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
