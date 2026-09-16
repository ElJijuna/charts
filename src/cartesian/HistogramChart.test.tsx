import { render } from '@testing-library/react-native';

import { HistogramChart } from './HistogramChart';

const mockBarChartSpy = jest.fn((_props: unknown) => null);

jest.mock('./BarChart', () => ({
  BarChart: (props: unknown) => {
    mockBarChartSpy(props);
    return null;
  },
}));

describe('HistogramChart', () => {
  beforeEach(() => {
    mockBarChartSpy.mockClear();
  });

  it('bins finite values across a custom domain', async () => {
    await render(
      <HistogramChart
        accessibilityLabel="Response distribution"
        animate={false}
        binCount={4}
        color="#123456"
        domain={[0, 8]}
        values={[0, 1, 2, 3, 4, 7, 8, Number.NaN, 20]}
      />,
    );

    expect(mockBarChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accessibilityLabel: 'Response distribution',
        animate: false,
        barPadding: 0,
        cornerRadius: 0,
        data: [
          { bin: 1, count: 2 },
          { bin: 3, count: 2 },
          { bin: 5, count: 1 },
          { bin: 7, count: 2 },
        ],
        groupPadding: 0,
        series: [{ key: 'count', color: '#123456' }],
        xKey: 'bin',
      }),
    );
  });

  it('applies defaults and handles a constant distribution', async () => {
    await render(<HistogramChart values={[5, 5, 5]} />);

    expect(mockBarChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accessibilityLabel: 'Histogram chart',
        animate: true,
        data: [{ bin: 5, count: 3 }],
        height: 240,
        padding: 16,
      }),
    );
  });

  it('handles empty and invalid datasets', async () => {
    const { rerender } = await render(
      <HistogramChart values={[Number.NaN, Number.POSITIVE_INFINITY]} />,
    );
    expect(mockBarChartSpy).toHaveBeenLastCalledWith(expect.objectContaining({ data: [] }));

    await rerender(<HistogramChart binCount={0} domain={[10, 0]} values={[0, 5, 10]} />);
    expect(mockBarChartSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: [{ bin: 5, count: 3 }] }),
    );
  });
});
