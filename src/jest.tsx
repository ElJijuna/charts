/**
 * Jest stand-ins for `@real-native/charts`. Charts render a plain `View` that keeps
 * `accessibilityLabel`, `testID`, `height` and `style`, without loading Victory Native,
 * Skia or Reanimated.
 *
 * @packageDocumentation
 */
import type { ComponentType, ReactElement } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import type * as Charts from '@/index';

interface MockChartProps {
  accessibilityLabel: string;
  testID?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

type ChartName = {
  [TName in keyof typeof Charts]: (typeof Charts)[TName] extends
    | ComponentType<never>
    | ((props: never) => ReactElement)
    ? TName
    : never;
}[keyof typeof Charts];

function createChartMock<TName extends ChartName>(name: TName): (typeof Charts)[TName] {
  function MockChart({ accessibilityLabel, testID, height = 240, style }: MockChartProps) {
    return (
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={[{ height }, style]}
      />
    );
  }
  MockChart.displayName = name;
  return MockChart as unknown as (typeof Charts)[TName];
}

export const AreaChart = createChartMock('AreaChart');
export const AreaRangeChart = createChartMock('AreaRangeChart');
export const BarChart = createChartMock('BarChart');
export const BubbleChart = createChartMock('BubbleChart');
export const CandlestickChart = createChartMock('CandlestickChart');
export const ComboChart = createChartMock('ComboChart');
export const GaugeChart = createChartMock('GaugeChart');
export const HistogramChart = createChartMock('HistogramChart');
export const HorizontalBarChart = createChartMock('HorizontalBarChart');
export const HorizontalStackedBarChart = createChartMock('HorizontalStackedBarChart');
export const LineChart = createChartMock('LineChart');
export const LollipopChart = createChartMock('LollipopChart');
export const PieChart = createChartMock('PieChart');
export const ScatterChart = createChartMock('ScatterChart');
export const SparklineChart = createChartMock('SparklineChart');
export const StackedAreaChart = createChartMock('StackedAreaChart');
export const StackedBarChart = createChartMock('StackedBarChart');

// These have no renderer dependencies, so tests get the real implementations.
export { describeSeries } from '@/accessibility/describeSeries';
export { useChartPointSelection } from '@/interaction/useChartPointSelection';
export { defaultChartTheme } from '@/theme/defaultTheme';
