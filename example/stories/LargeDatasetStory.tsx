import * as Charts from '@real-native/charts';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type LargeDatasetKind =
  | 'line'
  | 'area'
  | 'stacked-area'
  | 'scatter'
  | 'bubble'
  | 'bar'
  | 'histogram'
  | 'sparkline'
  | 'candlestick';

export interface LargeDatasetStoryProps {
  kind: LargeDatasetKind;
  size: number;
  animate?: boolean;
}

export interface PerformanceSample {
  kind: LargeDatasetKind;
  size: number;
  phase: 'mount' | 'update';
  /** Data generation, excluded from the render timing. */
  generateMs: number;
  /** From the start of the render until React commits (no frame waits). */
  commitMs: number;
  /**
   * From the start of the render until the main thread settles: three consecutive quiet frames.
   * Includes Victory's layout pass, its follow-up renders and Skia drawing.
   */
  settleMs: number;
}

declare global {
  interface Window {
    __chartPerformance?: PerformanceSample[];
  }
}

// Deterministic PRNG (mulberry32) so every run measures identical data.
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeries(size: number, seed: number) {
  const random = createRandom(seed);
  const rows: {
    x: number;
    a: number;
    b: number;
    open: number;
    high: number;
    low: number;
    close: number;
    size: number;
  }[] = [];
  let level = 100;
  for (let x = 0; x < size; x += 1) {
    const open = level;
    level = Math.max(1, level + (random() - 0.5) * 4);
    const close = level;
    rows.push({
      x,
      a: level,
      b: level * (0.4 + random() * 0.2),
      open,
      close,
      high: Math.max(open, close) + random() * 2,
      low: Math.min(open, close) - random() * 2,
      size: 1 + random() * 9,
    });
  }
  return rows;
}

const nextFrame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));
const quietFrameMs = 25;
const quietFramesNeeded = 3;
const settleTimeoutMs = 120_000;

// Long tasks (renders, layout, drawing) delay animation frames; the work is done once frames
// arrive on time again. Returns the time of the last busy frame.
async function waitUntilSettled(start: number) {
  let previous = await nextFrame();
  let settledAt = previous;
  let quiet = 0;
  while (quiet < quietFramesNeeded && previous - start < settleTimeoutMs) {
    const now = await nextFrame();
    if (now - previous < quietFrameMs) {
      if (quiet === 0) {
        settledAt = previous;
      }
      quiet += 1;
    } else {
      quiet = 0;
    }
    previous = now;
  }
  return settledAt;
}

interface Run {
  seed: number;
  phase: PerformanceSample['phase'];
  data: ReturnType<typeof generateSeries>;
  values: number[];
  generateMs: number;
  /** Taken after data generation, right before React renders the chart. */
  startedAt: number;
}

function createRun(size: number, seed: number, phase: Run['phase']): Run {
  const generationStart = performance.now();
  const data = generateSeries(size, seed);
  const values = data.map(({ a }) => a);
  const startedAt = performance.now();
  return { seed, phase, data, values, generateMs: startedAt - generationStart, startedAt };
}

export function LargeDatasetStory({ kind, size, animate = false }: LargeDatasetStoryProps) {
  const [run, setRun] = useState<Run | null>(null);
  const [samples, setSamples] = useState<PerformanceSample[]>([]);

  useEffect(() => {
    // Start after the placeholder paints, so page setup does not count toward the mount.
    const frame = requestAnimationFrame(() => setRun(createRun(size, 1, 'mount')));
    return () => cancelAnimationFrame(frame);
  }, [size]);

  useEffect(() => {
    if (!run) {
      return;
    }
    let cancelled = false;
    const commitMs = performance.now() - run.startedAt;
    const measure = async () => {
      const settledAt = await waitUntilSettled(run.startedAt);
      if (cancelled) {
        return;
      }
      const sample: PerformanceSample = {
        kind,
        size,
        phase: run.phase,
        generateMs: run.generateMs,
        commitMs,
        settleMs: settledAt - run.startedAt,
      };
      window.__chartPerformance = [...(window.__chartPerformance ?? []), sample];
      setSamples((current) => [...current, sample]);
    };
    void measure();
    return () => {
      cancelled = true;
    };
  }, [run, kind, size]);

  if (!run) {
    return <Text>Generating {size.toLocaleString('en-US')} points…</Text>;
  }
  const { data, values } = run;

  const common = {
    accessibilityLabel: `${kind} chart with ${size} points`,
    animate,
    height: 280,
    testID: 'large-chart',
  };
  const series = [{ key: 'a' as const }];
  const latest = samples.at(-1);

  return (
    <View style={styles.root}>
      {kind === 'line' ? (
        <Charts.LineChart {...common} data={data} xKey="x" series={series} />
      ) : null}
      {kind === 'area' ? (
        <Charts.AreaChart {...common} data={data} xKey="x" series={series} />
      ) : null}
      {kind === 'stacked-area' ? (
        <Charts.StackedAreaChart
          {...common}
          data={data}
          xKey="x"
          series={[{ key: 'a' }, { key: 'b' }]}
        />
      ) : null}
      {kind === 'scatter' ? (
        <Charts.ScatterChart {...common} data={data} xKey="x" series={series} />
      ) : null}
      {kind === 'bubble' ? (
        <Charts.BubbleChart {...common} data={data} xKey="x" yKey="a" sizeKey="size" />
      ) : null}
      {kind === 'bar' ? <Charts.BarChart {...common} data={data} xKey="x" series={series} /> : null}
      {kind === 'histogram' ? (
        <Charts.HistogramChart {...common} values={values} binCount={50} />
      ) : null}
      {kind === 'sparkline' ? (
        <Charts.SparklineChart {...common} data={data} xKey="x" series={series} />
      ) : null}
      {kind === 'candlestick' ? (
        <Charts.CandlestickChart
          {...common}
          data={data}
          xKey="x"
          openKey="open"
          highKey="high"
          lowKey="low"
          closeKey="close"
        />
      ) : null}
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setRun(createRun(size, run.seed + 1, 'update'))}
          style={styles.button}
          testID="update-data"
        >
          <Text style={styles.buttonText}>Update data</Text>
        </Pressable>
        <Text testID="performance-result">
          {latest
            ? `${latest.phase} ${size.toLocaleString('en-US')} points: commit ${latest.commitMs.toFixed(1)} ms, settle ${latest.settleMs.toFixed(1)} ms, data ${latest.generateMs.toFixed(1)} ms (${samples.length} samples)`
            : 'Measuring…'}
        </Text>
      </View>
    </View>
  );
}

const colors = {
  surface: '#ffffff',
  primary: '#6750a4',
  onPrimary: '#ffffff',
} as const;

const styles = StyleSheet.create({
  root: { gap: 12, padding: 16, backgroundColor: colors.surface },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: { color: colors.onPrimary },
});
