import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CartesianChart, Scatter } from 'victory-native';
import type { ScatterChartProps } from '@/cartesian/types';
import { EmptyChartState, emptyAccessibilityLabel } from '@/core/EmptyChartState';
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

function ScatterChartComponent<
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
  radius = 5,
  shape = 'circle',
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: ScatterChartProps<TDatum, TXKey, TYKey>): ReactElement {
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
            <>
              {resolvedSeries.map((item) => (
                <Scatter
                  key={String(item.key)}
                  points={points[item.key]}
                  color={item.color}
                  radius={radius}
                  shape={shape}
                  animate={animation}
                />
              ))}
            </>
          )}
        </CartesianChart>
      ) : (
        <EmptyChartState label={emptyLabel} color={theme.labelColor} render={renderEmpty} />
      )}
    </View>
  );
}

// React.memo erases generic parameters; retain the original JSX key inference.
export const ScatterChart = memo(ScatterChartComponent) as unknown as typeof ScatterChartComponent;
