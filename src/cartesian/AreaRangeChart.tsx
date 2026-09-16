import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AreaRange, CartesianChart } from 'victory-native';

import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { AreaRangeChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function AreaRangeChart<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  lowerKey,
  upperKey,
  axes,
  theme: themeOverride,
  color,
  opacity = 0.24,
  height = 240,
  padding = 16,
  curve = 'natural',
  connectMissingData = false,
  animate = true,
  style,
  accessibilityLabel = 'Area range chart',
  testID,
}: AreaRangeChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const yKeys = useMemo(() => [lowerKey, upperKey] as TYKey[], [lowerKey, upperKey]);
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
        axisOptions={{
          tickCount: { x: axes?.x?.tickCount ?? 5, y: axes?.y?.tickCount ?? 5 },
          formatXLabel: axes?.x?.formatLabel,
          formatYLabel: axes?.y?.formatLabel,
          axisSide: { x: 'bottom', y: 'left' },
          lineColor: axes?.x?.lineColor ?? axes?.y?.lineColor ?? theme.axisColor,
          labelColor: axes?.x?.labelColor ?? axes?.y?.labelColor ?? theme.labelColor,
        }}
      >
        {({ points }) => (
          <AreaRange
            lowerPoints={points[lowerKey]}
            upperPoints={points[upperKey]}
            color={color ?? theme.colors[0] ?? '#6750a4'}
            opacity={opacity}
            curveType={curve}
            connectMissingData={connectMissingData}
            animate={animate ? { type: 'timing', duration: 300 } : undefined}
          />
        )}
      </CartesianChart>
    </View>
  );
}
