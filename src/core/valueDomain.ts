import type { ChartDatum } from '@/types/data';

/**
 * A value-axis domain that always includes zero, so bars grow from a real baseline and their
 * lengths stay proportional. Victory derives the domain from the data alone, which starts the
 * axis at the smallest value (a bar at that value draws empty) and, for stacks, ignores totals.
 *
 * With `stacked`, each row contributes its positive and negative totals, matching Victory's
 * separate positive and negative stacks; every running total of a stacked area lies between
 * them too. Returns `undefined` when there is no range, so Victory keeps its own handling of
 * empty and all-zero data.
 */
export function zeroBasedDomain<TDatum extends ChartDatum>(
  data: readonly TDatum[],
  yKeys: readonly (keyof TDatum)[],
  stacked = false,
): { y: [number, number] } | undefined {
  let lower = 0;
  let upper = 0;
  for (const row of data) {
    let positive = 0;
    let negative = 0;
    for (const key of yKeys) {
      const value = row[key];
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        continue;
      }
      if (stacked) {
        if (value > 0) {
          positive += value;
        } else {
          negative += value;
        }
      } else {
        lower = Math.min(lower, value);
        upper = Math.max(upper, value);
      }
    }
    lower = Math.min(lower, negative);
    upper = Math.max(upper, positive);
  }
  return lower < upper ? { y: [lower, upper] } : undefined;
}
