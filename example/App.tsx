import { LineChart } from '@real-native/charts';
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
  },
});
