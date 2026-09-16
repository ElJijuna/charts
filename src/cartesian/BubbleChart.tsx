import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, type PointsArray, Scatter } from 'victory-native';

import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { BubbleChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function BubbleChart<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  yKey,
  sizeKey,
  axes,
  theme: themeOverride,
  color,
  minRadius = 4,
  maxRadius = 18,
  shape = 'circle',
  height = 240,
  padding = 16,
  animate = true,
  style,
  accessibilityLabel = 'Bubble chart',
  testID,
}: BubbleChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const chartData = useMemo(() => [...data], [data]);
  const radiusForPoint = useMemo(() => {
    const lowerRadius = Math.min(minRadius, maxRadius);
    const upperRadius = Math.max(minRadius, maxRadius);
    const sizes: number[] = [];
    for (const item of data) {
      const size = item[sizeKey];
      if (typeof size === 'number' && Number.isFinite(size)) {
        sizes.push(size);
      }
    }
    const minimumSize = sizes.length > 0 ? Math.min(...sizes) : 0;
    const maximumSize = sizes.length > 0 ? Math.max(...sizes) : 0;
    const radiusByX = new Map<string | number, number>();

    for (const item of data) {
      const xValue = item[xKey];
      const size = item[sizeKey];
      const ratio =
        typeof size === 'number' && Number.isFinite(size) && maximumSize !== minimumSize
          ? (size - minimumSize) / (maximumSize - minimumSize)
          : 0.5;
      radiusByX.set(xValue as string | number, lowerRadius + ratio * (upperRadius - lowerRadius));
    }

    return (point: PointsArray[number]) => radiusByX.get(point.xValue) ?? lowerRadius;
  }, [data, maxRadius, minRadius, sizeKey, xKey]);

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
        yKeys={[yKey]}
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
          <Scatter
            points={points[yKey]}
            color={color ?? theme.colors[0] ?? '#6750a4'}
            radius={radiusForPoint}
            shape={shape}
            animate={animate ? { type: 'timing', duration: 300 } : undefined}
          />
        )}
      </CartesianChart>
    </View>
  );
}
