import { memo, type ReactElement, useMemo } from 'react';

import { useChartTheme } from '../theme/useChartTheme';
import { PieChart } from './PieChart';
import type { GaugeChartProps } from './types';

function GaugeChartComponent({
  value,
  max = 100,
  theme: themeOverride,
  valueColor,
  trackColor,
  height = 240,
  innerRadius = '70%',
  startAngle = 180,
  circleSweepDegrees = 180,
  animate = true,
  style,
  accessibilityLabel = 'Gauge chart',
  testID,
}: GaugeChartProps): ReactElement {
  const theme = useChartTheme(themeOverride);
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;
  const data = useMemo(
    () => [
      {
        label: 'Value',
        value: safeValue,
        color: valueColor ?? theme.colors[0] ?? '#6750a4',
      },
      {
        label: 'Remaining',
        value: safeMax - safeValue,
        color: trackColor ?? theme.gridColor,
      },
    ],
    [safeMax, safeValue, theme, trackColor, valueColor],
  );

  return (
    <PieChart
      data={data}
      theme={theme}
      height={height}
      innerRadius={innerRadius}
      startAngle={startAngle}
      circleSweepDegrees={circleSweepDegrees}
      animate={animate}
      style={style}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}

export const GaugeChart = memo(GaugeChartComponent);
