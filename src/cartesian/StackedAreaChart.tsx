import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, StackedArea } from 'victory-native';

import { resolveSeries } from '../core/resolveSeries';
import { EmptyChartState } from '../core/EmptyChartState';
import { prepareCartesianData } from '../core/prepareCartesianData';
import { SinglePointMarker } from '../core/SinglePointMarker';
import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { AreaChartSeries, StackedAreaChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function StackedAreaChart<
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
  curve = 'natural',
  animate = true,
  style,
  accessibilityLabel = 'Stacked area chart',
  testID,
}: StackedAreaChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey, AreaChartSeries<TDatum, TYKey>>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => resolvedSeries.map(({ key }) => key), [resolvedSeries]);
  const colors = useMemo(() => resolvedSeries.map(({ color }) => color), [resolvedSeries]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys),
    [data, xKey, yKeys],
  );
  const singleDomain = useMemo<{ y: [number, number] } | undefined>(() => {
    const [sample] = chartData;
    if (chartData.length !== 1 || !sample) {
      return undefined;
    }
    let total = 0;
    let minimum = 0;
    let maximum = 0;
    for (const key of yKeys) {
      const value = sample[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        total += value;
      }
      minimum = Math.min(minimum, total);
      maximum = Math.max(maximum, total);
    }
    const margin = Math.max(1, (maximum - minimum) * 0.05);
    const lower = minimum - margin;
    const upper = maximum + margin;
    return Number.isFinite(lower) && Number.isFinite(upper) ? { y: [lower, upper] } : undefined;
  }, [chartData, yKeys]);

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
          domain={singleDomain}
          axisOptions={{
            tickCount: { x: axes?.x?.tickCount ?? 5, y: axes?.y?.tickCount ?? 5 },
            formatXLabel: axes?.x?.formatLabel,
            formatYLabel: axes?.y?.formatLabel,
            axisSide: { x: 'bottom', y: 'left' },
            lineColor: axes?.x?.lineColor ?? axes?.y?.lineColor ?? theme.axisColor,
            labelColor: axes?.x?.labelColor ?? axes?.y?.labelColor ?? theme.labelColor,
          }}
        >
          {({ points, chartBounds, yScale }) => (
            <>
              <StackedArea
                points={resolvedSeries.map(({ key }) => points[key])}
                y0={chartBounds.bottom}
                colors={colors}
                curveType={curve}
                areaOptions={({ rowIndex }) => ({
                  opacity: resolvedSeries[rowIndex]?.fillOpacity ?? 0.5,
                })}
                animate={animate ? { type: 'timing', duration: 300 } : undefined}
              />
              {chartData.length === 1 &&
                resolvedSeries.map((item, index) => {
                  const [sample] = points[item.key];
                  if (!sample || sample.yValue === null) {
                    return null;
                  }
                  const total = resolvedSeries
                    .slice(0, index + 1)
                    .reduce((sum, seriesItem) => sum + (points[seriesItem.key][0]?.yValue ?? 0), 0);
                  return (
                    <SinglePointMarker
                      key={String(item.key)}
                      points={[{ ...sample, y: yScale(total) }]}
                      color={item.color}
                    />
                  );
                })}
            </>
          )}
        </CartesianChart>
      ) : (
        <EmptyChartState />
      )}
    </View>
  );
}
