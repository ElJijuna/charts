export interface ChartTheme {
  colors: readonly string[];
  axisColor: string;
  labelColor: string;
  gridColor: string;
  backgroundColor: string;
  strokeWidth: number;
}

export type ChartThemeOverride = Partial<ChartTheme>;
