import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { StackedAreaChart } from '@/cartesian/StackedAreaChart';

const mockStackedAreaSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const currentPoints = [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }];
const previousPoints = [{ x: 0, xValue: 'Jan', y: 9, yValue: 9 }];
const chartBounds = { bottom: 200, left: 0, right: 300, top: 0 };

jest.mock('victory-native', () => ({
  Scatter: () => null,
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      chartBounds,
      yScale: (value: number) => value,
      points: { current: currentPoints, previous: previousPoints },
    });
  },
  StackedArea: (props: unknown) => {
    mockStackedAreaSpy(props);
    return null;
  },
}));

describe('StackedAreaChart', () => {
  beforeEach(() => {
    mockStackedAreaSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders customized stacked series from the chart baseline', async () => {
    const screen = await render(
      <StackedAreaChart
        accessibilityLabel="Revenue composition"
        animate={false}
        curve="monotoneX"
        data={[{ month: 'Jan', current: 12, previous: 9 }]}
        padding={24}
        series={[{ key: 'current', color: '#123456', fillOpacity: 0.7 }, { key: 'previous' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue composition')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 24 }));
    expect(mockStackedAreaSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        colors: ['#123456', '#00639b'],
        curveType: 'monotoneX',
        points: [currentPoints, previousPoints],
        y0: 200,
      }),
    );

    const props = mockStackedAreaSpy.mock.calls[0]?.[0] as {
      areaOptions: (value: { rowIndex: number }) => { opacity: number };
    };
    expect(props.areaOptions({ rowIndex: 0 })).toEqual({ opacity: 0.7 });
    expect(props.areaOptions({ rowIndex: 1 })).toEqual({ opacity: 0.5 });
  });

  it('applies chart, axis, curve, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <StackedAreaChart
        accessibilityLabel="Stacked area chart"
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        data={[{ month: 'Jan', current: 12 }]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Stacked area chart')).toBeTruthy();
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
    expect(mockStackedAreaSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        curveType: 'natural',
      }),
    );
  });
});
