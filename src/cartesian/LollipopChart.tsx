import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bar, CartesianChart, Scatter } from 'victory-native';
import type { LollipopChartProps } from '@/cartesian/types';
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

function LollipopChartComponent<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>({
  data,
  xKey,
  yKey,
  axes,
  theme: themeOverride,
  color,
  stemWidth = 3,
  radius = 6,
  shape = 'circle',
  height = 240,
  padding = 16,
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: LollipopChartProps<TDatum, TXKey, TYKey>): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const axisOptions = useChartAxisOptions(axes, theme);
  const yKeys = useMemo(() => [yKey], [yKey]);
  const { data: chartData, hasData } = useMemo(
    () => prepareCartesianData(data, xKey, yKeys),
    [data, xKey, yKeys],
  );
  const resolvedColor = color ?? theme.colors[0] ?? '#6750a4';

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
          {({ points, chartBounds }) => (
            <>
              <Bar
                points={points[yKey]}
                chartBounds={chartBounds}
                barWidth={stemWidth}
                color={resolvedColor}
                animate={animation}
              />
              <Scatter
                points={points[yKey]}
                color={resolvedColor}
                radius={radius}
                shape={shape}
                animate={animation}
              />
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
export const LollipopChart = memo(
  LollipopChartComponent,
) as unknown as typeof LollipopChartComponent;
