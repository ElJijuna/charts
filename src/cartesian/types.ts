import type { SkFont } from '@shopify/react-native-skia';
import type { StyleProp, ViewStyle } from 'react-native';
import type { CurveType, ScatterShape } from 'victory-native';
import type { ChartThemeOverride } from '@/theme/types';
import type { ChartDatum, ChartSeries, ChartXKey, ChartYKey } from '@/types/data';

export interface ChartAxisConfig<TValue = unknown> {
  tickCount?: number;
  formatLabel?: (value: TValue) => string;
  lineColor?: string;
  labelColor?: string;
}

export interface ChartAxesConfig {
  /** Skia font for tick labels, e.g. from `useFont`. Victory skips labels without one. */
  font?: SkFont | null;
  x?: ChartAxisConfig;
  y?: ChartAxisConfig;
}

export interface LineChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly ChartSeries<TDatum, TYKey>[];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface BarChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly ChartSeries<TDatum, TYKey>[];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  groupPadding?: number;
  barPadding?: number;
  cornerRadius?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface AreaChartSeries<
  TDatum extends ChartDatum,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> extends ChartSeries<TDatum, TYKey> {
  fillOpacity?: number;
}

export interface AreaChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly AreaChartSeries<TDatum, TYKey>[];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface ScatterChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly ChartSeries<TDatum, TYKey>[];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  radius?: number;
  shape?: ScatterShape;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface StackedBarChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly ChartSeries<TDatum, TYKey>[];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  innerPadding?: number;
  barWidth?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface StackedAreaChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly AreaChartSeries<TDatum, TYKey>[];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  curve?: CurveType;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface CandlestickChartColors {
  positive?: string;
  negative?: string;
  neutral?: string;
}

export interface CandlestickChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  openKey: TYKey;
  highKey: TYKey;
  lowKey: TYKey;
  closeKey: TYKey;
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  colors?: CandlestickChartColors;
  height?: number;
  padding?: number;
  candleWidth?: number;
  candleRatio?: number;
  minBodyHeight?: number;
  wickStrokeWidth?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export type HorizontalBarChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> = BarChartProps<TDatum, TXKey, TYKey>;

export type HorizontalStackedBarChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> = StackedBarChartProps<TDatum, TXKey, TYKey>;

export interface AreaRangeChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  lowerKey: TYKey;
  upperKey: TYKey;
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  color?: string;
  opacity?: number;
  height?: number;
  padding?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface ComboChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  barSeries: readonly ChartSeries<TDatum, TYKey>[];
  lineSeries: readonly ChartSeries<TDatum, TYKey>[];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  groupPadding?: number;
  barPadding?: number;
  cornerRadius?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface SparklineChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly ChartSeries<TDatum, TYKey>[];
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface HistogramChartProps {
  values: readonly number[];
  binCount?: number;
  domain?: readonly [number, number];
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  color?: string;
  height?: number;
  padding?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface BubbleChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  yKey: TYKey;
  sizeKey: TYKey;
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  color?: string;
  minRadius?: number;
  maxRadius?: number;
  shape?: ScatterShape;
  height?: number;
  padding?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface LollipopChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  yKey: TYKey;
  axes?: ChartAxesConfig;
  theme?: ChartThemeOverride;
  color?: string;
  stemWidth?: number;
  radius?: number;
  shape?: ScatterShape;
  height?: number;
  padding?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}
