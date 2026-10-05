import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, HorizontalBarGroup } from 'victory-native';

import { resolveSeries } from '../core/resolveSeries';
import { EmptyChartState } from '../core/EmptyChartState';
import { prepareCartesianData } from '../core/prepareCartesianData';
import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { HorizontalBarChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function HorizontalBarChart<
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
  groupPadding = 0.25,
  barPadding = 0.1,
  cornerRadius = 6,
  animate = true,
  style,
  accessibilityLabel = 'Horizontal bar chart',
  testID,
}: HorizontalBarChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => resolvedSeries.map(({ key }) => key), [resolvedSeries]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys),
    [data, xKey, yKeys],
  );

  return (
    <View
      accessible
      accessibilityLabel={hasData ? accessibilityLabel : `${accessibilityLabel}: No data`}
      style={[styles.root, { height, backgroundColor: theme.backgroundColor }, style]}
      testID={testID}
    >
      {hasData ? (
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
            <HorizontalBarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={groupPadding}
              withinGroupPadding={barPadding}
              roundedCorners={{
                topLeft: cornerRadius,
                topRight: cornerRadius,
                bottomLeft: cornerRadius,
                bottomRight: cornerRadius,
              }}
            >
              {resolvedSeries.map((item) => (
                <HorizontalBarGroup.Bar
                  key={String(item.key)}
                  points={points[item.key]}
                  color={item.color}
                  animate={animate ? { type: 'timing', duration: 300 } : undefined}
                />
              ))}
            </HorizontalBarGroup>
          )}
        </CartesianChart>
      ) : (
        <EmptyChartState />
      )}
    </View>
  );
}
