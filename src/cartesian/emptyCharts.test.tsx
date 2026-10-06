import { render } from '@testing-library/react-native';
import {
  AreaChart,
  AreaRangeChart,
  BarChart,
  BubbleChart,
  CandlestickChart,
  ComboChart,
  HorizontalBarChart,
  HorizontalStackedBarChart,
  LineChart,
  LollipopChart,
  ScatterChart,
  SparklineChart,
  StackedAreaChart,
  StackedBarChart,
} from '@/index';

const mockCartesian = jest.fn(() => null);
jest.mock('victory-native', () => ({ CartesianChart: () => mockCartesian() }));

type Sample = { x: number; y: number; size: number };
const cases = [
  [
    'Line',
    (data: Sample[]) => (
      <LineChart
        accessibilityLabel="Line chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Area',
    (data: Sample[]) => (
      <AreaChart
        accessibilityLabel="Area chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Bar',
    (data: Sample[]) => (
      <BarChart
        accessibilityLabel="Bar chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Horizontal bar',
    (data: Sample[]) => (
      <HorizontalBarChart
        accessibilityLabel="Horizontal bar chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Stacked bar',
    (data: Sample[]) => (
      <StackedBarChart
        accessibilityLabel="Stacked bar chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Horizontal stacked bar',
    (data: Sample[]) => (
      <HorizontalStackedBarChart
        accessibilityLabel="Horizontal stacked bar chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Stacked area',
    (data: Sample[]) => (
      <StackedAreaChart
        accessibilityLabel="Stacked area chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Area range',
    (data: Sample[]) => (
      <AreaRangeChart
        accessibilityLabel="Area range chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        lowerKey="y"
        upperKey="size"
      />
    ),
  ],
  [
    'Bubble',
    (data: Sample[]) => (
      <BubbleChart
        accessibilityLabel="Bubble chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        yKey="y"
        sizeKey="size"
      />
    ),
  ],
  [
    'Candlestick',
    (data: Sample[]) => (
      <CandlestickChart
        accessibilityLabel="Candlestick chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        openKey="y"
        closeKey="y"
        lowKey="y"
        highKey="size"
      />
    ),
  ],
  [
    'Combo',
    (data: Sample[]) => (
      <ComboChart
        accessibilityLabel="Combo chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        barSeries={[{ key: 'y' }]}
        lineSeries={[]}
      />
    ),
  ],
  [
    'Lollipop',
    (data: Sample[]) => (
      <LollipopChart
        accessibilityLabel="Lollipop chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        yKey="y"
      />
    ),
  ],
  [
    'Scatter',
    (data: Sample[]) => (
      <ScatterChart
        accessibilityLabel="Scatter chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
  [
    'Sparkline',
    (data: Sample[]) => (
      <SparklineChart
        accessibilityLabel="Sparkline chart"
        emptyLabel="No data"
        data={data}
        xKey="x"
        series={[{ key: 'y' }]}
      />
    ),
  ],
] as const;

describe.each(cases)('%s chart without usable samples', (_, chart) => {
  beforeEach(() => mockCartesian.mockClear());

  it.each([
    ['empty', []],
    ['invalid X', [{ x: Number.NaN, y: 1, size: 2 }]],
    ['invalid Y', [{ x: 1, y: Number.NaN, size: Number.NaN }]],
  ] satisfies [string, Sample[]][])(
    'announces %s data and avoids mounting Victory',
    async (_, data) => {
      const screen = await render(chart(data));
      expect(screen.getByText('No data')).toBeTruthy();
      expect(screen.getByLabelText(/: No data$/)).toBeTruthy();
      expect(mockCartesian).not.toHaveBeenCalled();
    },
  );
});
