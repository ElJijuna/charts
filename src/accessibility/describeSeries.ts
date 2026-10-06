import type { ChartDatum, ChartXKey, ChartYKey } from '@/types/data';

export interface DescribeSeriesOptions<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
> {
  xKey: TXKey;
  yKey: TYKey;
  /** Formats each X value, e.g. a localized day name. Defaults to `String`. */
  formatX?: (value: TDatum[TXKey]) => string;
  /** Formats each Y value, e.g. with `Intl.NumberFormat`. Defaults to `String`. */
  formatY?: (value: number) => string;
  /** Joins an X value to its Y value. Defaults to `', '`. */
  valueSeparator?: string;
  /** Joins consecutive points. Defaults to `', '`. */
  pointSeparator?: string;
}

/**
 * Describes one series as text for screen readers, such as "Mon, 40, Tue, 70", to append to
 * a chart's `accessibilityLabel`. Points the chart cannot plot are skipped, and numeric X
 * values are read in ascending order, matching the drawn chart. No text is added beyond the
 * formatted values and separators, so the result follows the app's language.
 */
export function describeSeries<
  TDatum extends ChartDatum,
  TXKey extends ChartXKey<TDatum>,
  TYKey extends ChartYKey<TDatum>,
>(data: readonly TDatum[], options: DescribeSeriesOptions<TDatum, TXKey, TYKey>): string {
  const {
    xKey,
    yKey,
    formatX = String,
    formatY = String,
    valueSeparator = ', ',
    pointSeparator = ', ',
  } = options;
  const points: { x: TDatum[TXKey]; y: number }[] = [];

  for (const item of data) {
    if (item === null || typeof item !== 'object') {
      continue;
    }
    const x = item[xKey];
    const y = item[yKey];
    const validX = typeof x === 'string' || (typeof x === 'number' && Number.isFinite(x));
    if (validX && typeof y === 'number' && Number.isFinite(y)) {
      points.push({ x, y });
    }
  }

  // Victory sorts numeric X data before drawing; read points in the same order.
  if (points.every(({ x }) => typeof x === 'number')) {
    points.sort((a, b) => Number(a.x) - Number(b.x));
  }

  return points
    .map(({ x, y }) => `${formatX(x)}${valueSeparator}${formatY(y)}`)
    .join(pointSeparator);
}
