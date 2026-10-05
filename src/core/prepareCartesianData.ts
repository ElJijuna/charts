import type { ChartDatum } from '../types/data';

/** Keep missing values as gaps; never coerce strings or invent zero values. */
export function prepareCartesianData<TDatum extends ChartDatum>(
  input: readonly TDatum[],
  xKey: keyof TDatum,
  yKeys: readonly (keyof TDatum)[],
  requiredKeys: readonly (keyof TDatum)[] = [],
) {
  const data: TDatum[] = [];
  let hasData = false;

  for (const item of input) {
    if (item === null || typeof item !== 'object') {
      continue;
    }
    const x = item[xKey];
    if (!(typeof x === 'string' || (typeof x === 'number' && Number.isFinite(x)))) {
      continue;
    }
    if (requiredKeys.some((key) => typeof item[key] !== 'number' || !Number.isFinite(item[key]))) {
      continue;
    }
    let normalized = item;
    for (const key of yKeys) {
      const value = item[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        hasData = true;
      } else if (value !== null && value !== undefined) {
        // Clone only rows that need normalization; never mutate caller data.
        if (normalized === item) {
          normalized = { ...item };
        }
        Object.assign(normalized, { [key]: null });
      }
    }
    data.push(normalized);
  }

  return { data, hasData };
}
