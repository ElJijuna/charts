import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, HorizontalStackedBar } from 'victory-native';

import { resolveSeries } from '../core/resolveSeries';
import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { HorizontalStackedBarChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function HorizontalStackedBarChart<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  series,
  axes,
  theme: themeOverride,
  height = 240,
  padding = 16,
  innerPadding = 0.25,
  barWidth,
  animate = true,
  style,
  accessibilityLabel = 'Horizontal stacked bar chart',
  testID,
}: HorizontalStackedBarChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => resolvedSeries.map(({ key }) => key), [resolvedSeries]);
  const colors = useMemo(() => resolvedSeries.map(({ color }) => color), [resolvedSeries]);
  const chartData = useMemo(() => [...data], [data]);

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
        yKeys={yKeys}
        orientation="horizontal"
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
          <HorizontalStackedBar
            points={resolvedSeries.map(({ key }) => points[key])}
            chartBounds={chartBounds}
            colors={colors}
            innerPadding={innerPadding}
            barWidth={barWidth}
            animate={animate ? { type: 'timing', duration: 300 } : undefined}
          />
        )}
      </CartesianChart>
    </View>
  );
}
