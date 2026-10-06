import { useFont } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { ChartAxesConfig } from '@/cartesian/types';
import type { ChartTheme } from '@/theme/types';

export function useChartAxisOptions(axes: ChartAxesConfig | undefined, theme: ChartTheme) {
  // Skip loading when a ready font is given; useFont returns null for a null source.
  const loadedFont = useFont(axes?.font ? null : axes?.fontSource, axes?.fontSize ?? 12);
  const font = axes?.font ?? loadedFont;
  const xTickCount = axes?.x?.tickCount ?? 5;
  const yTickCount = axes?.y?.tickCount ?? 5;
  const formatXLabel = axes?.x?.formatLabel;
  const formatYLabel = axes?.y?.formatLabel;
  const lineColor = axes?.x?.lineColor ?? axes?.y?.lineColor ?? theme.axisColor;
  const labelColor = axes?.x?.labelColor ?? axes?.y?.labelColor ?? theme.labelColor;

  return useMemo(
    () => ({
      font,
      tickCount: { x: xTickCount, y: yTickCount },
      formatXLabel,
      formatYLabel,
      axisSide: { x: 'bottom' as const, y: 'left' as const },
      lineColor,
      labelColor,
    }),
    [font, xTickCount, yTickCount, formatXLabel, formatYLabel, lineColor, labelColor],
  );
}
