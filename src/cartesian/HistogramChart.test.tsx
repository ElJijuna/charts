import { render } from '@testing-library/react-native';

import { HistogramChart } from './HistogramChart';

const mockBarChartSpy = jest.fn((_props: Record<string, unknown>) => null);

jest.mock('./BarChart', () => ({
  BarChart: (props: Record<string, unknown>) => {
    mockBarChartSpy(props);
    return null;
  },
}));

describe('HistogramChart', () => {
  beforeEach(() => {
    mockBarChartSpy.mockClear();
  });

  it('handles invalid configuration and very large datasets without spread overflow', async () => {
    await render(
      <HistogramChart
        binCount={Number.NaN}
        domain={[Number.NaN, 10]}
        values={Array.from({ length: 150_000 }, (_, index) => index % 2)}
      />,
    );
    const props = mockBarChartSpy.mock.calls.at(-1)?.[0];
    expect(props).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([expect.objectContaining({ count: 75_000 })]),
      }),
    );
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

it('preserves bins and series for equivalent domains and updates color separately', async () => {
  const values = [1, 2, 3];
  const screen = await render(<HistogramChart values={values} domain={[0, 4]} color="red" />);
  const initial = mockBarChartSpy.mock.calls.at(-1)?.[0];
  await screen.rerender(
    <HistogramChart values={values} domain={[0, 4]} color="red" testID="next" />,
  );
  const next = mockBarChartSpy.mock.calls.at(-1)?.[0];
  expect(next?.data).toBe(initial?.data);
  expect(next?.series).toBe(initial?.series);
  await screen.rerender(<HistogramChart values={values} domain={[0, 4]} color="blue" />);
  const changed = mockBarChartSpy.mock.calls.at(-1)?.[0];
  expect(changed?.data).toBe(initial?.data);
  expect(changed?.series).toEqual([{ key: 'count', color: 'blue' }]);
});
