import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';

import { resolveSeries } from '../core/resolveSeries';
import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { SparklineChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function SparklineChart<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  series,
  theme: themeOverride,
  height = 64,
  padding = 4,
  curve = 'monotoneX',
  connectMissingData = false,
  animate = true,
  style,
  accessibilityLabel = 'Sparkline chart',
  testID,
}: SparklineChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => resolvedSeries.map(({ key }) => key), [resolvedSeries]);
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
        padding={padding}
      >
        {({ points }) => (
          <>
            {resolvedSeries.map((item) => (
              <Line
                key={String(item.key)}
                points={points[item.key]}
                color={item.color}
                strokeWidth={item.strokeWidth}
                curveType={curve}
                connectMissingData={connectMissingData}
                animate={animate ? { type: 'timing', duration: 300 } : undefined}
              />
            ))}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
