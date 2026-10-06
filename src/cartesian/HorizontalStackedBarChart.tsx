import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, HorizontalStackedBar } from 'victory-native';
import type { HorizontalStackedBarChartProps } from '@/cartesian/types';
import { EmptyChartState, emptyAccessibilityLabel } from '@/core/EmptyChartState';
import { prepareCartesianData } from '@/core/prepareCartesianData';
import { resolveSeries } from '@/core/resolveSeries';
import { useChartAnimation } from '@/core/useChartAnimation';
import { useChartAxisOptions } from '@/core/useChartAxisOptions';
import { useChartTheme } from '@/theme/useChartTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '@/types/data';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

function HorizontalStackedBarChartComponent<
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
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: HorizontalStackedBarChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
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
      accessibilityLabel={emptyAccessibilityLabel(accessibilityLabel, hasData, emptyLabel)}
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
          axisOptions={axisOptions}
        >
          {({ points, chartBounds }) => (
            <HorizontalStackedBar
              points={resolvedSeries.map(({ key }) => points[key])}
              chartBounds={chartBounds}
              colors={colors}
              innerPadding={innerPadding}
              barWidth={barWidth}
              animate={animation}
            />
          )}
        </CartesianChart>
      ) : (
        <EmptyChartState label={emptyLabel} color={theme.labelColor} render={renderEmpty} />
      )}
    </View>
  );
}

// React.memo erases generic parameters; retain the original JSX key inference.
export const HorizontalStackedBarChart = memo(
  HorizontalStackedBarChartComponent,
) as unknown as typeof HorizontalStackedBarChartComponent;
