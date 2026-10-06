import {
  AreaChart,
  AreaRangeChart,
  BarChart,
  BubbleChart,
  CandlestickChart,
  ComboChart,
  GaugeChart,
  HistogramChart,
  HorizontalBarChart,
  HorizontalStackedBarChart,
  LineChart,
  LollipopChart,
  PieChart,
  ScatterChart,
  SparklineChart,
  StackedAreaChart,
  StackedBarChart,
} from '@real-native/charts';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type ChartKind =
  | 'line'
  | 'line-native-labels'
  | 'bar'
  | 'horizontal-bar'
  | 'horizontal-stacked-bar'
  | 'stacked-bar'
  | 'area'
  | 'stacked-area'
  | 'area-range'
  | 'scatter'
  | 'bubble'
  | 'sparkline'
  | 'histogram'
  | 'lollipop'
  | 'candlestick'
  | 'combo'
  | 'pie'
  | 'gauge';

export interface ChartStoryProps {
  kind: ChartKind;
}

const revenue = [
  { month: 'Jan', current: 42, previous: 30 },
  { month: 'Feb', current: 58, previous: 39 },
  { month: 'Mar', current: 51, previous: 45 },
  { month: 'Apr', current: 76, previous: 53 },
  { month: 'May', current: 84, previous: 62 },
  { month: 'Jun', current: 96, previous: 74 },
];

const forecast = [
  { month: 'Jul', minimum: 82, maximum: 104 },
  { month: 'Aug', minimum: 86, maximum: 112 },
  { month: 'Sep', minimum: 91, maximum: 119 },
  { month: 'Oct', minimum: 96, maximum: 126 },
];

const prices = [
  { day: 'Mon', open: 42, high: 49, low: 39, close: 47 },
  { day: 'Tue', open: 47, high: 51, low: 44, close: 46 },
  { day: 'Wed', open: 46, high: 54, low: 45, close: 52 },
  { day: 'Thu', open: 52, high: 55, low: 48, close: 50 },
  { day: 'Fri', open: 50, high: 58, low: 49, close: 57 },
];

const segments = [
  { name: 'Startup', revenue: 38, customers: 120 },
  { name: 'Growth', revenue: 67, customers: 260 },
  { name: 'Enterprise', revenue: 94, customers: 80 },
];

const performance = revenue.map((item) => ({ ...item, target: 80 }));
const orderValues = [42, 48, 51, 52, 56, 58, 58, 61, 64, 67, 71, 73, 76, 82, 91];

const colors = {
  primary: '#6750a4',
  secondary: '#00a6a6',
  surface: '#ffffff',
} as const;

const axes = {
  x: { tickCount: revenue.length, formatLabel: String },
  y: { tickCount: 5, formatLabel: (value: unknown) => `$${String(value)}k` },
};

function renderChart(kind: ChartKind) {
  switch (kind) {
    case 'line':
      return (
        <LineChart
          accessibilityLabel="Monthly revenue for the current and previous period"
          axes={axes}
          curve="monotoneX"
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary },
            { key: 'previous', color: colors.secondary },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'line-native-labels':
      return (
        <LineChart
          accessibilityLabel="Monthly revenue with native axis labels"
          axes={{ ...axes, labelMode: 'native' }}
          curve="monotoneX"
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary },
            { key: 'previous', color: colors.secondary },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'bar':
      return (
        <BarChart
          accessibilityLabel="Monthly revenue comparison as grouped bars"
          axes={axes}
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary },
            { key: 'previous', color: colors.secondary },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'horizontal-bar':
      return (
        <HorizontalBarChart
          accessibilityLabel="Monthly revenue comparison as horizontal bars"
          axes={axes}
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary },
            { key: 'previous', color: colors.secondary },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'horizontal-stacked-bar':
      return (
        <HorizontalStackedBarChart
          accessibilityLabel="Current and previous revenue stacked horizontally"
          axes={axes}
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary },
            { key: 'previous', color: colors.secondary },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'stacked-bar':
      return (
        <StackedBarChart
          accessibilityLabel="Current and previous monthly revenue stacked"
          axes={axes}
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary },
            { key: 'previous', color: colors.secondary },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'area':
      return (
        <AreaChart
          accessibilityLabel="Monthly revenue growth area"
          axes={axes}
          curve="monotoneX"
          data={revenue}
          height={300}
          series={[{ key: 'current', color: colors.primary, fillOpacity: 0.28 }]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'stacked-area':
      return (
        <StackedAreaChart
          accessibilityLabel="Current and previous revenue as stacked areas"
          axes={axes}
          curve="monotoneX"
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary, fillOpacity: 0.7 },
            { key: 'previous', color: colors.secondary, fillOpacity: 0.5 },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'area-range':
      return (
        <AreaRangeChart
          accessibilityLabel="Monthly minimum and maximum revenue forecast"
          axes={{ ...axes, x: { ...axes.x, tickCount: forecast.length } }}
          color={colors.primary}
          data={forecast}
          height={300}
          lowerKey="minimum"
          theme={{ backgroundColor: colors.surface }}
          upperKey="maximum"
          xKey="month"
        />
      );
    case 'scatter':
      return (
        <ScatterChart
          accessibilityLabel="Monthly revenue observations"
          axes={axes}
          data={revenue}
          height={300}
          series={[
            { key: 'current', color: colors.primary },
            { key: 'previous', color: colors.secondary },
          ]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'bubble':
      return (
        <BubbleChart
          accessibilityLabel="Revenue and customer volume by segment"
          axes={{ ...axes, x: { ...axes.x, tickCount: segments.length } }}
          color={colors.primary}
          data={segments}
          height={300}
          sizeKey="customers"
          theme={{ backgroundColor: colors.surface }}
          xKey="name"
          yKey="revenue"
        />
      );
    case 'sparkline':
      return (
        <SparklineChart
          accessibilityLabel="Compact monthly revenue trend"
          data={revenue}
          series={[{ key: 'current', color: colors.primary }]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'histogram':
      return (
        <HistogramChart
          accessibilityLabel="Distribution of order values"
          axes={axes}
          color={colors.primary}
          height={300}
          theme={{ backgroundColor: colors.surface }}
          values={orderValues}
        />
      );
    case 'lollipop':
      return (
        <LollipopChart
          accessibilityLabel="Monthly revenue as lollipop markers"
          axes={axes}
          color={colors.primary}
          data={revenue}
          height={300}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
          yKey="current"
        />
      );
    case 'candlestick':
      return (
        <CandlestickChart
          accessibilityLabel="Weekly open high low and close prices"
          axes={axes}
          closeKey="close"
          data={prices}
          height={300}
          highKey="high"
          lowKey="low"
          openKey="open"
          theme={{ backgroundColor: colors.surface }}
          xKey="day"
        />
      );
    case 'combo':
      return (
        <ComboChart
          accessibilityLabel="Monthly revenue bars and target line"
          axes={axes}
          barSeries={[{ key: 'current', color: colors.primary }]}
          data={performance}
          height={300}
          lineSeries={[{ key: 'target', color: colors.secondary }]}
          theme={{ backgroundColor: colors.surface }}
          xKey="month"
        />
      );
    case 'pie':
      return (
        <PieChart
          accessibilityLabel="Revenue split between product and services"
          data={[
            { label: 'Product', value: 68, color: colors.primary },
            { label: 'Services', value: 32, color: colors.secondary },
          ]}
          height={300}
          innerRadius="45%"
          theme={{ backgroundColor: colors.surface }}
        />
      );
    case 'gauge':
      return (
        <GaugeChart
          accessibilityLabel="Revenue target attainment at 84 percent"
          height={220}
          max={100}
          theme={{ backgroundColor: colors.surface }}
          value={84}
        />
      );
  }
}

export function ChartStory({ kind }: ChartStoryProps) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.card} testID={`chart-story-${kind}`}>
        {renderChart(kind)}
      </View>
    </GestureHandlerRootView>
  );
}

const storyBackground = '#f7f2fa';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    width: 720,
  },
  root: {
    alignItems: 'center',
    backgroundColor: storyBackground,
    justifyContent: 'center',
    minHeight: 380,
    padding: 24,
  },
});
