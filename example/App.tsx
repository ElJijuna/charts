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
  PieChart,
  ScatterChart,
  SparklineChart,
  StackedAreaChart,
  StackedBarChart,
} from '@real-native/charts';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const revenue = [
  { month: 'Jan', current: 42, previous: 30 },
  { month: 'Feb', current: 58, previous: 39 },
  { month: 'Mar', current: 51, previous: 45 },
  { month: 'Apr', current: 76, previous: 53 },
  { month: 'May', current: 84, previous: 62 },
  { month: 'Jun', current: 96, previous: 74 },
];

const prices = [
  { day: 'Mon', open: 42, high: 49, low: 39, close: 47 },
  { day: 'Tue', open: 47, high: 51, low: 44, close: 46 },
  { day: 'Wed', open: 46, high: 54, low: 45, close: 52 },
  { day: 'Thu', open: 52, high: 55, low: 48, close: 50 },
  { day: 'Fri', open: 50, high: 58, low: 49, close: 57 },
];

const forecast = [
  { month: 'Jul', minimum: 82, maximum: 104 },
  { month: 'Aug', minimum: 86, maximum: 112 },
  { month: 'Sep', minimum: 91, maximum: 119 },
  { month: 'Oct', minimum: 96, maximum: 126 },
];

const performance = revenue.map((item) => ({ ...item, target: 80 }));

const orderValues = [42, 48, 51, 52, 56, 58, 58, 61, 64, 67, 71, 73, 76, 82, 91];

const segments = [
  { name: 'Startup', revenue: 38, customers: 120 },
  { name: 'Growth', revenue: 67, customers: 260 },
  { name: 'Enterprise', revenue: 94, customers: 80 },
];

const colors = {
  background: '#f7f2fa',
  primary: '#6750a4',
  secondary: '#00a6a6',
  surface: '#ffffff',
  text: '#1d1b20',
  textMuted: '#49454f',
  shadow: '#000000',
} as const;

export function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>@real-native/charts</Text>
          <Text style={styles.title}>Revenue overview</Text>
          <Text style={styles.subtitle}>
            A typed LineChart rendered by Victory Native and Skia.
          </Text>
        </View>

        <View style={styles.card}>
          <LineChart
            accessibilityLabel="Monthly revenue for the current and previous period"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            curve="monotoneX"
            data={revenue}
            height={300}
            series={[
              { key: 'current', label: 'Current period', color: colors.primary },
              {
                key: 'previous',
                label: 'Previous period',
                color: colors.secondary,
                strokeWidth: 2,
              },
            ]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Grouped comparison</Text>
          <BarChart
            accessibilityLabel="Monthly revenue comparison as grouped bars"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            data={revenue}
            height={300}
            series={[
              { key: 'current', label: 'Current period', color: colors.primary },
              { key: 'previous', label: 'Previous period', color: colors.secondary },
            ]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Horizontal comparison</Text>
          <HorizontalBarChart
            accessibilityLabel="Monthly revenue comparison as horizontal bars"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            data={revenue}
            height={300}
            series={[
              { key: 'current', color: colors.primary },
              { key: 'previous', color: colors.secondary },
            ]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Horizontal total</Text>
          <HorizontalStackedBarChart
            accessibilityLabel="Current and previous monthly revenue stacked horizontally"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            data={revenue}
            height={300}
            innerPadding={0.2}
            series={[
              { key: 'current', color: colors.primary },
              { key: 'previous', color: colors.secondary },
            ]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Combined revenue</Text>
          <StackedBarChart
            accessibilityLabel="Current and previous monthly revenue stacked"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            data={revenue}
            height={300}
            innerPadding={0.2}
            series={[
              { key: 'current', color: colors.primary },
              { key: 'previous', color: colors.secondary },
            ]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Growth area</Text>
          <AreaChart
            accessibilityLabel="Monthly revenue growth area"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            curve="monotoneX"
            data={revenue}
            height={300}
            series={[{ key: 'current', color: colors.primary, fillOpacity: 0.28 }]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue composition</Text>
          <StackedAreaChart
            accessibilityLabel="Current and previous revenue as stacked areas"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
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
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue forecast</Text>
          <AreaRangeChart
            accessibilityLabel="Monthly minimum and maximum revenue forecast"
            axes={{
              x: { tickCount: forecast.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            color={colors.primary}
            curve="monotoneX"
            data={forecast}
            height={300}
            lowerKey="minimum"
            theme={{ backgroundColor: colors.surface }}
            upperKey="maximum"
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue observations</Text>
          <ScatterChart
            accessibilityLabel="Monthly revenue observations"
            axes={{
              x: { tickCount: revenue.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            data={revenue}
            height={300}
            radius={6}
            series={[
              { key: 'current', color: colors.primary },
              { key: 'previous', color: colors.secondary },
            ]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Segment performance</Text>
          <BubbleChart
            accessibilityLabel="Revenue and customer volume by segment"
            axes={{
              x: { tickCount: segments.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            color={colors.primary}
            data={segments}
            height={300}
            sizeKey="customers"
            theme={{ backgroundColor: colors.surface }}
            xKey="name"
            yKey="revenue"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue trend</Text>
          <SparklineChart
            accessibilityLabel="Compact monthly revenue trend"
            data={revenue}
            series={[{ key: 'current', color: colors.primary, strokeWidth: 3 }]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order distribution</Text>
          <HistogramChart
            accessibilityLabel="Distribution of order values"
            axes={{
              x: { tickCount: 6, formatLabel: (value) => `$${Math.round(Number(value))}` },
              y: { tickCount: 4, formatLabel: String },
            }}
            binCount={6}
            color={colors.primary}
            height={300}
            theme={{ backgroundColor: colors.surface }}
            values={orderValues}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly price</Text>
          <CandlestickChart
            accessibilityLabel="Weekly open high low and close prices"
            axes={{
              x: { tickCount: prices.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}` },
            }}
            closeKey="close"
            data={prices}
            height={300}
            highKey="high"
            lowKey="low"
            openKey="open"
            theme={{ backgroundColor: colors.surface }}
            xKey="day"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue versus target</Text>
          <ComboChart
            accessibilityLabel="Monthly revenue bars and target line"
            axes={{
              x: { tickCount: performance.length, formatLabel: String },
              y: { tickCount: 5, formatLabel: (value) => `$${String(value)}k` },
            }}
            barSeries={[{ key: 'current', color: colors.primary }]}
            curve="monotoneX"
            data={performance}
            height={300}
            lineSeries={[{ key: 'target', color: colors.secondary, strokeWidth: 3 }]}
            theme={{ backgroundColor: colors.surface }}
            xKey="month"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue mix</Text>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Target attainment</Text>
          <GaugeChart
            accessibilityLabel="Revenue target attainment at 84 percent"
            height={220}
            max={100}
            theme={{ backgroundColor: colors.surface }}
            trackColor="#e7e0ec"
            value={84}
            valueColor={colors.primary}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  heading: {
    marginBottom: 24,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
});
