import { useFont } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { ChartAxesConfig, HorizontalChartAxesConfig } from '@/cartesian/types';
import type { ChartTheme } from '@/theme/types';

// Victory always draws Y grid lines, even without axis options, and skips a line only when
// its width is 0. Skia strokes a 0-width frame as a hairline, so it is also made transparent.
const hiddenAxisOptions = {
  font: null,
  lineWidth: 0,
  lineColor: 'transparent',
  labelColor: 'transparent',
};

export function useChartAxisOptions(
  axesProp: ChartAxesConfig | HorizontalChartAxesConfig | false | undefined,
  theme: ChartTheme,
  // Horizontal charts render no native overlay, so they always keep canvas labels.
  supportsNativeLabels = true,
) {
  const hidden = axesProp === false;
  const axes = axesProp || undefined;
  // Native labels need no Skia font; skip loading when a ready font is given too.
  const native =
    supportsNativeLabels &&
    axes !== undefined &&
    'labelMode' in axes &&
    axes.labelMode === 'native';
  const loadedFont = useFont(
    hidden || native || axes?.font ? null : axes?.fontSource,
    axes?.fontSize ?? 12,
  );
  const font = native ? null : (axes?.font ?? loadedFont);
  const xTickCount = axes?.x?.tickCount ?? 5;
  const yTickCount = axes?.y?.tickCount ?? 5;
  const formatXLabel = axes?.x?.formatLabel;
  const formatYLabel = axes?.y?.formatLabel;
  const lineColor = axes?.x?.lineColor ?? axes?.y?.lineColor ?? theme.axisColor;
  const showGrid = axes?.grid ?? true;
  const labelColor = axes?.x?.labelColor ?? axes?.y?.labelColor ?? theme.labelColor;

  const options = useMemo(
    () => ({
      font,
      tickCount: { x: xTickCount, y: yTickCount },
      formatXLabel,
      formatYLabel,
      axisSide: { x: 'bottom' as const, y: 'left' as const },
      // Victory colors grid and frame separately; a transparent grid keeps the frame.
      lineColor: showGrid ? lineColor : { grid: 'transparent', frame: lineColor },
      labelColor,
    }),
    [font, xTickCount, yTickCount, formatXLabel, formatYLabel, lineColor, showGrid, labelColor],
  );
  return hidden ? hiddenAxisOptions : options;
}
