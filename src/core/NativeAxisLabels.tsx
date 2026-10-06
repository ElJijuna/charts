import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ChartAxesConfig, ChartPoint, ChartPointsLayout } from '@/cartesian/types';
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

// Mirrors Victory's point placement: numeric X data is sorted and placed by value,
// categories by their index. Positions are relative to the chart view.
export function computeChartPoints<TDatum extends ChartDatum, TYKey extends keyof TDatum>(
  data: readonly TDatum[],
  xKey: keyof TDatum,
  yKeys: readonly TYKey[],
  scales: AxisScales,
): ChartPointsLayout<TDatum, TYKey> {
  const isNumericalData = data.every((datum) => typeof datum[xKey] === 'number');
  const rows = isNumericalData
    ? [...data].sort((a, b) => Number(a[xKey]) - Number(b[xKey]))
    : [...data];
  const points = {} as Record<TYKey, ChartPoint<TDatum[keyof TDatum]>[]>;
  for (const key of yKeys) {
    points[key] = rows.map((datum, index) => {
      const xValue = datum[xKey];
      const value = datum[key];
      const yValue = typeof value === 'number' && Number.isFinite(value) ? value : null;
      return {
        index,
        xValue,
        yValue,
        x: scales.x(isNumericalData ? Number(xValue) : index) ?? 0,
        y: yValue === null ? null : (scales.y(yValue) ?? null),
      };
    });
  }
  const [left, right] = [Math.min(...scales.x.range()), Math.max(...scales.x.range())];
  const [top, bottom] = [Math.min(...scales.y.range()), Math.max(...scales.y.range())];
  return { points, chartBounds: { left, right, top, bottom } };
}

export function useChartOverlay<TDatum extends ChartDatum, TYKey extends keyof TDatum>(
  axesProp: ChartAxesConfig | false | undefined,
  theme: ChartTheme,
  padding: number,
  data: readonly TDatum[],
  xKey: keyof TDatum,
  yKeys: readonly TYKey[] = [],
  renderOverlay?: (layout: ChartPointsLayout<TDatum, TYKey>) => ReactNode,
) {
  const axes = axesProp || undefined;
  const nativeLabels = axes?.labelMode === 'native';
  const [scales, setScales] = useState<AxisScales | null>(null);
  const onScaleChange = useCallback((x: AxisScale, y: AxisScale) => setScales({ x, y }), []);
  const xSpace = axes?.labelSpace?.x ?? defaultXLabelSpace;
  const ySpace = axes?.labelSpace?.y ?? defaultYLabelSpace;
  const chartPadding = useMemo(
    () =>
      nativeLabels
        ? { top: padding, right: padding, bottom: padding + xSpace, left: padding + ySpace }
        : padding,
    [nativeLabels, padding, xSpace, ySpace],
  );
  const layout = useMemo(
    () => (renderOverlay && scales ? computeChartPoints(data, xKey, yKeys, scales) : null),
    [renderOverlay, scales, data, xKey, yKeys],
  );

  return {
    padding: chartPadding,
    onScaleChange: nativeLabels || renderOverlay ? onScaleChange : undefined,
    overlay: scales ? (
      <>
        {nativeLabels && axes ? (
          <NativeAxisLabels
            axes={axes}
            theme={theme}
            scales={scales}
            data={data}
            xKey={String(xKey)}
          />
        ) : null}
        {layout && renderOverlay ? (
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {renderOverlay(layout)}
          </View>
        ) : null}
      </>
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
