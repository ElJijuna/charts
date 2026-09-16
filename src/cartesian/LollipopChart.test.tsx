import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { LollipopChart } from './LollipopChart';

const mockBarSpy = jest.fn((_props: unknown) => null);
const mockScatterSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const points = [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }];
const chartBounds = { bottom: 200, left: 0, right: 300, top: 0 };

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({ chartBounds, points: { revenue: points } });
  },
  Bar: (props: unknown) => {
    mockBarSpy(props);
    return null;
  },
  Scatter: (props: unknown) => {
    mockScatterSpy(props);
    return null;
  },
}));

describe('LollipopChart', () => {
  beforeEach(() => {
    mockBarSpy.mockClear();
    mockScatterSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders customized stems and markers', async () => {
    const screen = await render(
      <LollipopChart
        accessibilityLabel="Revenue ranking"
        animate={false}
        color="#123456"
        data={[{ month: 'Jan', revenue: 12 }]}
        padding={24}
        radius={9}
        shape="square"
        stemWidth={4}
        xKey="month"
        yKey="revenue"
      />,
    );

    expect(screen.getByLabelText('Revenue ranking')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({ padding: 24, yKeys: ['revenue'] }),
    );
    expect(mockBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        barWidth: 4,
        chartBounds,
        color: '#123456',
        points,
      }),
    );
    expect(mockScatterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#123456',
        points,
        radius: 9,
        shape: 'square',
      }),
    );
  });

  it('applies axis, geometry, theme, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));
    const screen = await render(
      <LollipopChart
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        data={[{ month: 'Jan', revenue: 12 }]}
        xKey="month"
        yKey="revenue"
      />,
    );

    expect(screen.getByLabelText('Lollipop chart')).toBeTruthy();
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
    expect(mockBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        barWidth: 3,
        color: '#6750a4',
      }),
    );
    expect(mockScatterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        radius: 6,
        shape: 'circle',
      }),
    );
  });
});
