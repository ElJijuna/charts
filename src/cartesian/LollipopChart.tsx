import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bar, CartesianChart, Scatter } from 'victory-native';

import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { LollipopChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function LollipopChart<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  yKey,
  axes,
  theme: themeOverride,
  color,
  stemWidth = 3,
  radius = 6,
  shape = 'circle',
  height = 240,
  padding = 16,
  animate = true,
  style,
  accessibilityLabel = 'Lollipop chart',
  testID,
}: LollipopChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const chartData = useMemo(() => [...data], [data]);
  const resolvedColor = color ?? theme.colors[0] ?? '#6750a4';
  const animation = animate ? { type: 'timing' as const, duration: 300 } : undefined;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.root, { height, backgroundColor: theme.backgroundColor }, style]}
      testID={testID}
    >
      <CartesianChart<TDatum, TXKey, TYKey>
        data={chartData}
        xKey={xKey}
        yKeys={[yKey]}
        padding={padding}
        axisOptions={{
          tickCount: { x: axes?.x?.tickCount ?? 5, y: axes?.y?.tickCount ?? 5 },
          formatXLabel: axes?.x?.formatLabel,
          formatYLabel: axes?.y?.formatLabel,
          axisSide: { x: 'bottom', y: 'left' },
          lineColor: axes?.x?.lineColor ?? axes?.y?.lineColor ?? theme.axisColor,
          labelColor: axes?.x?.labelColor ?? axes?.y?.labelColor ?? theme.labelColor,
        }}
      >
        {({ points, chartBounds }) => (
          <>
            <Bar
              points={points[yKey]}
              chartBounds={chartBounds}
              barWidth={stemWidth}
              color={resolvedColor}
              animate={animation}
            />
            <Scatter
              points={points[yKey]}
              color={resolvedColor}
              radius={radius}
              shape={shape}
              animate={animation}
            />
          </>
        )}
      </CartesianChart>
    </View>
  );
}
