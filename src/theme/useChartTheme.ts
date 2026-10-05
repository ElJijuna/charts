import { useMemo } from 'react';
import { resolveChartTheme } from './resolveTheme';
import type { ChartThemeOverride } from './types';

export function useChartTheme(override?: ChartThemeOverride) {
  const { colors, axisColor, labelColor, gridColor, backgroundColor, strokeWidth } =
    resolveChartTheme(override);
  return useMemo(
    () => ({ colors, axisColor, labelColor, gridColor, backgroundColor, strokeWidth }),
    [colors, axisColor, labelColor, gridColor, backgroundColor, strokeWidth],
  );
}
