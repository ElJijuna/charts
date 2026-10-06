import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { AreaChart } from '@/cartesian/AreaChart';
import { LineChart } from '@/cartesian/LineChart';

const mockCartesianSpy = jest.fn((_props: Record<string, unknown>) => null);
const mockPathSpy = jest.fn((_props: Record<string, unknown>) => null);

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      chartBounds: { top: 0, bottom: 200, left: 0, right: 300 },
      points: {
        revenue: [
          { x: 0, xValue: 1, y: 12, yValue: 12 },
          { x: 100, xValue: 2, y: 24, yValue: 24 },
        ],
      },
    });
  },
  Line: (props: Record<string, unknown>) => mockPathSpy(props),
  Area: (props: Record<string, unknown>) => mockPathSpy(props),
  Scatter: () => null,
}));

const data = [
  { month: 1, revenue: 12 },
  { month: 2, revenue: 24 },
];
const series = [{ key: 'revenue' as const }];

beforeEach(() => {
  mockCartesianSpy.mockClear();
  mockPathSpy.mockClear();
});

describe.each([
  ['Line', LineChart],
  ['Area', AreaChart],
] as const)('%s render stability', (_, Chart) => {
  it('skips the renderer for unchanged props and updates immutable data', async () => {
    const screen = await render(
      <Chart accessibilityLabel="Chart" data={data} xKey="month" series={series} />,
    );
    const calls = mockCartesianSpy.mock.calls.length;
    await screen.rerender(
      <Chart accessibilityLabel="Chart" data={data} xKey="month" series={series} />,
    );
    expect(mockCartesianSpy).toHaveBeenCalledTimes(calls);

    const nextData = [{ month: 1, revenue: 99 }];
    await screen.rerender(
      <Chart accessibilityLabel="Chart" data={nextData} xKey="month" series={series} />,
    );
    expect(mockCartesianSpy.mock.calls.at(-1)?.[0].data).toEqual(nextData);
    expect(mockCartesianSpy.mock.calls.length).toBeGreaterThan(calls);
  });

  it('retains data and configuration when inline config values stay equal', async () => {
    const screen = await render(
      <Chart
        accessibilityLabel="Chart"
        data={data}
        xKey="month"
        series={series}
        axes={{ x: { tickCount: 3 } }}
        theme={{ backgroundColor: 'transparent' }}
      />,
    );
    const initial = mockCartesianSpy.mock.calls.at(-1)?.[0];
    const animation = mockPathSpy.mock.calls.at(-1)?.[0].animate;
    await screen.rerender(
      <Chart
        accessibilityLabel="Chart"
        data={data}
        xKey="month"
        series={series}
        axes={{ x: { tickCount: 3 } }}
        theme={{ backgroundColor: 'transparent' }}
        testID="updated"
      />,
    );
    const next = mockCartesianSpy.mock.calls.at(-1)?.[0];
    expect(screen.getByTestId('updated')).toBeTruthy();
    expect(next?.data).toBe(initial?.data);
    expect(next?.yKeys).toBe(initial?.yKeys);
    expect(next?.axisOptions).toBe(initial?.axisOptions);
    expect(mockPathSpy.mock.calls.at(-1)?.[0].animate).toBe(animation);
  });

  it('updates colors, axes and callbacks without re-preparing data', async () => {
    const screen = await render(
      <Chart accessibilityLabel="Chart" data={data} xKey="month" series={series} />,
    );
    const initial = mockCartesianSpy.mock.calls.at(-1)?.[0];
    const formatLabel = (value: unknown) => `${value} pts`;
    await screen.rerender(
      <Chart
        accessibilityLabel="Chart"
        data={data}
        xKey="month"
        series={series}
        axes={{ x: { tickCount: 7, formatLabel } }}
        theme={{ colors: ['red'] }}
      />,
    );
    const next = mockCartesianSpy.mock.calls.at(-1)?.[0];
    expect(next?.data).toBe(initial?.data);
    expect(next?.yKeys).toBe(initial?.yKeys);
    expect(next?.axisOptions).not.toBe(initial?.axisOptions);
    expect(next?.axisOptions).toEqual(
      expect.objectContaining({ formatXLabel: formatLabel, tickCount: { x: 7, y: 5 } }),
    );
    expect(mockPathSpy.mock.calls.at(-1)?.[0].color).toBe('red');
  });
});
