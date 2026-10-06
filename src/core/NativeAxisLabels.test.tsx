import { render } from '@testing-library/react-native';
import { useEffect as mockUseEffect } from 'react';
import { BarChart } from '@/cartesian/BarChart';
import { LineChart } from '@/cartesian/LineChart';
import { type AxisScale, sampleIndexTicks } from '@/core/NativeAxisLabels';

function makeScale(ticks: number[], range: [number, number], map: (value: number) => number) {
  const scale = ((value: number) => map(value)) as AxisScale;
  scale.ticks = () => ticks;
  scale.range = () => range;
  return scale;
}

const mockXScale = makeScale([0, 1, 2], [56, 296], (value) => 56 + value * 120);
const mockYScale = makeScale([0, 50, 100], [204, 16], (value) => 204 - value * 1.88);
const mockCartesianSpy = jest.fn((_props: unknown) => null);

jest.mock('victory-native', () => ({
  Bar: () => null,
  BarGroup: Object.assign(() => null, { Bar: () => null }),
  Line: () => null,
  Scatter: () => null,
  CartesianChart: (props: { onScaleChange?: (x: AxisScale, y: AxisScale) => void }) => {
    mockCartesianSpy(props);
    const { onScaleChange } = props;
    mockUseEffect(() => {
      onScaleChange?.(mockXScale, mockYScale);
    }, [onScaleChange]);
    return null;
  },
}));

const data = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 70 },
  { day: 'Wed', value: 55 },
];

describe('native axis labels', () => {
  beforeEach(() => {
    mockCartesianSpy.mockClear();
  });

  it('renders formatted, colored labels as Text and reserves room for them', async () => {
    const screen = await render(
      <LineChart
        accessibilityLabel="Visits"
        data={data}
        xKey="day"
        series={[{ key: 'value' }]}
        padding={10}
        axes={{
          labelMode: 'native',
          labelSpace: { y: 30 },
          labelStyle: { fontSize: 14 },
          x: { labelColor: '#111111' },
          y: { formatLabel: (value) => `${String(value)}%`, labelColor: '#222222' },
        }}
      />,
    );

    expect(screen.getByText('Mon')).toHaveStyle({ color: '#111111', fontSize: 14 });
    expect(screen.getByText('Wed')).toBeTruthy();
    expect(screen.getByText('100%')).toHaveStyle({ color: '#222222', textAlign: 'right' });
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        padding: { top: 10, right: 10, bottom: 30, left: 40 },
        axisOptions: expect.objectContaining({ font: null }),
      }),
    );
  });

  it('labels numeric X values from the scale ticks', async () => {
    const screen = await render(
      <BarChart
        accessibilityLabel="Totals"
        data={[
          { x: 0, value: 1 },
          { x: 2, value: 3 },
        ]}
        xKey="x"
        series={[{ key: 'value' }]}
        axes={{ labelMode: 'native', x: { formatLabel: (value) => `#${String(value)}` } }}
      />,
    );

    expect(screen.getByText('#1')).toBeTruthy();
  });

  it('keeps canvas labels unchanged by default', async () => {
    const screen = await render(
      <LineChart accessibilityLabel="Visits" data={data} xKey="day" series={[{ key: 'value' }]} />,
    );

    expect(screen.queryByText('Mon')).toBeNull();
    expect(mockCartesianSpy).toHaveBeenCalledWith(
      expect.objectContaining({ padding: 16, onScaleChange: undefined }),
    );
  });
});

describe('sampleIndexTicks', () => {
  it('matches Victory category sampling', () => {
    expect(sampleIndexTicks(3, 0)).toEqual([]);
    expect(sampleIndexTicks(3, 5)).toEqual([0, 1, 2]);
    expect(sampleIndexTicks(10, 1)).toEqual([0]);
    expect(sampleIndexTicks(10, 4)).toEqual([0, 3, 6, 9]);
  });
});
