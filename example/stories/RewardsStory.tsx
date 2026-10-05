import { AreaChart, LineChart, useChartPointSelection } from '@real-native/charts';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  type GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

// Prepare each example period once; hover never changes these references.
function prepareRewards(selected: (typeof rewards)[Period]) {
  const total = selected.values.reduce((sum, value) => sum + value, 0);
  return {
    total,
    data: selected.values.map((points, bucket) => ({ bucket, points })),
    accessibilityLabel: `${selected.caption}: ${numberFormat.format(total)} puntos. ${selected.values
      .map((value, index) => `${selected.labels[index]}: ${value}`)
      .join(', ')}`,
  };
}

const preparedRewards = {
  week: prepareRewards(rewards.week),
  month: prepareRewards(rewards.month),
  year: prepareRewards(rewards.year),
};
const lineSeries = [{ key: 'points', color: '#6d28d9', strokeWidth: 2.5 }] as const;
const areaSeries = [{ key: 'points', color: '#6d28d9', fillOpacity: 0.2 }] as const;

const RewardsPlot = memo(function RewardsPlot({
  period,
  variant,
}: RewardsStoryProps & { period: Period }) {
  const { data, accessibilityLabel } = preparedRewards[period];
  const chartProps = {
    data,
    xKey: 'bucket' as const,
    height: 112,
    padding: 8,
    curve: 'monotoneX' as const,
    theme,
    accessibilityLabel,
    testID: 'rewards-chart',
  };
  return variant === 'line' ? (
    <LineChart key={period} {...chartProps} series={lineSeries} />
  ) : (
    <AreaChart key={period} {...chartProps} series={areaSeries} />
  );
});

function RewardsInteraction({ period, chartWidth }: { period: Period; chartWidth: number }) {
  const { activePoint, selectPoint, clearPoint } = useChartPointSelection();
  const selected = rewards[period];
  const touchOrigin = useRef(0);
  const touchStartX = useRef(0);
  const dragged = useRef(false);
  const step = Math.max(0, chartWidth - 16) / (selected.values.length - 1);
  const targets = useMemo(
    () =>
      selected.values.map((points, index) => {
        const position = 8 + index * step;
        const left = index === 0 ? 0 : position - step / 2;
        const right = index === selected.values.length - 1 ? chartWidth : position + step / 2;
        return {
          index,
          label: `${selected.labels[index]}: ${numberFormat.format(points)} puntos`,
          style: [styles.pointTarget, { left, width: right - left }],
          select: () => selectPoint(index),
          press: () => {
            if (!dragged.current) {
              selectPoint(index);
            }
          },
          pressStart: ({ nativeEvent }: GestureResponderEvent) => {
            touchOrigin.current = nativeEvent.pageX - nativeEvent.locationX - left;
            touchStartX.current = nativeEvent.pageX;
            dragged.current = false;
            selectPoint(index);
          },
        };
      }),
    [chartWidth, selected, selectPoint, step],
  );
  const moveTouch = useCallback(
    ({ nativeEvent }: GestureResponderEvent) => {
      // Web touch events expose coordinates on touches, while RN puts them on nativeEvent.
      const pageX = nativeEvent.pageX ?? nativeEvent.touches[0]?.pageX;
      if (!Number.isFinite(pageX)) {
        return;
      }
      if (Math.abs(pageX - touchStartX.current) > 3) {
        dragged.current = true;
      }
      if (step > 0) {
        const index = Math.round((pageX - touchOrigin.current - 8) / step);
        selectPoint(Math.max(0, Math.min(selected.values.length - 1, index)));
      }
    },
    [selected.values.length, selectPoint, step],
  );
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {targets.map(({ index, label, style, select, press, pressStart }) => (
          <Pressable
            key={`${period}-${index}`}
            accessibilityRole="button"
            accessibilityLabel={label}
            onHoverIn={select}
            onHoverOut={clearPoint}
            onPress={press}
            onFocus={() => {
              dragged.current = false;
              select();
            }}
            onBlur={clearPoint}
            onPressIn={pressStart}
            onTouchMove={moveTouch}
            onTouchEnd={() =>
              queueMicrotask(() => {
                dragged.current = false;
              })
            }
            onTouchCancel={clearPoint}
            style={style}
            testID={`rewards-point-${index}`}
          />
        ))}
      </View>
      {activePoint !== null && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View
            style={[
              styles.guide,
              {
                left:
                  8 + (activePoint * Math.max(0, chartWidth - 16)) / (selected.values.length - 1),
              },
            ]}
          />
          <View
            style={[
              styles.tooltip,
              {
                left: Math.max(
                  0,
                  Math.min(
                    chartWidth - 100,
                    8 +
                      (activePoint * Math.max(0, chartWidth - 16)) / (selected.values.length - 1) -
                      50,
                  ),
                ),
              },
            ]}
            testID="rewards-tooltip"
          >
            <Text style={styles.tooltipLabel}>{selected.labels[activePoint]}</Text>
            <Text style={styles.tooltipValue}>
              {numberFormat.format(selected.values[activePoint] ?? 0)} pts
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export function RewardsStory({ variant }: RewardsStoryProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [containerWidth, setContainerWidth] = useState(0);
  const selected = rewards[period];
  const { total } = preparedRewards[period];

  return (
    <GestureHandlerRootView
      onLayout={({ nativeEvent }) => setContainerWidth(nativeEvent.layout.width)}
      style={styles.root}
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
            onPress={() => {
              setPeriod(key);
            }}
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

      <View style={styles.chartContainer}>
        <RewardsPlot period={period} variant={variant} />
        <RewardsInteraction key={period} period={period} chartWidth={containerWidth} />
      </View>

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
  root: { backgroundColor: 'transparent', gap: 16, width: '100%', maxWidth: 360 },
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
  chartContainer: { position: 'relative' },
  pointTarget: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    ...Platform.select({ web: { touchAction: 'pan-y' as const }, default: {} }),
  },
  guide: { position: 'absolute', top: 0, bottom: 8, width: 1, backgroundColor: '#a78bfa' },
  tooltip: {
    position: 'absolute',
    top: 0,
    width: 100,
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#4c1d95',
    alignItems: 'center',
  },
  tooltipLabel: { color: '#ddd6fe', fontSize: 10 },
  tooltipValue: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: -12,
  },
  axisLabel: { color: '#6b7280', fontSize: 10 },
});
