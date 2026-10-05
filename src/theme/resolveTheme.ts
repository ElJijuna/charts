import { defaultChartTheme } from '@/theme/defaultTheme';
import type { ChartTheme, ChartThemeOverride } from '@/theme/types';

export function resolveChartTheme(override?: ChartThemeOverride): ChartTheme {
  return { ...defaultChartTheme, ...override };
}
