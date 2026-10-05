import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Candlestick, CartesianChart } from 'victory-native';
import type { CandlestickChartProps } from '@/cartesian/types';
import { chartAnimation } from '@/core/chartAnimation';
import { EmptyChartState } from '@/core/EmptyChartState';
import { prepareCartesianData } from '@/core/prepareCartesianData';
import { useChartAxisOptions } from '@/core/useChartAxisOptions';
import { useChartTheme } from '@/theme/useChartTheme';
import type { ChartDatum, ChartXKey, ChartYKey } from '@/types/data';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

function CandlestickChartComponent<
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
  const theme = useChartTheme(themeOverride);
  const axisOptions = useChartAxisOptions(axes, theme);
  const yKeys = useMemo(
    () => [openKey, highKey, lowKey, closeKey] as TYKey[],
    [openKey, highKey, lowKey, closeKey],
  );
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys, yKeys),
    [data, xKey, yKeys],
  );
  const positive = colors?.positive ?? theme.colors[2] ?? '#386a20';
  const negative = colors?.negative ?? theme.colors[3] ?? '#ba1a1a';
  const neutral = colors?.neutral ?? theme.axisColor;
  const candleColors = useMemo(
    () => ({ positive, negative, neutral }),
    [positive, negative, neutral],
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
          axisOptions={axisOptions}
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
              animate={animate ? chartAnimation : undefined}
            />
          )}
        </CartesianChart>
      ) : (
        <EmptyChartState />
      )}
    </View>
  );
}

// React.memo erases generic parameters; retain the original JSX key inference.
export const CandlestickChart = memo(
  CandlestickChartComponent,
) as unknown as typeof CandlestickChartComponent;
