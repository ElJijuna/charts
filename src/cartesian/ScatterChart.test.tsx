import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { ScatterChart } from '@/cartesian/ScatterChart';

const mockScatterSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      points: {
        current: [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }],
        previous: [{ x: 0, xValue: 'Jan', y: 9, yValue: 9 }],
      },
    });
  },
  Scatter: (props: unknown) => {
    mockScatterSpy(props);
    return null;
  },
}));

describe('ScatterChart', () => {
  beforeEach(() => {
    mockScatterSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders customized point series', async () => {
    const screen = await render(
      <ScatterChart
        accessibilityLabel="Revenue scatter"
        animate={false}
        data={[{ month: 'Jan', current: 12, previous: 9 }]}
        padding={24}
        radius={8}
        series={[{ key: 'current', color: '#123456' }, { key: 'previous' }]}
        shape="star"
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue scatter')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 24 }));
    expect(mockScatterSpy).toHaveBeenCalledTimes(2);
    expect(mockScatterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#123456',
        radius: 8,
        shape: 'star',
      }),
    );
  });

  it('applies chart, axis, marker, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <ScatterChart
        accessibilityLabel="Scatter chart"
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        data={[{ month: 'Jan', current: 12 }]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Scatter chart')).toBeTruthy();
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
    expect(mockScatterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#6750a4',
        radius: 5,
        shape: 'circle',
      }),
    );
  });
});
