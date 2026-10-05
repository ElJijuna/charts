import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { AreaRangeChart } from '@/cartesian/AreaRangeChart';

const mockAreaRangeSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const lowerPoints = [{ x: 0, xValue: 'Jan', y: 8, yValue: 8 }];
const upperPoints = [{ x: 0, xValue: 'Jan', y: 16, yValue: 16 }];

jest.mock('victory-native', () => ({
  Scatter: () => null,
  Line: () => null,
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({ points: { lower: lowerPoints, upper: upperPoints } });
  },
  AreaRange: (props: unknown) => {
    mockAreaRangeSpy(props);
    return null;
  },
}));

const data = [{ month: 'Jan', lower: 8, upper: 16 }];

describe('AreaRangeChart', () => {
  beforeEach(() => {
    mockAreaRangeSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders a customized range between lower and upper series', async () => {
    const screen = await render(
      <AreaRangeChart
        accessibilityLabel="Revenue forecast"
        animate={false}
        color="#123456"
        connectMissingData
        curve="monotoneX"
        data={data}
        lowerKey="lower"
        opacity={0.5}
        padding={24}
        upperKey="upper"
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue forecast')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({ padding: 24, yKeys: ['lower', 'upper'] }),
    );
    expect(mockAreaRangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#123456',
        connectMissingData: true,
        curveType: 'monotoneX',
        lowerPoints,
        opacity: 0.5,
        upperPoints,
      }),
    );
  });

  it('applies chart, axis, fill, and animation defaults', async () => {
    const formatLabel = jest.fn((value: unknown) => String(value));

    const screen = await render(
      <AreaRangeChart
        axes={{
          x: { formatLabel, labelColor: '#222', tickCount: 2 },
          y: { formatLabel, lineColor: '#111', tickCount: 4 },
        }}
        data={data}
        lowerKey="lower"
        upperKey="upper"
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Area range chart')).toBeTruthy();
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
    expect(mockAreaRangeSpy).toHaveBeenCalledWith(
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
