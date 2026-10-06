import { type ChartPointsLayout, LineChart, useChartPointSelection } from '@real-native/charts';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface MultiSeriesTooltipStoryProps {
  missingValues: boolean;
}

type Sample = { hour: number; actual: number | null; target: number | null };
const datasets: readonly (readonly Sample[])[] = [
  [
    { hour: 0, actual: 12, target: 20 },
    { hour: 1, actual: 24, target: null },
    { hour: 4, actual: null, target: 32 },
    { hour: 10, actual: 38, target: 35 },
    { hour: 24, actual: 28, target: 40 },
  ],
  [
    { hour: 2, actual: 18, target: 22 },
    { hour: 3, actual: null, target: 26 },
    { hour: 8, actual: 31, target: null },
    { hour: 20, actual: 42, target: 38 },
  ],
];
const completeDatasets = datasets.map((data) =>
  data.map((row) => ({ ...row, actual: row.actual ?? 26, target: row.target ?? 30 })),
);
const colors = {
  actual: '#6750a4',
  target: '#0891b2',
  text: '#0f172a',
  muted: '#475569',
  surface: '#f8fafc',
  guide: '#94a3b8',
  white: '#fff',
};
const series = [
  { key: 'actual', label: 'Actual', color: colors.actual },
  { key: 'target', label: 'Target', color: colors.target },
] as const;
const theme = { backgroundColor: 'transparent' };

// Changing the controls resets selection without remounting the chart or overlay.
export function MultiSeriesTooltipStory({ missingValues }: MultiSeriesTooltipStoryProps) {
  const [dataset, setDataset] = useState(0);
  const { activePoint, selectPoint, clearPoint } = useChartPointSelection();
  // biome-ignore lint/correctness/useExhaustiveDependencies: Changing the data control must clear selection even though the reset does not read its value.
  useEffect(() => clearPoint(), [missingValues, clearPoint]);
  const data = (missingValues ? datasets : completeDatasets)[dataset] ?? [];
  const selected = activePoint === null ? undefined : data[activePoint];
  const changeData = () => {
    clearPoint();
    setDataset((value) => (value + 1) % datasets.length);
  };

  const overlay = ({ points, chartBounds }: ChartPointsLayout<Sample, 'actual' | 'target'>) => (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {points.actual.map((point, index, all) => {
        const previous = all[index - 1];
        const next = all[index + 1];
        const left = previous ? (previous.x + point.x) / 2 : chartBounds.left;
        const right = next ? (point.x + next.x) / 2 : chartBounds.right;
        const row = data[index];
        return (
          <Pressable
            key={String(point.xValue)}
            accessibilityRole="button"
            accessibilityLabel={`Hour ${point.xValue}, Actual ${row?.actual ?? 'no value'}, Target ${row?.target ?? 'no value'}`}
            onFocus={() => selectPoint(index)}
            onHoverIn={() => selectPoint(index)}
            onPress={() => selectPoint(index)}
            style={{
              position: 'absolute',
              left,
              top: chartBounds.top,
              width: Math.max(0, right - left),
              height: chartBounds.bottom - chartBounds.top,
            }}
            testID={`multi-series-point-${index}`}
          />
        );
      })}
      {activePoint === null ? null : (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {points.actual[activePoint] ? (
            <View
              style={[
                styles.guide,
                {
                  left: points.actual[activePoint]?.x,
                  top: chartBounds.top,
                  height: chartBounds.bottom - chartBounds.top,
                },
              ]}
            />
          ) : null}
          {series.map(({ key, color }) => {
            const point = points[key][activePoint];
            return !point || point.y === null ? null : (
              <View
                key={key}
                style={[
                  styles.marker,
                  { left: point.x - 5, top: point.y - 5, backgroundColor: color },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container} testID="multi-series-view">
      <Text style={styles.title}>Activity over irregular intervals</Text>
      <Text style={styles.description}>
        Hover, focus or tap a point. Gaps mean no value was recorded.
      </Text>
      <View style={styles.tooltip} testID="multi-series-tooltip">
        <Text style={styles.description}>
          {selected ? `Hour ${selected.hour}` : 'Select a point'}
        </Text>
        {series.map(({ key, label, color }) => (
          <Text key={key} style={{ color }}>
            {label}: {selected ? (selected[key] ?? 'No value') : '—'}
          </Text>
        ))}
      </View>
      <LineChart
        accessibilityLabel="Actual and target activity over irregular hourly intervals"
        animate={false}
        axes={false}
        data={data}
        height={240}
        padding={20}
        renderOverlay={overlay}
        series={series}
        testID="multi-series-chart"
        theme={theme}
        xKey="hour"
      />
      <Pressable accessibilityRole="button" onPress={changeData} style={styles.button}>
        <Text style={styles.buttonLabel}>Change data and clear selection</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 680, padding: 16, gap: 12 },
  title: { color: colors.text, fontSize: 20, fontWeight: '600' },
  description: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  tooltip: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, gap: 4 },
  guide: { position: 'absolute', width: 1, backgroundColor: colors.guide },
  marker: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
  },
  button: { alignSelf: 'flex-start', backgroundColor: colors.actual, borderRadius: 8, padding: 12 },
  buttonLabel: { color: colors.white, fontWeight: '600' },
});
