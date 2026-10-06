import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ChartAxesConfig } from '@/cartesian/types';
import type { ChartTheme } from '@/theme/types';
import type { ChartDatum } from '@/types/data';

// Structural subset of the d3 linear scales Victory reports through `onScaleChange`.
export interface AxisScale {
  (value: number): number | undefined;
  ticks(count?: number): number[];
  range(): number[];
}

interface AxisScales {
  x: AxisScale;
  y: AxisScale;
}

const defaultTickCount = 5;
const defaultXLabelSpace = 20;
const defaultYLabelSpace = 40;
const labelGap = 4;
const xLabelWidth = 80;
const yLabelHeight = 16;

// Mirrors victory-native's downsampleTicks for category indices.
export function sampleIndexTicks(length: number, tickCount: number): number[] {
  if (tickCount <= 0) {
    return [];
  }
  const indices = Array.from({ length }, (_, index) => index);
  if (length <= tickCount) {
    return indices;
  }
  if (tickCount === 1) {
    return [0];
  }
  const lastIndex = length - 1;
  return Array.from({ length: tickCount }, (_, i) => Math.round((i * lastIndex) / (tickCount - 1)));
}

export function useNativeAxisLabels<TDatum extends ChartDatum>(
  axes: ChartAxesConfig | undefined,
  theme: ChartTheme,
  padding: number,
  data: readonly TDatum[],
  xKey: keyof TDatum,
) {
  const enabled = axes?.labelMode === 'native';
  const [scales, setScales] = useState<AxisScales | null>(null);
  const onScaleChange = useCallback((x: AxisScale, y: AxisScale) => setScales({ x, y }), []);
  const xSpace = axes?.labelSpace?.x ?? defaultXLabelSpace;
  const ySpace = axes?.labelSpace?.y ?? defaultYLabelSpace;
  const chartPadding = useMemo(
    () =>
      enabled
        ? { top: padding, right: padding, bottom: padding + xSpace, left: padding + ySpace }
        : padding,
    [enabled, padding, xSpace, ySpace],
  );

  return {
    padding: chartPadding,
    onScaleChange: enabled ? onScaleChange : undefined,
    overlay:
      enabled && scales ? (
        <NativeAxisLabels
          axes={axes}
          theme={theme}
          scales={scales}
          data={data}
          xKey={String(xKey)}
        />
      ) : null,
  };
}

interface NativeAxisLabelsProps {
  axes: ChartAxesConfig;
  theme: ChartTheme;
  scales: AxisScales;
  data: readonly ChartDatum[];
  xKey: string;
}

function NativeAxisLabels({ axes, theme, scales, data, xKey }: NativeAxisLabelsProps): ReactNode {
  // Same tick rules as Victory, so labels line up with its grid lines.
  const values = data.map((datum) => datum[xKey]);
  const isNumericalData = values.every((value) => typeof value === 'number');
  const xTickCount = axes.x?.tickCount ?? defaultTickCount;
  const xTicks = isNumericalData
    ? scales.x.ticks(xTickCount)
    : sampleIndexTicks(values.length, xTickCount);
  const yTicks = scales.y.ticks(axes.y?.tickCount ?? defaultTickCount);
  const plotLeft = Math.min(...scales.x.range());
  const plotBottom = Math.max(...scales.y.range());
  const formatX = axes.x?.formatLabel ?? String;
  const formatY = axes.y?.formatLabel ?? String;
  const xColor = axes.x?.labelColor ?? theme.labelColor;
  const yColor = axes.y?.labelColor ?? theme.labelColor;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {xTicks.map((tick) => (
        <View
          key={`x-${tick}`}
          style={[
            styles.xLabel,
            { left: (scales.x(tick) ?? 0) - xLabelWidth / 2, top: plotBottom + labelGap },
          ]}
        >
          <Text numberOfLines={1} style={[styles.text, { color: xColor }, axes.labelStyle]}>
            {formatX(isNumericalData ? tick : values[tick])}
          </Text>
        </View>
      ))}
      {yTicks.map((tick) => (
        <View
          key={`y-${tick}`}
          style={[
            styles.yLabel,
            {
              width: Math.max(plotLeft - labelGap, 0),
              top: (scales.y(tick) ?? 0) - yLabelHeight / 2,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[styles.text, styles.yText, { color: yColor }, axes.labelStyle]}
          >
            {formatY(tick)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  xLabel: { position: 'absolute', width: xLabelWidth, alignItems: 'center' },
  yLabel: { position: 'absolute', left: 0, height: yLabelHeight, justifyContent: 'center' },
  text: { fontSize: 12 },
  yText: { textAlign: 'right' },
});
