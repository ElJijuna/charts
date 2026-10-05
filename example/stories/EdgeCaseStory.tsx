import * as Charts from '@real-native/charts';

import type { ChartKind } from './ChartStory';

export type Scenario = 'empty' | 'single' | 'invalid' | 'constant' | 'zero';
export interface EdgeCaseStoryProps {
  kind: ChartKind;
  scenario: Scenario;
}

export function EdgeCaseStory({ kind, scenario }: EdgeCaseStoryProps) {
  const values = {
    empty: [],
    single: [12],
    invalid: [Number.NaN, Number.POSITIVE_INFINITY],
    constant: [12, 12, 12],
    zero: [0, 0, 0],
  }[scenario];
  const data = values.map((value, x) => ({ x, y: value, z: value / 2 }));
  const props = {
    data,
    xKey: 'x' as const,
    height: 160,
    animate: false,
    theme: { backgroundColor: 'transparent' },
    testID: 'edge-chart',
  };
  const series = [
    { key: 'y', color: '#6d28d9' },
    { key: 'z', color: '#0891b2' },
  ] as const;
  switch (kind) {
    case 'line':
      return <Charts.LineChart {...props} series={series} />;
    case 'area':
      return <Charts.AreaChart {...props} series={series} />;
    case 'bar':
      return <Charts.BarChart {...props} series={series} />;
    case 'horizontal-bar':
      return <Charts.HorizontalBarChart {...props} series={series} />;
    case 'horizontal-stacked-bar':
      return <Charts.HorizontalStackedBarChart {...props} series={series} />;
    case 'stacked-bar':
      return <Charts.StackedBarChart {...props} series={series} />;
    case 'stacked-area':
      return <Charts.StackedAreaChart {...props} series={series} />;
    case 'area-range':
      return <Charts.AreaRangeChart {...props} lowerKey="z" upperKey="y" />;
    case 'scatter':
      return <Charts.ScatterChart {...props} series={series} />;
    case 'bubble':
      return <Charts.BubbleChart {...props} yKey="y" sizeKey="z" />;
    case 'sparkline':
      return <Charts.SparklineChart {...props} series={series} />;
    case 'histogram':
      return (
        <Charts.HistogramChart values={values} height={160} animate={false} testID="edge-chart" />
      );
    case 'lollipop':
      return <Charts.LollipopChart {...props} yKey="y" />;
    case 'candlestick':
      return <Charts.CandlestickChart {...props} openKey="y" highKey="y" lowKey="z" closeKey="y" />;
    case 'combo':
      return <Charts.ComboChart {...props} barSeries={[series[0]]} lineSeries={[series[1]]} />;
    case 'pie':
      return (
        <Charts.PieChart
          height={160}
          animate={false}
          testID="edge-chart"
          data={values.map((value, i) => ({ label: String(i), value }))}
        />
      );
    case 'gauge':
      return (
        <Charts.GaugeChart
          height={160}
          animate={false}
          testID="edge-chart"
          value={values[0] ?? Number.NaN}
        />
      );
  }
}
