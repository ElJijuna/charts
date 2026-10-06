import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AreaRange, CartesianChart, Line } from 'victory-native';
import type { AreaRangeChartProps } from '@/cartesian/types';
import { EmptyChartState, emptyAccessibilityLabel } from '@/core/EmptyChartState';
import { useChartOverlay } from '@/core/NativeAxisLabels';
import { prepareCartesianData } from '@/core/prepareCartesianData';
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

function AreaRangeChartComponent<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  lowerKey,
  upperKey,
  axes,
  renderOverlay,
  theme: themeOverride,
  color,
  opacity = 0.24,
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
}: AreaRangeChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const axisOptions = useChartAxisOptions(axes, theme);
  const yKeys = useMemo(() => [lowerKey, upperKey] as TYKey[], [lowerKey, upperKey]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys, yKeys),
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
          {({ points }) => (
            <>
              <AreaRange
                lowerPoints={points[lowerKey]}
                upperPoints={points[upperKey]}
                color={color ?? theme.colors[0] ?? '#6750a4'}
                opacity={opacity}
                curveType={curve}
                connectMissingData={connectMissingData}
                animate={animation}
              />
              {chartData.length === 1 && (
                <Line
                  points={[...points[lowerKey], ...points[upperKey]]}
                  color={color ?? theme.colors[0] ?? '#6750a4'}
                  strokeWidth={2}
                />
              )}
              <SinglePointMarker
                points={points[lowerKey]}
                color={color ?? theme.colors[0] ?? '#6750a4'}
              />
              <SinglePointMarker
                points={points[upperKey]}
                color={color ?? theme.colors[0] ?? '#6750a4'}
              />
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
export const AreaRangeChart = memo(
  AreaRangeChartComponent,
) as unknown as typeof AreaRangeChartComponent;
