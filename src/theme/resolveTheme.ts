import { defaultChartTheme } from './defaultTheme';
import type { ChartTheme, ChartThemeOverride } from './types';

export function resolveChartTheme(override?: ChartThemeOverride): ChartTheme {
  return { ...defaultChartTheme, ...override };
}
