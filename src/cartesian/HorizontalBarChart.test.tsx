import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { HorizontalBarChart } from '@/cartesian/HorizontalBarChart';

const mockBarSpy = jest.fn((_props: unknown) => null);
const mockBarGroupSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
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
  HorizontalBarGroup: Object.assign(
    (props: { children: ReactNode }) => {
      mockBarGroupSpy(props);
      return props.children;
    },
    {
      Bar: (props: unknown) => {
        mockBarSpy(props);
        return null;
      },
    },
  ),
}));

describe('HorizontalBarChart', () => {
  beforeEach(() => {
    mockBarSpy.mockClear();
    mockBarGroupSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders horizontal grouped series with custom spacing', async () => {
    const screen = await render(
      <HorizontalBarChart
        accessibilityLabel="Revenue ranking"
        animate={false}
        barPadding={0.2}
        cornerRadius={10}
        data={[{ month: 'Jan', current: 12, previous: 9 }]}
        groupPadding={0.4}
        padding={24}
        series={[{ key: 'current', color: '#123456' }, { key: 'previous' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue ranking')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({ orientation: 'horizontal', padding: 24 }),
    );
    expect(mockBarGroupSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        betweenGroupPadding: 0.4,
        roundedCorners: {
          bottomLeft: 10,
          bottomRight: 10,
          topLeft: 10,
          topRight: 10,
        },
        withinGroupPadding: 0.2,
      }),
    );
    expect(mockBarSpy).toHaveBeenCalledTimes(2);
    expect(mockBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({ animate: undefined, color: '#123456' }),
    );
  });

  it('applies chart, axis, animation, and theme defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <HorizontalBarChart
        axes={{
          x: { formatLabel, lineColor: '#111', tickCount: 2 },
          y: { formatLabel, labelColor: '#222', tickCount: 4 },
        }}
        data={[{ month: 'Jan', current: 12 }]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Horizontal bar chart')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        axisOptions: expect.objectContaining({
          formatXLabel: formatLabel,
          formatYLabel: formatLabel,
          labelColor: '#222',
          lineColor: '#111',
          tickCount: { x: 2, y: 4 },
        }),
        orientation: 'horizontal',
        padding: 16,
      }),
    );
    expect(mockBarGroupSpy).toHaveBeenCalledWith(
      expect.objectContaining({ betweenGroupPadding: 0.25, withinGroupPadding: 0.1 }),
    );
    expect(mockBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#6750a4',
      }),
    );
  });
});
