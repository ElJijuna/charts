import { LineChart } from '@real-native/charts';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export interface ChartStatesStoryProps {
  scenario: 'label' | 'custom' | 'silent' | 'loading';
  emptyLabel: string;
  loadingDelay: number;
}

const sampleData = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 24 },
  { day: 'Wed', value: 18 },
  { day: 'Thu', value: 36 },
  { day: 'Fri', value: 28 },
];
const emptyData: typeof sampleData = [];
const colors = {
  accent: '#6750a4',
  title: '#0f172a',
  secondary: '#64748b',
  surface: '#f8fafc',
  message: '#475569',
  onAccent: '#fff',
};
const series = [{ key: 'value', color: colors.accent }] as const;
const theme = { backgroundColor: 'transparent', labelColor: colors.message };

export function ChartStatesStory(props: ChartStatesStoryProps) {
  return <ChartStatesContent key={`${props.scenario}:${props.loadingDelay}`} {...props} />;
}

function ChartStatesContent({ scenario, emptyLabel, loadingDelay }: ChartStatesStoryProps) {
  const [completedRequest, setCompletedRequest] = useState(-1);
  const [request, setRequest] = useState(0);

  useEffect(() => {
    if (scenario !== 'loading') {
      return;
    }
    const timeout = setTimeout(() => setCompletedRequest(request), loadingDelay);
    return () => clearTimeout(timeout);
  }, [scenario, loadingDelay, request]);

  const hasData = scenario === 'loading' && completedRequest === request;
  const loading = scenario === 'loading' && !hasData;
  const replay = () => {
    setRequest((value) => value + 1);
  };

  return (
    <View style={styles.container} testID="chart-states-view">
      <Text style={styles.title}>Weekly activity</Text>
      <Text style={styles.description}>
        {scenario === 'loading'
          ? 'Simulated data loading. Replay to see the chart appear again.'
          : scenario === 'silent'
            ? 'An empty chart reserves its space without showing a message.'
            : 'Change the empty message using the Storybook controls.'}
      </Text>
      <View style={styles.card}>
        <LineChart
          accessibilityLabel="Weekly activity"
          animate={false}
          axes={false}
          data={hasData ? sampleData : emptyData}
          emptyLabel={scenario === 'silent' ? undefined : loading ? 'Loading activity' : emptyLabel}
          height={220}
          renderEmpty={
            loading
              ? () => (
                  <View style={styles.empty} testID="chart-data-loading">
                    <ActivityIndicator
                      color={colors.accent}
                      accessibilityLabel="Loading activity"
                    />
                    <Text style={styles.message}>Loading activity…</Text>
                  </View>
                )
              : scenario === 'custom'
                ? () => (
                    <View style={styles.empty} testID="chart-custom-empty">
                      <Text style={styles.message}>{emptyLabel}</Text>
                      <Text style={styles.description}>Your activity will appear here.</Text>
                    </View>
                  )
                : undefined
          }
          series={series}
          testID="chart-states-chart"
          theme={theme}
          xKey="day"
        />
      </View>
      {scenario === 'loading' ? (
        <Pressable accessibilityRole="button" onPress={replay} style={styles.button}>
          <Text style={styles.buttonLabel}>Replay loading</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 640, padding: 16, gap: 12 },
  title: { color: colors.title, fontSize: 20, fontWeight: '600' },
  description: { color: colors.secondary, fontSize: 13, lineHeight: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' },
  empty: { alignItems: 'center', gap: 8, padding: 16 },
  message: { color: colors.message, fontSize: 14, textAlign: 'center' },
  button: { alignSelf: 'flex-start', backgroundColor: colors.accent, borderRadius: 8, padding: 12 },
  buttonLabel: { color: colors.onAccent, fontWeight: '600' },
});
