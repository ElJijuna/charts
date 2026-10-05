import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { PieChart } from '@/polar/PieChart';

const mockPolarSpy = jest.fn((_props: unknown) => null);
const mockPieChartSpy = jest.fn((_props: unknown) => null);
const mockPieSliceSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
  PolarChart: (props: { children: ReactNode }) => {
    mockPolarSpy(props);
    return props.children;
  },
  Pie: {
    Chart: (props: { children: (value: unknown) => ReactNode }) => {
      mockPieChartSpy(props);
      return props.children({ slice: { value: 12 } });
    },
    Slice: (props: unknown) => {
      mockPieSliceSpy(props);
      return null;
    },
  },
}));

describe('PieChart', () => {
  beforeEach(() => {
    mockPolarSpy.mockClear();
    mockPieChartSpy.mockClear();
    mockPieSliceSpy.mockClear();
  });

  it('skips nonpositive and invalid slices and handles all-zero data without a canvas', async () => {
    const screen = await render(
      <PieChart
        data={[
          { label: 'Valid', value: 5 },
          { label: 'Zero', value: 0 },
          { label: 'Negative', value: -2 },
          { label: 'Invalid', value: Number.NaN },
        ]}
      />,
    );
    expect(mockPolarSpy).toHaveBeenCalledWith(
      expect.objectContaining({ data: [expect.objectContaining({ label: 'Valid', value: 5 })] }),
    );
    mockPolarSpy.mockClear();
    await screen.rerender(<PieChart data={[{ label: 'Zero', value: 0 }]} />);
    expect(screen.getByText('No data')).toBeTruthy();
    expect(mockPolarSpy).not.toHaveBeenCalled();
  });

  it('preserves proportions when the total of finite weights overflows', async () => {
    await render(
      <PieChart
        data={[
          { label: 'A', value: Number.MAX_VALUE },
          { label: 'B', value: Number.MAX_VALUE },
        ]}
      />,
    );
    expect(mockPolarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          expect.objectContaining({ label: 'A', value: 1 }),
          expect.objectContaining({ label: 'B', value: 1 }),
        ],
      }),
    );
  });

  it('resolves slice colors and customizes the pie layout', async () => {
    const screen = await render(
      <PieChart
        accessibilityLabel="Revenue split"
        animate={false}
        circleSweepDegrees={270}
        data={[
          { label: 'Product', value: 70, color: '#123456' },
          { label: 'Services', value: 30 },
        ]}
        innerRadius="45%"
        startAngle={-90}
        theme={{ colors: ['#abcdef'] }}
      />,
    );

    expect(screen.getByLabelText('Revenue split')).toBeTruthy();
    expect(mockPolarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        colorKey: 'color',
        data: [
          { label: 'Product', value: 70, color: '#123456' },
          { label: 'Services', value: 30, color: '#abcdef' },
        ],
        labelKey: 'label',
        valueKey: 'value',
      }),
    );
    expect(mockPieChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        circleSweepDegrees: 270,
        innerRadius: '45%',
        startAngle: -90,
      }),
    );
    expect(mockPieSliceSpy).toHaveBeenCalledWith(expect.objectContaining({ animate: undefined }));
  });

  it('applies pie and animation defaults', async () => {
    const screen = await render(<PieChart data={[{ label: 'Product', value: 100 }]} />);

    expect(screen.getByLabelText('Pie chart')).toBeTruthy();
    expect(mockPieChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({ circleSweepDegrees: 360, innerRadius: 0, startAngle: 0 }),
    );
    expect(mockPieSliceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ animate: { duration: 300, type: 'timing' } }),
    );
  });
});
