import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, StackedArea } from 'victory-native';
import type { AreaChartSeries, StackedAreaChartProps } from '@/cartesian/types';
import { EmptyChartState, emptyAccessibilityLabel } from '@/core/EmptyChartState';
import { useChartOverlay } from '@/core/NativeAxisLabels';
import { prepareCartesianData } from '@/core/prepareCartesianData';
import { resolveSeries } from '@/core/resolveSeries';
import { SinglePointMarker } from '@/core/SinglePointMarker';
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

function StackedAreaChartComponent<
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
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: StackedAreaChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const axisOptions = useChartAxisOptions(axes, theme);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey, AreaChartSeries<TDatum, TYKey>>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => series.map(({ key }) => key), [series]);
  const colors = useMemo(() => resolvedSeries.map(({ color }) => color), [resolvedSeries]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys),
    [data, xKey, yKeys],
  );
  const axisLabels = useChartOverlay(axes, theme, padding, chartData, xKey);
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
      accessibilityLabel={emptyAccessibilityLabel(accessibilityLabel, hasData, emptyLabel)}
      style={[styles.root, { height, backgroundColor: theme.backgroundColor }, style]}
      testID={testID}
    >
      {hasData ? (
        <CartesianChart<TDatum, TXKey, TYKey>
          data={chartData}
          xKey={xKey}
          yKeys={yKeys}
          padding={axisLabels.padding}
          domain={singleDomain}
          axisOptions={axisOptions}
          onScaleChange={axisLabels.onScaleChange}
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
                animate={animation}
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
        <EmptyChartState label={emptyLabel} color={theme.labelColor} render={renderEmpty} />
      )}
      {hasData ? axisLabels.overlay : null}
    </View>
  );
}

// React.memo erases generic parameters; retain the original JSX key inference.
export const StackedAreaChart = memo(
  StackedAreaChartComponent,
) as unknown as typeof StackedAreaChartComponent;
