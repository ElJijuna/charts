import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { SparklineChart } from './SparklineChart';

const mockLineSpy = jest.fn((_props: unknown) => null);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

const currentPoints = [{ x: 0, xValue: 'Jan', y: 12, yValue: 12 }];

jest.mock('victory-native', () => ({
  Scatter: () => null,
  CartesianChart: (props: { children: (value: unknown) => ReactNode }) => {
    mockCartesianSpy(props);
    return props.children({ points: { current: currentPoints } });
  },
  Line: (props: unknown) => {
    mockLineSpy(props);
    return null;
  },
}));

describe('SparklineChart', () => {
  beforeEach(() => {
    mockLineSpy.mockClear();
    mockCartesianSpy.mockClear();
  });

  it('renders a customized compact line without axes', async () => {
    const screen = await render(
      <SparklineChart
        accessibilityLabel="Revenue trend"
        animate={false}
        connectMissingData
        curve="step"
        data={[{ month: 'Jan', current: 12 }]}
        padding={8}
        series={[{ key: 'current', color: '#123456', strokeWidth: 5 }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Revenue trend')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({ padding: 8, yKeys: ['current'] }),
    );
    expect(mockCartesianSpy.mock.calls[0]?.[0]).not.toHaveProperty('axisOptions');
    expect(mockLineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: undefined,
        color: '#123456',
        connectMissingData: true,
        curveType: 'step',
        points: currentPoints,
        strokeWidth: 5,
      }),
    );
  });

  it('applies compact geometry, curve, theme, and animation defaults', async () => {
    const screen = await render(
      <SparklineChart
        data={[{ month: 'Jan', current: 12 }]}
        series={[{ key: 'current' }]}
        xKey="month"
      />,
    );

    expect(screen.getByLabelText('Sparkline chart')).toBeTruthy();
    expect(mockCartesianSpy).toHaveBeenCalledWith(expect.objectContaining({ padding: 4 }));
    expect(mockLineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        animate: { duration: 300, type: 'timing' },
        color: '#6750a4',
        connectMissingData: false,
        curveType: 'monotoneX',
        strokeWidth: 3,
      }),
    );
  });
});
