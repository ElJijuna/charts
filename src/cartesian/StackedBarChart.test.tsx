import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { StackedBarChart } from '@/cartesian/StackedBarChart';

const mockStackedBarSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const currentPoints = [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }];
const previousPoints = [{ x: 0, xValue: 'Jan', y: 9, yValue: 9 }];
const chartBounds = { bottom: 200, left: 0, right: 300, top: 0 };

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      chartBounds,
      points: { current: currentPoints, previous: previousPoints },
    });
  },
  StackedBar: (props: unknown) => {
    mockStackedBarSpy(props);
    return null;
  },
}));

describe('StackedBarChart', () => {
  beforeEach(() => {
    mockStackedBarSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders stacked series with custom sizing', async () => {
    const screen = await render(
      <StackedBarChart
        accessibilityLabel="Revenue total"
        animate={false}
        barWidth={36}
        data={[{ month: 'Jan', current: 12, previous: 9 }]}
        innerPadding={0.4}
        padding={24}
        series={[{ key: 'current', color: '#123456' }, { key: 'previous' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue total')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 24 }));
    expect(mockStackedBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        barWidth: 36,
        chartBounds,
        colors: ['#123456', '#00639b'],
        innerPadding: 0.4,
        points: [currentPoints, previousPoints],
      }),
    );
  });

  it('applies chart, axis, spacing, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <StackedBarChart
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        data={[{ month: 'Jan', current: 12 }]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Stacked bar chart')).toBeTruthy();
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
    expect(mockStackedBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        barWidth: undefined,
        innerPadding: 0.25,
      }),
    );
  });
});
