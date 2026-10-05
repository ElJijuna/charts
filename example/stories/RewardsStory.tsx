import { AreaChart, LineChart } from '@real-native/charts';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export interface RewardsStoryProps {
  variant: 'line' | 'area';
}

type Period = 'week' | 'month' | 'year';

const periods: { key: Period; label: string }[] = [
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'year', label: 'Año' },
];

// Example points earned per day, week or month (not a cumulative balance).
const rewards = {
  week: {
    caption: 'Puntos ganados esta semana',
    labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    values: [40, 65, 30, 90, 70, 120, 85],
  },
  month: {
    caption: 'Puntos ganados este mes',
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    values: [320, 450, 380, 500],
  },
  year: {
    caption: 'Puntos ganados este año',
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    values: [950, 1200, 1080, 1450, 1320, 1680, 1540, 1820, 1720, 2050, 1940, 2300],
  },
};

const theme = {
  backgroundColor: 'transparent',
  axisColor: 'transparent',
  labelColor: 'transparent',
};

const numberFormat = new Intl.NumberFormat('es-PE');

export function RewardsStory({ variant }: RewardsStoryProps) {
  const [period, setPeriod] = useState<Period>('week');
  const { width } = useWindowDimensions();
  const selected = rewards[period];
  const total = selected.values.reduce((sum, value) => sum + value, 0);
  const data = selected.values.map((points, index) => ({ bucket: index, points }));
  const chartProps = {
    data,
    xKey: 'bucket' as const,
    height: 112,
    padding: 8,
    curve: 'monotoneX' as const,
    theme,
    accessibilityLabel: `${selected.caption}: ${numberFormat.format(total)} puntos. ${selected.values
      .map((value, index) => `${selected.labels[index]}: ${value}`)
      .join(', ')}`,
    testID: 'rewards-chart',
  };

  return (
    <GestureHandlerRootView
      style={[styles.root, { width: Math.min(360, width - 32) }]}
      testID="rewards-view"
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MIS RECOMPENSAS</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Puntos de Alex
          </Text>
        </View>
        <Text accessibilityLabel="Programa de recompensas" style={styles.badge}>
          Rewards
        </Text>
      </View>

      <View accessibilityLabel="Seleccionar período" style={styles.selector}>
        {periods.map(({ key, label }) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected: period === key }}
            aria-selected={period === key}
            onPress={() => setPeriod(key)}
            style={({ pressed }) => [
              styles.period,
              period === key && styles.selectedPeriod,
              pressed && styles.pressedPeriod,
            ]}
          >
            <Text style={[styles.periodLabel, period === key && styles.selectedLabel]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summary}>
        <Text accessibilityLiveRegion="polite" style={styles.total} testID="rewards-total">
          {numberFormat.format(total)} <Text style={styles.unit}>pts</Text>
        </Text>
        <Text style={styles.caption} testID="rewards-caption">
          {selected.caption}
        </Text>
      </View>

      {variant === 'line' ? (
        <LineChart
          key={period}
          {...chartProps}
          series={[{ key: 'points', color: '#6d28d9', strokeWidth: 2.5 }]}
        />
      ) : (
        <AreaChart
          key={period}
          {...chartProps}
          series={[{ key: 'points', color: '#6d28d9', fillOpacity: 0.2 }]}
        />
      )}

      <View accessible={false} style={styles.labels}>
        {selected.labels.map((label, index) => (
          <Text key={label} style={styles.axisLabel}>
            {period === 'year' && index % 2 !== 0 ? '' : label}
          </Text>
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: 'transparent', gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: '#6b7280', fontSize: 10, fontWeight: '600', letterSpacing: 1.4 },
  title: { color: '#111827', fontSize: 18, fontWeight: '600', marginTop: 4 },
  badge: { color: '#6d28d9', fontSize: 12, fontWeight: '600' },
  selector: { flexDirection: 'row', gap: 4 },
  period: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  selectedPeriod: { backgroundColor: 'rgba(109, 40, 217, 0.09)' },
  pressedPeriod: { opacity: 0.65 },
  periodLabel: { color: '#6b7280', fontSize: 13, fontWeight: '500' },
  selectedLabel: { color: '#6d28d9', fontWeight: '700' },
  summary: { gap: 4 },
  total: { color: '#111827', fontSize: 32, fontWeight: '700', letterSpacing: -1 },
  unit: { color: '#6b7280', fontSize: 14, fontWeight: '500', letterSpacing: 0 },
  caption: { color: '#6b7280', fontSize: 12 },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: -12,
  },
  axisLabel: { color: '#6b7280', fontSize: 10 },
});
