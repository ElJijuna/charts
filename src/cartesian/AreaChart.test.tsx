import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { AreaChart } from '@/cartesian/AreaChart';

const mockAreaSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
  Scatter: () => null,
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      chartBounds: { bottom: 200, left: 0, right: 300, top: 0 },
      points: {
        current: [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }],
        previous: [{ x: 0, xValue: 'Jan', y: 9, yValue: 9 }],
      },
    });
  },
  Area: (props: unknown) => {
    mockAreaSpy(props);
    return null;
  },
}));

describe('AreaChart', () => {
  beforeEach(() => {
    mockAreaSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders customized areas from the chart baseline', async () => {
    const screen = await render(
      <AreaChart
        accessibilityLabel="Revenue area"
        animate={false}
        connectMissingData
        curve="monotoneX"
        data={[{ month: 'Jan', current: 12, previous: 9 }]}
        height={320}
        padding={24}
        series={[{ key: 'current', color: '#123456', fillOpacity: 0.5 }, { key: 'previous' }]}
        testID="area-chart"
        theme={{ backgroundColor: '#ffffff' }}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue area')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 24 }));
    expect(mockAreaSpy).toHaveBeenCalledTimes(2);
    expect(mockAreaSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#123456',
        connectMissingData: true,
        curveType: 'monotoneX',
        opacity: 0.5,
        y0: 200,
      }),
    );
  });

  it('applies area, chart, axis, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <AreaChart
        accessibilityLabel="Area chart"
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        data={[{ month: 'Jan', current: 12 }]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Area chart')).toBeTruthy();
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
    expect(mockAreaSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#6750a4',
        connectMissingData: false,
        curveType: 'natural',
        opacity: 0.24,
      }),
    );
  });
});
