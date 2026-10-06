import { Fragment, memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarGroup, CartesianChart, Line } from 'victory-native';
import type { ComboChartProps } from '@/cartesian/types';
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

function ComboChartComponent<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  barSeries,
  lineSeries,
  axes,
  renderOverlay,
  theme: themeOverride,
  height = 240,
  padding = 16,
  groupPadding = 0.25,
  barPadding = 0.1,
  cornerRadius = 6,
  curve = 'natural',
  connectMissingData = false,
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: ComboChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const axisOptions = useChartAxisOptions(axes, theme);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey>([...barSeries, ...lineSeries], theme),
    [barSeries, lineSeries, theme],
  );
  const resolvedBarSeries = useMemo(
    () => resolvedSeries.slice(0, barSeries.length),
    [resolvedSeries, barSeries.length],
  );
  const resolvedLineSeries = useMemo(
    () => resolvedSeries.slice(barSeries.length),
    [resolvedSeries, barSeries.length],
  );
  const yKeys = useMemo(
    () => [...barSeries, ...lineSeries].map(({ key }) => key),
    [barSeries, lineSeries],
  );
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys),
    [data, xKey, yKeys],
  );
  const axisLabels = useChartOverlay(axes, theme, padding, chartData, xKey, yKeys, renderOverlay);

  const roundedCorners = useMemo(
    () => ({
      topLeft: cornerRadius,
      topRight: cornerRadius,
      bottomLeft: cornerRadius,
      bottomRight: cornerRadius,
    }),
    [cornerRadius],
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
          padding={axisLabels.padding}
          axisOptions={axisOptions}
          onScaleChange={axisLabels.onScaleChange}
        >
          {({ points, chartBounds }) => (
            <>
              <BarGroup
                chartBounds={chartBounds}
                betweenGroupPadding={groupPadding}
                withinGroupPadding={barPadding}
                roundedCorners={roundedCorners}
              >
                {resolvedBarSeries.map((item) => (
                  <BarGroup.Bar
                    key={String(item.key)}
                    points={points[item.key]}
                    color={item.color}
                    animate={animation}
                  />
                ))}
              </BarGroup>
              {resolvedLineSeries.map((item) => (
                <Fragment key={String(item.key)}>
                  <Line
                    points={points[item.key]}
                    color={item.color}
                    strokeWidth={item.strokeWidth}
                    curveType={curve}
                    connectMissingData={connectMissingData}
                    animate={animation}
                  />
                  <SinglePointMarker points={points[item.key]} color={item.color} />
                </Fragment>
              ))}
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
export const ComboChart = memo(ComboChartComponent) as unknown as typeof ComboChartComponent;
