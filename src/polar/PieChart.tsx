import { memo, type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { EmptyChartState, emptyAccessibilityLabel } from '@/core/EmptyChartState';
import { useChartAnimation } from '@/core/useChartAnimation';
import type { PieChartProps } from '@/polar/types';
import { useChartTheme } from '@/theme/useChartTheme';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

function PieChartComponent({
  data,
  theme: themeOverride,
  height = 240,
  innerRadius = 0,
  startAngle = 0,
  circleSweepDegrees = 360,
  animate,
  style,
  accessibilityLabel,
  emptyLabel,
  renderEmpty,
  testID,
}: PieChartProps): ReactElement {
  const theme = useChartTheme(themeOverride);
  const animation = useChartAnimation(animate);
  const chartData = useMemo(() => {
    const slices = data
      .map((item, index) => ({
        ...item,
        color: item.color ?? theme.colors[index % theme.colors.length] ?? '#6750a4',
      }))
      .filter((item) => Number.isFinite(item.value) && item.value > 0);
    const total = slices.reduce((sum, item) => sum + item.value, 0);
    if (Number.isFinite(total)) {
      return slices;
    }
    // Keep proportions usable even when finite weights overflow their sum.
    const largest = slices.reduce((value, item) => Math.max(value, item.value), 0);
    return slices.map((item) => ({ ...item, value: item.value / largest }));
  }, [data, theme]);

  return (
    <View
      accessible
      accessibilityLabel={emptyAccessibilityLabel(
        accessibilityLabel,
        chartData.length > 0,
        emptyLabel,
      )}
      style={[styles.root, { height, backgroundColor: theme.backgroundColor }, style]}
      testID={testID}
    >
      {chartData.length > 0 ? (
        <PolarChart data={chartData} labelKey="label" valueKey="value" colorKey="color">
          <Pie.Chart
            innerRadius={innerRadius}
            startAngle={startAngle}
            circleSweepDegrees={circleSweepDegrees}
          >
            {() => <Pie.Slice animate={animation} />}
          </Pie.Chart>
        </PolarChart>
      ) : (
        <EmptyChartState label={emptyLabel} color={theme.labelColor} render={renderEmpty} />
      )}
    </View>
  );
}

export const PieChart = memo(PieChartComponent);
