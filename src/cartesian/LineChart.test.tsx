import type { SkFont } from '@shopify/react-native-skia';
import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Text } from 'react-native';

import { LineChart } from '@/cartesian/LineChart';

const mockLineSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
  Scatter: () => null,
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

  it('keeps layout and metadata without mounting the renderer for unusable data', async () => {
    const emptyData: { month: number; revenue: number }[] = [];
    const screen = await render(
      <LineChart
        accessibilityLabel="Line chart"
        emptyLabel="No data"
        data={emptyData}
        xKey="month"
        series={[{ key: 'revenue' }]}
        testID="empty"
      />,
    );
    expect(screen.getByText('No data')).toBeTruthy();
    expect(screen.getByTestId('empty')).toBeTruthy();
    expect(mockCartesianSpy).not.toHaveBeenCalled();
    await screen.rerender(
      <LineChart
        accessibilityLabel="Line chart"
        data={[{ month: 1, revenue: Number.NaN }]}
        xKey="month"
        series={[{ key: 'revenue' }]}
      />,
    );
    expect(screen.queryByText('No data')).toBeNull();
    expect(screen.getByLabelText('Line chart')).toBeTruthy();
    expect(mockCartesianSpy).not.toHaveBeenCalled();
  });

  it('renders custom empty content and colors the empty label from the theme', async () => {
    const screen = await render(
      <LineChart
        accessibilityLabel="Ingresos"
        emptyLabel="Sin datos"
        data={[]}
        xKey="month"
        series={[{ key: 'revenue' }]}
        theme={{ labelColor: '#123456' }}
      />,
    );
    expect(screen.getByText('Sin datos')).toHaveStyle({ color: '#123456' });
    expect(screen.getByLabelText('Ingresos: Sin datos')).toBeTruthy();

    await screen.rerender(
      <LineChart
        accessibilityLabel="Ingresos"
        emptyLabel="Sin datos"
        renderEmpty={() => <Text>Agrega una venta</Text>}
        data={[]}
        xKey="month"
        series={[{ key: 'revenue' }]}
      />,
    );
    expect(screen.getByText('Agrega una venta')).toBeTruthy();
    expect(screen.queryByText('Sin datos')).toBeNull();
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
    const font = { size: 12 } as unknown as SkFont;

    const screen = await render(
      <LineChart
        accessibilityLabel="Line chart"
        axes={{
          font,
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
          font,
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
