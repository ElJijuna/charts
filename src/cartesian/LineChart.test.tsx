import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { LineChart } from './LineChart';

const mockLineSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      points: {
        revenue: [{ x: 0, xValue: 1, y: 12, yValue: 12 }],
      },
    });
  },
  Line: (props: unknown) => {
    mockLineSpy(props);
    return null;
  },
}));

describe('LineChart', () => {
  beforeEach(() => {
    mockCartesianSpy.mockClear();
    mockLineSpy.mockClear();
  });

  it('renders a configured series with accessible chart metadata', async () => {
    const screen = await render(
      <LineChart
        accessibilityLabel="Monthly revenue"
        animate={false}
        connectMissingData
        curve="monotoneX"
        data={[{ month: 1, revenue: 12 }]}
        height={320}
        padding={24}
        series={[{ key: 'revenue', color: '#123456', strokeWidth: 4 }]}
        theme={{ backgroundColor: '#ffffff' }}
        testID="chart"
        xKey="month"
      />,
    );

    expect(screen.getByTestId('chart').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ height: 320, backgroundColor: '#ffffff' }),
      ]),
    );
    expect(screen.getByLabelText('Monthly revenue')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 24 }));
    expect(mockLineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#123456',
        connectMissingData: true,
        curveType: 'monotoneX',
        strokeWidth: 4,
      }),
    );
  });

  it('applies defaults and accepts custom axis configuration', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <LineChart
        axes={{
          x: { formatLabel, tickCount: 3, lineColor: '#111', labelColor: '#222' },
          y: { formatLabel, tickCount: 4 },
        }}
        data={[{ month: 1, revenue: 12 }]}
        series={[{ key: 'revenue' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Line chart')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        axisOptions: expect.objectContaining({
          formatXLabel: formatLabel,
          formatYLabel: formatLabel,
          labelColor: '#222',
          lineColor: '#111',
          tickCount: { x: 3, y: 4 },
        }),
        padding: 16,
      }),
    );
    expect(mockLineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#6750a4',
        connectMissingData: false,
        curveType: 'natural',
        strokeWidth: 3,
      }),
    );
  });
});
