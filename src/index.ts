/**
 * `@real-native/charts` provides friendly, customizable React Native charts
 * powered by Victory Native, Skia and Reanimated.
 *
 * @packageDocumentation
 */

export {
  type DescribeSeriesOptions,
  describeSeries,
} from '@/accessibility/describeSeries';
export { AreaChart } from '@/cartesian/AreaChart';
export { AreaRangeChart } from '@/cartesian/AreaRangeChart';
export { BarChart } from '@/cartesian/BarChart';
export { BubbleChart } from '@/cartesian/BubbleChart';
export { CandlestickChart } from '@/cartesian/CandlestickChart';
export { ComboChart } from '@/cartesian/ComboChart';
export { HistogramChart } from '@/cartesian/HistogramChart';
export { HorizontalBarChart } from '@/cartesian/HorizontalBarChart';
export { HorizontalStackedBarChart } from '@/cartesian/HorizontalStackedBarChart';
export { LineChart } from '@/cartesian/LineChart';
export { LollipopChart } from '@/cartesian/LollipopChart';
export { ScatterChart } from '@/cartesian/ScatterChart';
export { SparklineChart } from '@/cartesian/SparklineChart';
export { StackedAreaChart } from '@/cartesian/StackedAreaChart';
export { StackedBarChart } from '@/cartesian/StackedBarChart';
export type {
  AreaChartProps,
  AreaChartSeries,
  AreaRangeChartProps,
  BarChartProps,
  BubbleChartProps,
  CandlestickChartColors,
  CandlestickChartProps,
  ChartAxesConfig,
  ChartAxisConfig,
  ChartPoint,
  ChartPointsLayout,
  ComboChartProps,
  HistogramChartProps,
  HorizontalBarChartProps,
  HorizontalChartAxesConfig,
  HorizontalStackedBarChartProps,
  LineChartProps,
  LollipopChartProps,
  ScatterChartProps,
  SparklineChartProps,
  StackedAreaChartProps,
  StackedBarChartProps,
} from '@/cartesian/types';
export { useChartPointSelection } from '@/interaction/useChartPointSelection';
export { GaugeChart } from '@/polar/GaugeChart';
export { PieChart } from '@/polar/PieChart';
export type { GaugeChartProps, PieChartDatum, PieChartProps } from '@/polar/types';
export { defaultChartTheme } from '@/theme/defaultTheme';
export type { ChartTheme, ChartThemeOverride } from '@/theme/types';
export type { ChartDatum, ChartSeries, ChartXKey, ChartYKey } from '@/types/data';
