import type { ChartTheme } from '../theme/types';
import type { ChartDatum, ChartSeries, ChartYKey } from '../types/data';

export interface ResolvedChartSeries<TDatum extends ChartDatum, TYKey extends ChartYKey<TDatum>>
  extends ChartSeries<TDatum, TYKey> {
  color: string;
  strokeWidth: number;
}

export function resolveSeries<TDatum extends ChartDatum, TYKey extends ChartYKey<TDatum>>(
  series: readonly ChartSeries<TDatum, TYKey>[],
  theme: ChartTheme,
): readonly ResolvedChartSeries<TDatum, TYKey>[] {
  return series.map((item, index) => ({
    ...item,
    color: item.color ?? theme.colors[index % theme.colors.length] ?? '#6750a4',
    strokeWidth: item.strokeWidth ?? theme.strokeWidth,
  }));
}
