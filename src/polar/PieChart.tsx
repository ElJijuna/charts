import { type ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';

import { resolveChartTheme } from '../theme/resolveTheme';
import type { PieChartProps } from './types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    minHeight: 1,
  },
});

export function PieChart({
  data,
  theme: themeOverride,
  height = 240,
  innerRadius = 0,
  startAngle = 0,
  circleSweepDegrees = 360,
  animate = true,
  style,
  accessibilityLabel = 'Pie chart',
  testID,
}: PieChartProps): ReactElement {
  const theme = useMemo(() => resolveChartTheme(themeOverride), [themeOverride]);
  const chartData = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        color: item.color ?? theme.colors[index % theme.colors.length] ?? '#6750a4',
      })),
    [data, theme],
  );

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.root, { height, backgroundColor: theme.backgroundColor }, style]}
      testID={testID}
    >
      <PolarChart data={chartData} labelKey="label" valueKey="value" colorKey="color">
        <Pie.Chart
          innerRadius={innerRadius}
          startAngle={startAngle}
          circleSweepDegrees={circleSweepDegrees}
        >
          {() => <Pie.Slice animate={animate ? { type: 'timing', duration: 300 } : undefined} />}
        </Pie.Chart>
      </PolarChart>
    </View>
  );
}
