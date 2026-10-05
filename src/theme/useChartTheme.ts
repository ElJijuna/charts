import { useMemo } from 'react';
import { resolveChartTheme } from '@/theme/resolveTheme';
import type { ChartThemeOverride } from '@/theme/types';

export function useChartTheme(override?: ChartThemeOverride) {
  const { colors, axisColor, labelColor, gridColor, backgroundColor, strokeWidth } =
    resolveChartTheme(override);
  return useMemo(
    () => ({ colors, axisColor, labelColor, gridColor, backgroundColor, strokeWidth }),
    [colors, axisColor, labelColor, gridColor, backgroundColor, strokeWidth],
  );
}
