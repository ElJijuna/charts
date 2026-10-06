import { render } from '@testing-library/react-native';
import * as Charts from '@/index';
import * as ChartMocks from '@/jest';

jest.mock('victory-native', () => ({}));

describe('@real-native/charts/jest', () => {
  it('exports the same runtime API as the library', () => {
    expect(Object.keys(ChartMocks).sort()).toEqual(Object.keys(Charts).sort());
  });

  it('renders charts as views that keep their label, test ID and size', async () => {
    const screen = await render(
      <ChartMocks.LineChart
        accessibilityLabel="Monthly revenue"
        testID="revenue-chart"
        data={[{ month: 'Jan', revenue: 1 }]}
        xKey="month"
        series={[{ key: 'revenue' }]}
        height={120}
        style={{ margin: 4 }}
      />,
    );

    const chart = screen.getByLabelText('Monthly revenue');
    expect(chart).toBe(screen.getByTestId('revenue-chart'));
    expect(chart).toHaveStyle({ height: 120, margin: 4 });
    expect((ChartMocks.LineChart as { displayName?: string }).displayName).toBe('LineChart');
  });

  it('defaults to the library chart height and keeps real non-visual exports', async () => {
    const screen = await render(<ChartMocks.GaugeChart accessibilityLabel="Goal" value={3} />);

    expect(screen.getByLabelText('Goal')).toHaveStyle({ height: 240 });
    expect(ChartMocks.defaultChartTheme).toBe(Charts.defaultChartTheme);
    expect(ChartMocks.useChartPointSelection).toBe(Charts.useChartPointSelection);
  });
});
