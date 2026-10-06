import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarGroup, CartesianChart } from 'victory-native';
import type { BarChartProps } from '@/cartesian/types';
import { EmptyChartState, emptyAccessibilityLabel } from '@/core/EmptyChartState';
import { useNativeAxisLabels } from '@/core/NativeAxisLabels';
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

function BarChartComponent<
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
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: BarChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const axisOptions = useChartAxisOptions(axes, theme);
  const resolvedSeries = useMemo(
    () => resolveSeries<TDatum, TYKey>(series, theme),
    [series, theme],
  );
  const yKeys = useMemo(() => series.map(({ key }) => key), [series]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys),
    [data, xKey, yKeys],
  );
  const axisLabels = useNativeAxisLabels(axes, theme, padding, chartData, xKey);

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
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={groupPadding}
              withinGroupPadding={barPadding}
              roundedCorners={roundedCorners}
            >
              {resolvedSeries.map((item) => (
                <BarGroup.Bar
                  key={String(item.key)}
                  points={points[item.key]}
                  color={item.color}
                  animate={animation}
                />
              ))}
            </BarGroup>
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
export const BarChart = memo(BarChartComponent) as unknown as typeof BarChartComponent;
