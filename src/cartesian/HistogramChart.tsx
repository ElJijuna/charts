import { type ReactElement, useMemo } from 'react';

import { BarChart } from './BarChart';
import type { HistogramChartProps } from './types';

interface HistogramBin extends Record<string, unknown> {
  bin: number;
  count: number;
}

function createHistogramBins(
  values: readonly number[],
  requestedBinCount: number,
  domain?: readonly [number, number],
): HistogramBin[] {
  const finiteValues = values.filter(Number.isFinite);
  const binCount = Number.isFinite(requestedBinCount)
    ? Math.max(1, Math.min(1_000, Math.floor(requestedBinCount)))
    : 10;
  const safeDomain = domain?.every(Number.isFinite) ? domain : undefined;

  if (finiteValues.length === 0 && !safeDomain) {
    return [];
  }

  let dataMin = Number.POSITIVE_INFINITY;
  let dataMax = Number.NEGATIVE_INFINITY;
  for (const value of finiteValues) {
    dataMin = Math.min(dataMin, value);
    dataMax = Math.max(dataMax, value);
  }
  const first = safeDomain?.[0] ?? dataMin;
  const second = safeDomain?.[1] ?? dataMax;
  const minimum = Math.min(first, second);
  const maximum = Math.max(first, second);
  const valuesInDomain = finiteValues.filter((value) => value >= minimum && value <= maximum);

  if (minimum === maximum) {
    return [{ bin: minimum, count: valuesInDomain.length }];
  }

  const bins = Array.from({ length: binCount }, (_, index) => ({
    bin: minimum * (1 - (index + 0.5) / binCount) + maximum * ((index + 0.5) / binCount),
    count: 0,
  }));

  const span = maximum - minimum;
  for (const value of valuesInDomain) {
    const ratio = Number.isFinite(span)
      ? (value - minimum) / span
      : (value / 2 - minimum / 2) / (maximum / 2 - minimum / 2);
    const index = Math.min(Math.floor(ratio * binCount), binCount - 1);
    const bin = bins[index];
    if (bin) {
      bin.count += 1;
    }
  }

  return bins;
}

export function HistogramChart({
  values,
  binCount = 10,
  domain,
  axes,
  theme,
  color,
  height = 240,
  padding = 16,
  animate = true,
  style,
  accessibilityLabel = 'Histogram chart',
  testID,
}: HistogramChartProps): ReactElement {
  const data = useMemo(
    () => createHistogramBins(values, binCount, domain),
    [values, binCount, domain],
  );

  return (
    <BarChart
      data={data}
      xKey="bin"
      series={[{ key: 'count', color }]}
      axes={axes}
      theme={theme}
      height={height}
      padding={padding}
      groupPadding={0}
      barPadding={0}
      cornerRadius={0}
      animate={animate}
      style={style}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}
