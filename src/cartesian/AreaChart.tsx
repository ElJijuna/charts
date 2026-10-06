import { Fragment, memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Area, CartesianChart } from 'victory-native';
import type { AreaChartProps, AreaChartSeries } from '@/cartesian/types';
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

function AreaChartComponent<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  series,
  axes,
  renderOverlay,
  theme: themeOverride,
  height = 240,
  padding = 16,
  curve = 'natural',
  connectMissingData = false,
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: AreaChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const axisOptions = useChartAxisOptions(axes, theme);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey, AreaChartSeries<TDatum, TYKey>>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => series.map(({ key }) => key), [series]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys),
    [data, xKey, yKeys],
  );
  const axisLabels = useChartOverlay(axes, theme, padding, chartData, xKey, yKeys, renderOverlay);

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
              {resolvedSeries.map((item) => (
                <Fragment key={String(item.key)}>
                  <Area
                    points={points[item.key]}
                    y0={chartBounds.bottom}
                    color={item.color}
                    opacity={item.fillOpacity ?? 0.24}
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
export const AreaChart = memo(AreaChartComponent) as unknown as typeof AreaChartComponent;
