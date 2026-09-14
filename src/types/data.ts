export type ChartDatum = Record<string, unknown>;

export type ChartXKey<TDatum extends ChartDatum> = Extract<
  keyof {
    [TKey in keyof TDatum as TDatum[TKey] extends string | number ? TKey : never]: TDatum[TKey];
  },
  string
>;

export type ChartYKey<TDatum extends ChartDatum> = Extract<
  keyof {
    [TKey in keyof TDatum as TDatum[TKey] extends number | null | undefined
      ? TKey
      : never]: TDatum[TKey];
  },
  string
>;

export interface ChartSeries<
  TDatum extends ChartDatum,
  TYKey extends ChartYKey<TDatum> = ChartYKey<TDatum>,
> {
  key: TYKey;
  label?: string;
  color?: string;
  strokeWidth?: number;
}
