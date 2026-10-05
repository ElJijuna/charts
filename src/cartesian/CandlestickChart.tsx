import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Candlestick, CartesianChart } from 'victory-native';

import { EmptyChartState } from '../core/EmptyChartState';
import { prepareCartesianData } from '../core/prepareCartesianData';
import { resolveChartTheme } from '../theme/resolveTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '../types/data';
import type { CandlestickChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function CandlestickChart<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  openKey,
  highKey,
  lowKey,
  closeKey,
  axes,
  theme: themeOverride,
  colors,
  height = 240,
  padding = 16,
  candleWidth,
  candleRatio = 0.6,
  minBodyHeight = 1,
  wickStrokeWidth = 1,
  animate = true,
  style,
  accessibilityLabel = 'Candlestick chart',
  testID,
}: CandlestickChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const yKeys = useMemo(
    () => [openKey, highKey, lowKey, closeKey] as TYKey[],
    [openKey, highKey, lowKey, closeKey],
  );
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys, yKeys),
    [data, xKey, yKeys],
  );
  const candleColors = useMemo(
    () => ({
      positive: colors?.positive ?? theme.colors[2] ?? '#386a20',
      negative: colors?.negative ?? theme.colors[3] ?? '#ba1a1a',
      neutral: colors?.neutral ?? theme.axisColor,
    }),
    [colors, theme],
  );

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
          axisOptions={{
            tickCount: { x: axes?.x?.tickCount ?? 5, y: axes?.y?.tickCount ?? 5 },
            formatXLabel: axes?.x?.formatLabel,
            formatYLabel: axes?.y?.formatLabel,
            axisSide: { x: 'bottom', y: 'left' },
            lineColor: axes?.x?.lineColor ?? axes?.y?.lineColor ?? theme.axisColor,
            labelColor: axes?.x?.labelColor ?? axes?.y?.labelColor ?? theme.labelColor,
          }}
        >
          {({ points, chartBounds }) => (
            <Candlestick
              openPoints={points[openKey]}
              highPoints={points[highKey]}
              lowPoints={points[lowKey]}
              closePoints={points[closeKey]}
              chartBounds={chartBounds}
              candleColors={candleColors}
              candleWidth={candleWidth}
              candleRatio={candleRatio}
              minBodyHeight={minBodyHeight}
              wickStrokeWidth={wickStrokeWidth}
              animate={animate ? { type: 'timing', duration: 300 } : undefined}
            />
          )}
        </CartesianChart>
      ) : (
        <EmptyChartState />
      )}
    </View>
  );
}
