import {
  AreaChart,
  BarChart,
  CandlestickChart,
  HorizontalBarChart,
  HorizontalStackedBarChart,
  LineChart,
  PieChart,
  ScatterChart,
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
