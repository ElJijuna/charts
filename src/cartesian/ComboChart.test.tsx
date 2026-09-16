import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { ComboChart } from './ComboChart';

const mockBarSpy = jest.fn((_props: unknown) => null);
const mockBarGroupSpy = jest.fn((_props: unknown) => null);
const mockLineSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const revenuePoints = [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }];
const targetPoints = [{ x: 0, xValue: 'Jan', y: 15, yValue: 15 }];

jest.mock('victory-native', () => ({
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({
      chartBounds: { bottom: 200, left: 0, right: 300, top: 0 },
      points: { revenue: revenuePoints, target: targetPoints },
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
  Line: (props: unknown) => {
    mockLineSpy(props);
    return null;
  },
}));

const data = [{ month: 'Jan', revenue: 12, target: 15 }];

describe('ComboChart', () => {
  beforeEach(() => {
    mockBarSpy.mockClear();
    mockBarGroupSpy.mockClear();
    mockLineSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders customized bar and line series together', async () => {
    const screen = await render(
      <ComboChart
        accessibilityLabel="Revenue and target"
        animate={false}
        barPadding={0.2}
        barSeries={[{ key: 'revenue', color: '#123456' }]}
        connectMissingData
        cornerRadius={10}
        curve="monotoneX"
        data={data}
        groupPadding={0.4}
        lineSeries={[{ key: 'target', color: '#abcdef', strokeWidth: 5 }]}
        padding={24}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue and target')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({ padding: 24, yKeys: ['revenue', 'target'] }),
    );
    expect(mockBarGroupSpy).toHaveBeenCalledWith(
      expect.objectContaining({ betweenGroupPadding: 0.4, withinGroupPadding: 0.2 }),
    );
    expect(mockBarSpy).toHaveBeenCalledWith(
      expect.objectContaining({ animate: undefined, color: '#123456', points: revenuePoints }),
    );
    expect(mockLineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#abcdef',
        connectMissingData: true,
        curveType: 'monotoneX',
        points: targetPoints,
        strokeWidth: 5,
      }),
    );
  });

  it('applies axis, geometry, color, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <ComboChart
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        barSeries={[{ key: 'revenue' }]}
        data={data}
        lineSeries={[{ key: 'target' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Combo chart')).toBeTruthy();
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
        color: '#6750a4',
      }),
    );
    expect(mockLineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#00639b',
        connectMissingData: false,
        curveType: 'natural',
      }),
    );
  });
});
