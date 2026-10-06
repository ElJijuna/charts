import { render } from '@testing-library/react-native';
import { useEffect as mockUseEffect, type ReactNode } from 'react';

import { BarChart } from '@/cartesian/BarChart';

const mockBarSpy = jest.fn((_props: unknown) => null);
const mockBarGroupSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
  CartesianChart: (props: {
    children: (value: unknown) => ReactNode;
    onChartBoundsChange?: (bounds: unknown) => void;
  }) => {
    mockCartesianSpy(props);
    const { onChartBoundsChange } = props;
    mockUseEffect(() => {
      onChartBoundsChange?.({ bottom: 200, left: 0, right: 300, top: 0 });
    }, [onChartBoundsChange]);
    return props.children({
      chartBounds: { bottom: 200, left: 0, right: 300, top: 0 },
      points: {
        current: [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }],
        previous: [{ x: 0, xValue: 'Jan', y: 9, yValue: 9 }],
      },
    });
  },
  BarGroup: Object.assign(
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

describe('BarChart', () => {
  beforeEach(() => {
    mockBarSpy.mockClear();
    mockBarGroupSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders grouped series with custom spacing and corners', async () => {
    const screen = await render(
      <BarChart
        accessibilityLabel="Revenue comparison"
        animate={false}
        barPadding={0.2}
        cornerRadius={10}
        data={[{ month: 'Jan', current: 12, previous: 9 }]}
        groupPadding={0.4}
        height={320}
        padding={24}
        series={[{ key: 'current', color: '#123456' }, { key: 'previous' }]}
        testID="bar-chart"
        theme={{ backgroundColor: '#ffffff' }}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue comparison')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 24 }));
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
    // One bar per series in each render.
    expect(mockBarSpy).toHaveBeenCalledTimes(2 * mockBarGroupSpy.mock.calls.length);
    expect(mockBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({ animate: undefined, color: '#123456' }),
    );
  });

  it('applies chart, axis, animation, and theme defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <BarChart
        accessibilityLabel="Bar chart"
        axes={{
          x: { formatLabel, lineColor: '#111', tickCount: 2 },
          y: { formatLabel, labelColor: '#222', tickCount: 4 },
        }}
        data={[{ month: 'Jan', current: 12 }]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Bar chart')).toBeTruthy();
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
    expect(mockBarGroupSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        betweenGroupPadding: 0.25,
        withinGroupPadding: 0.1,
      }),
    );
    expect(mockBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#6750a4',
      }),
    );
  });

  it('insets the first and last groups by half a band before drawing bars', async () => {
    await render(
      <BarChart
        accessibilityLabel="Revenue"
        data={[
          { month: 'Jan', current: 1 },
          { month: 'Feb', current: 2 },
          { month: 'Mar', current: 3 },
        ]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    // 300px for 3 groups: 75px of domain padding spaces points 100px apart, 50px from each edge.
    expect(mockCartesianSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ domainPadding: { left: 75, right: 75 } }),
    );
    // The first render, before the plot size is known, draws the grid but no bars.
    expect(mockBarGroupSpy).toHaveBeenCalled();
    expect(mockBarGroupSpy.mock.calls.length).toBeLessThan(mockCartesianSpy.mock.calls.length);
  });
});
