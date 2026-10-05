import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, StackedBar } from 'victory-native';
import type { StackedBarChartProps } from '@/cartesian/types';
import { chartAnimation } from '@/core/chartAnimation';
import { EmptyChartState } from '@/core/EmptyChartState';
import { prepareCartesianData } from '@/core/prepareCartesianData';
import { resolveSeries } from '@/core/resolveSeries';
import { useChartAxisOptions } from '@/core/useChartAxisOptions';
import { useChartTheme } from '@/theme/useChartTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '@/types/data';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

function StackedBarChartComponent<
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
  accessibilityLabel = 'Stacked bar chart',
  testID,
}: StackedBarChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const axisOptions = useChartAxisOptions(axes, theme);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => series.map(({ key }) => key), [series]);
  const colors = useMemo(() => resolvedSeries.map(({ color }) => color), [resolvedSeries]);
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
          padding={padding}
          axisOptions={axisOptions}
        >
          {({ points, chartBounds }) => (
            <StackedBar
              points={resolvedSeries.map(({ key }) => points[key])}
              chartBounds={chartBounds}
              colors={colors}
              innerPadding={innerPadding}
              barWidth={barWidth}
              animate={animate ? chartAnimation : undefined}
            />
          )}
        </CartesianChart>
      ) : (
        <EmptyChartState />
      )}
    </View>
  );
}

// React.memo erases generic parameters; retain the original JSX key inference.
export const StackedBarChart = memo(
  StackedBarChartComponent,
) as unknown as typeof StackedBarChartComponent;
