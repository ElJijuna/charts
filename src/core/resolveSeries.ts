import type { ChartTheme } from '@/theme/types';
import type { ChartDatum, ChartSeries, ChartYKey } from '@/types/data';

export type ResolvedChartSeries<
  TDatum extends ChartDatum,
  TYKey extends ChartYKey<TDatum>,
  TSeries extends ChartSeries<TDatum, TYKey> = ChartSeries<TDatum, TYKey>,
> = TSeries & {
  color: string;
  strokeWidth: number;
};

export function resolveSeries<
  TDatum extends ChartDatum,
  TYKey extends ChartYKey<TDatum>,
  TSeries extends ChartSeries<TDatum, TYKey> = ChartSeries<TDatum, TYKey>,
>(
  series: readonly TSeries[],
  theme: ChartTheme,
): readonly ResolvedChartSeries<TDatum, TYKey, TSeries>[] {
  return series.map((item, index) => ({
    ...item,
    color: item.color ?? theme.colors[index % theme.colors.length] ?? '#6750a4',
    strokeWidth: item.strokeWidth ?? theme.strokeWidth,
  }));
}
