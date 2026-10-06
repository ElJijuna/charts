import type { DataSourceParam, SkFont } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
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
  /** Font file loaded with `useFont` when `font` is not given, e.g. `require('./Inter.ttf')`. */
  fontSource?: DataSourceParam;
  /** Size for `fontSource`. Defaults to 12. */
  fontSize?: number;
  /**
   * `canvas` (default) draws tick labels with Skia and needs a font. `native` draws them
   * as React Native `Text` around the plot instead, so no font is loaded.
   */
  labelMode?: 'canvas' | 'native';
  /** Text style for `native` labels. */
  labelStyle?: StyleProp<TextStyle>;
  /** Space reserved for `native` labels below the plot (`x`, default 20) and left of it (`y`, default 40). */
  labelSpace?: { x?: number; y?: number };
  /** Set to `false` to hide grid lines while keeping the frame and labels. */
  grid?: boolean;
  x?: ChartAxisConfig;
  y?: ChartAxisConfig;
}

// Horizontal charts swap their axes inside Victory; native labels support vertical charts only.
export type HorizontalChartAxesConfig = Omit<
  ChartAxesConfig,
  'labelMode' | 'labelStyle' | 'labelSpace'
>;

export interface LineChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  series: readonly ChartSeries<TDatum, TYKey>[];
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  groupPadding?: number;
  barPadding?: number;
  cornerRadius?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  radius?: number;
  shape?: ScatterShape;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  innerPadding?: number;
  barWidth?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  height?: number;
  padding?: number;
  curve?: CurveType;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
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
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
  testID?: string;
}

export type HorizontalBarChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> = Omit<BarChartProps<TDatum, TXKey, TYKey>, 'axes'> & {
  axes?: HorizontalChartAxesConfig | false;
};

export type HorizontalStackedBarChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> = Omit<StackedBarChartProps<TDatum, TXKey, TYKey>, 'axes'> & {
  axes?: HorizontalChartAxesConfig | false;
};

export interface AreaRangeChartProps<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum> = ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  data: readonly TDatum[];
  xKey: TXKey;
  lowerKey: TYKey;
  upperKey: TYKey;
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  color?: string;
  opacity?: number;
  height?: number;
  padding?: number;
  curve?: CurveType;
  connectMissingData?: boolean;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
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
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
  testID?: string;
}

export interface HistogramChartProps {
  values: readonly number[];
  binCount?: number;
  domain?: readonly [number, number];
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  color?: string;
  height?: number;
  padding?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  color?: string;
  minRadius?: number;
  maxRadius?: number;
  shape?: ScatterShape;
  height?: number;
  padding?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
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
  /** Axis configuration, or `false` to hide axes, grid lines and labels. */
  axes?: ChartAxesConfig | false;
  theme?: ChartThemeOverride;
  color?: string;
  stemWidth?: number;
  radius?: number;
  shape?: ScatterShape;
  height?: number;
  padding?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  /** Text shown and announced when there is no data. Nothing is shown when omitted. */
  emptyLabel?: string;
  /** Custom empty-state content; takes precedence over `emptyLabel`. */
  renderEmpty?: () => ReactNode;
  testID?: string;
}
