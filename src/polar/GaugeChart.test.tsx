import { render } from '@testing-library/react-native';

import { GaugeChart } from './GaugeChart';

const mockPieChartSpy = jest.fn((_props: unknown) => null);

jest.mock('./PieChart', () => ({
  PieChart: (props: unknown) => {
    mockPieChartSpy(props);
    return null;
  },
}));

describe('GaugeChart', () => {
  beforeEach(() => {
    mockPieChartSpy.mockClear();
  });

  it('renders a customized value and remaining track', async () => {
    await render(
      <GaugeChart
        accessibilityLabel="Quota usage"
        animate={false}
        circleSweepDegrees={270}
        innerRadius="60%"
        max={200}
        startAngle={90}
        trackColor="#dddddd"
        value={75}
        valueColor="#123456"
      />,
    );

    expect(mockPieChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accessibilityLabel: 'Quota usage',
        animate: false,
        circleSweepDegrees: 270,
        data: [
          { label: 'Value', value: 75, color: '#123456' },
          { label: 'Remaining', value: 125, color: '#dddddd' },
        ],
        innerRadius: '60%',
        startAngle: 90,
      }),
    );
  });

  it('clamps values and applies gauge defaults', async () => {
    await render(<GaugeChart value={140} />);

    expect(mockPieChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accessibilityLabel: 'Gauge chart',
        animate: true,
        circleSweepDegrees: 180,
        data: [
          { label: 'Value', value: 100, color: '#6750a4' },
          { label: 'Remaining', value: 0, color: '#e7e0ec' },
        ],
        height: 240,
        innerRadius: '70%',
        startAngle: 180,
      }),
    );
  });

  it('handles invalid maximums and values safely', async () => {
    await render(<GaugeChart max={0} value={Number.NaN} />);

    expect(mockPieChartSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          { label: 'Value', value: 0, color: '#6750a4' },
          { label: 'Remaining', value: 1, color: '#e7e0ec' },
        ],
      }),
    );
  });
});
