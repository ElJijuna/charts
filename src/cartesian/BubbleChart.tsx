import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, type PointsArray, Scatter } from 'victory-native';
import type { BubbleChartProps } from '@/cartesian/types';
import { EmptyChartState, emptyAccessibilityLabel } from '@/core/EmptyChartState';
import { prepareCartesianData } from '@/core/prepareCartesianData';
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

function BubbleChartComponent<
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
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: BubbleChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const axisOptions = useChartAxisOptions(axes, theme);
  const yKeys = useMemo(() => [yKey], [yKey]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys, [yKey, sizeKey]),
    [data, xKey, yKeys, yKey, sizeKey],
  );
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
      accessibilityLabel={emptyAccessibilityLabel(accessibilityLabel, hasData, emptyLabel)}
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
          {({ points }) => (
            <Scatter
              points={points[yKey]}
              color={color ?? theme.colors[0] ?? '#6750a4'}
              radius={radiusForPoint}
              shape={shape}
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
export const BubbleChart = memo(BubbleChartComponent) as unknown as typeof BubbleChartComponent;
