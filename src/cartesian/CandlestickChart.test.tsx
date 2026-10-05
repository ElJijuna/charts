import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { CandlestickChart } from '@/cartesian/CandlestickChart';

const mockCandlestickSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const openPoints = [{ x: 0, xValue: 'Mon', y: 42, yValue: 42 }];
const highPoints = [{ x: 0, xValue: 'Mon', y: 49, yValue: 49 }];
const lowPoints = [{ x: 0, xValue: 'Mon', y: 39, yValue: 39 }];
const closePoints = [{ x: 0, xValue: 'Mon', y: 47, yValue: 47 }];
const chartBounds = { bottom: 200, left: 0, right: 300, top: 0 };

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      chartBounds,
      points: { open: openPoints, high: highPoints, low: lowPoints, close: closePoints },
    });
  },
  Candlestick: (props: unknown) => {
    mockCandlestickSpy(props);
    return null;
  },
}));

const data = [{ day: 'Mon', open: 42, high: 49, low: 39, close: 47 }];

describe('CandlestickChart', () => {
  beforeEach(() => {
    mockCandlestickSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders customized OHLC candles', async () => {
    const screen = await render(
      <CandlestickChart
        accessibilityLabel="Weekly price"
        animate={false}
        candleRatio={0.75}
        candleWidth={20}
        closeKey="close"
        colors={{ positive: '#00aa00', negative: '#aa0000', neutral: '#777777' }}
        data={data}
        highKey="high"
        lowKey="low"
        minBodyHeight={3}
        openKey="open"
        padding={24}
        wickStrokeWidth={2}
        xKey="day"
      />,
    );

    expect(screen.getByLabelText('Weekly price')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({ padding: 24, yKeys: ['open', 'high', 'low', 'close'] }),
    );
    expect(mockCandlestickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        candleColors: { positive: '#00aa00', negative: '#aa0000', neutral: '#777777' },
        candleRatio: 0.75,
        candleWidth: 20,
        chartBounds,
        closePoints,
        highPoints,
        lowPoints,
        minBodyHeight: 3,
        openPoints,
        wickStrokeWidth: 2,
      }),
    );
  });

  it('applies chart, axis, candle, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <CandlestickChart
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        closeKey="close"
        data={data}
        highKey="high"
        lowKey="low"
        openKey="open"
        xKey="day"
      />,
    );

    expect(screen.getByLabelText('Candlestick chart')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        axisOptions: expect.objectContaining({
          formatXLabel: formatLabel,
          formatYLabel: formatLabel,
          labelColor: '#222',
          lineColor: '#111',
          tickCount: { x: 2, y: 4 },
        }),
        padding: 16,
      }),
    );
    expect(mockCandlestickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        candleColors: { positive: '#386a20', negative: '#ba1a1a', neutral: '#79747e' },
        candleRatio: 0.6,
        candleWidth: undefined,
        minBodyHeight: 1,
        wickStrokeWidth: 1,
      }),
    );
  });
});
