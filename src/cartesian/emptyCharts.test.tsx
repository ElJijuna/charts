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
  ['Line', (data: Sample[]) => <LineChart data={data} xKey="x" series={[{ key: 'y' }]} />],
  ['Area', (data: Sample[]) => <AreaChart data={data} xKey="x" series={[{ key: 'y' }]} />],
  ['Bar', (data: Sample[]) => <BarChart data={data} xKey="x" series={[{ key: 'y' }]} />],
  [
    'Horizontal bar',
    (data: Sample[]) => <HorizontalBarChart data={data} xKey="x" series={[{ key: 'y' }]} />,
  ],
  [
    'Stacked bar',
    (data: Sample[]) => <StackedBarChart data={data} xKey="x" series={[{ key: 'y' }]} />,
  ],
  [
    'Horizontal stacked bar',
    (data: Sample[]) => <HorizontalStackedBarChart data={data} xKey="x" series={[{ key: 'y' }]} />,
  ],
  [
    'Stacked area',
    (data: Sample[]) => <StackedAreaChart data={data} xKey="x" series={[{ key: 'y' }]} />,
  ],
  [
    'Area range',
    (data: Sample[]) => <AreaRangeChart data={data} xKey="x" lowerKey="y" upperKey="size" />,
  ],
  ['Bubble', (data: Sample[]) => <BubbleChart data={data} xKey="x" yKey="y" sizeKey="size" />],
  [
    'Candlestick',
    (data: Sample[]) => (
      <CandlestickChart data={data} xKey="x" openKey="y" closeKey="y" lowKey="y" highKey="size" />
    ),
  ],
  [
    'Combo',
    (data: Sample[]) => (
      <ComboChart data={data} xKey="x" barSeries={[{ key: 'y' }]} lineSeries={[]} />
    ),
  ],
  ['Lollipop', (data: Sample[]) => <LollipopChart data={data} xKey="x" yKey="y" />],
  ['Scatter', (data: Sample[]) => <ScatterChart data={data} xKey="x" series={[{ key: 'y' }]} />],
  [
    'Sparkline',
    (data: Sample[]) => <SparklineChart data={data} xKey="x" series={[{ key: 'y' }]} />,
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
