import type { StyleProp, ViewStyle } from 'react-native';

import type { ChartThemeOverride } from '../theme/types';

export interface PieChartDatum {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: readonly PieChartDatum[];
  theme?: ChartThemeOverride;
  height?: number;
  innerRadius?: number | string;
  startAngle?: number;
  circleSweepDegrees?: number;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}
