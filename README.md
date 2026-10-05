# @real-native/charts

Friendly, customizable charts for React Native and web, powered by Victory Native and Skia.

[![CI][badge-ci]][workflow-ci]
[![Release][badge-release]][workflow-release]
[![npm][badge-npm]][npm-package]
[![License: MIT][badge-license]][license]
[![Branch coverage: 95.67%][badge-coverage]][coverage-tests]
[![Web chart support: 100% in Chromium][badge-web]][web-tests]

![React Native][badge-rn]
![Expo][badge-expo]
![TypeScript][badge-ts]
![Victory Native][badge-victory]
![Skia][badge-skia]
![Reanimated][badge-reanimated]
![React Native Web][badge-rnweb]
![Gesture Handler][badge-gestures]

## Web compatibility

**100% of chart types render on web in the tested Chromium setup (17/17).**
Validated on October 5, 2026 with the production Storybook build and
[`example/e2e/charts.spec.ts`][web-tests]. Each test checks a visible canvas,
nonzero dimensions, rendered image output and the absence of page errors.

| Validation scope | Result |
| --- | --- |
| Chart types in Chromium | 17/17 passed (100%) |
| Firefox | Pending validation |
| Safari | Pending validation |
| Unit test branch coverage | 95.67% (354/370 branches), 103 passing tests |

The web percentage measures chart type rendering in this setup. Browser-wide compatibility,
accessibility and every interaction are separate checks tracked in the [roadmap][roadmap].
Web apps need React Native Web, a `GestureHandlerRootView`, and Skia's CanvasKit WASM loaded
before rendering charts. The example Storybook demonstrates this setup.

## Chart gallery

Actual screenshots from the web Storybook. Images use GitHub raw URLs so the gallery
also works when this README is displayed outside the repository, including npm.

| Chart | Chart |
| --- | --- |
| **Line**<br>![Line chart preview][chart-line] | **Bar**<br>![Bar chart preview][chart-bar] |
| **Horizontal Bar**<br>![Horizontal Bar chart preview][chart-horizontal-bar] | **Horizontal Stacked Bar**<br>![Horizontal Stacked Bar chart preview][chart-horizontal-stacked-bar] |
| **Stacked Bar**<br>![Stacked Bar chart preview][chart-stacked-bar] | **Area**<br>![Area chart preview][chart-area] |
| **Stacked Area**<br>![Stacked Area chart preview][chart-stacked-area] | **Area Range**<br>![Area Range chart preview][chart-area-range] |
| **Scatter**<br>![Scatter chart preview][chart-scatter] | **Bubble**<br>![Bubble chart preview][chart-bubble] |
| **Sparkline**<br>![Sparkline chart preview][chart-sparkline] | **Histogram**<br>![Histogram chart preview][chart-histogram] |
| **Lollipop**<br>![Lollipop chart preview][chart-lollipop] | **Candlestick**<br>![Candlestick chart preview][chart-candlestick] |
| **Combo**<br>![Combo chart preview][chart-combo] | **Pie**<br>![Pie chart preview][chart-pie] |
| **Gauge**<br>![Gauge chart preview][chart-gauge] | — |

## Installation

```sh
npm install @real-native/charts victory-native @shopify/react-native-skia react-native-gesture-handler react-native-reanimated
```

Follow the Reanimated and Skia installation instructions for your React Native or Expo version.

## Usage

```tsx
import { BarChart, LineChart } from '@real-native/charts';

const data = [
  { month: 1, revenue: 12 },
  { month: 2, revenue: 18 },
  { month: 3, revenue: 15 },
];

export function RevenueChart() {
  return (
    <LineChart
      data={data}
      xKey="month"
      series={[{ key: 'revenue', label: 'Revenue', color: '#6750a4' }]}
      curve="monotoneX"
    />
  );
}
```

`BarChart` shares the same data, series, axes, theme, and animation configuration:

```tsx
<BarChart
  data={data}
  xKey="month"
  series={[{ key: 'revenue', color: '#6750a4' }]}
  groupPadding={0.25}
  barPadding={0.1}
  cornerRadius={6}
/>
```

`StackedBarChart` displays series as cumulative segments for each category:

```tsx
<StackedBarChart
  data={data}
  xKey="month"
  series={[
    { key: 'revenue', color: '#6750a4' },
    { key: 'cost', color: '#00a6a6' },
  ]}
  innerPadding={0.2}
/>
```

`HorizontalBarChart` is useful for rankings and longer category labels:

```tsx
<HorizontalBarChart
  data={data}
  xKey="month"
  series={[{ key: 'revenue', color: '#6750a4' }]}
/>
```

`HorizontalStackedBarChart` combines cumulative series with horizontal categories:

```tsx
<HorizontalStackedBarChart
  data={data}
  xKey="month"
  series={[
    { key: 'revenue', color: '#6750a4' },
    { key: 'cost', color: '#00a6a6' },
  ]}
/>
```

`AreaChart` adds curve selection, fill opacity, and missing-data handling:

```tsx
<AreaChart
  data={data}
  xKey="month"
  series={[{ key: 'revenue', color: '#6750a4', fillOpacity: 0.28 }]}
  curve="monotoneX"
  connectMissingData
/>
```

`StackedAreaChart` shows how each series contributes to a cumulative total:

```tsx
<StackedAreaChart
  data={data}
  xKey="month"
  series={[
    { key: 'revenue', fillOpacity: 0.7 },
    { key: 'cost', fillOpacity: 0.5 },
  ]}
  curve="monotoneX"
/>
```

`AreaRangeChart` fills the interval between lower and upper values:

```tsx
<AreaRangeChart
  data={forecast}
  xKey="month"
  lowerKey="minimum"
  upperKey="maximum"
  curve="monotoneX"
/>
```

`ScatterChart` renders one point set per series and supports three marker shapes:

```tsx
<ScatterChart
  data={data}
  xKey="month"
  series={[{ key: 'revenue', color: '#6750a4' }]}
  radius={6}
  shape="circle"
/>
```

`BubbleChart` scales each point using a third numeric field:

```tsx
<BubbleChart
  data={segments}
  xKey="name"
  yKey="revenue"
  sizeKey="customers"
/>
```

`CandlestickChart` renders typed open-high-low-close financial data:

```tsx
<CandlestickChart
  data={prices}
  xKey="day"
  openKey="open"
  highKey="high"
  lowKey="low"
  closeKey="close"
/>
```

`ComboChart` overlays line series on grouped bars using a shared scale:

```tsx
<ComboChart
  data={data}
  xKey="month"
  barSeries={[{ key: 'revenue' }]}
  lineSeries={[{ key: 'target', strokeWidth: 3 }]}
/>
```

`SparklineChart` renders a compact, axis-free trend for cards and lists:

```tsx
<SparklineChart
  data={data}
  xKey="month"
  series={[{ key: 'revenue', color: '#6750a4' }]}
/>
```

`HistogramChart` groups raw numeric values into adjacent frequency bins:

```tsx
<HistogramChart
  values={[12, 18, 18, 21, 24, 24, 24, 30]}
  binCount={6}
/>
```

`LollipopChart` combines thin stems with markers for lightweight comparisons:

```tsx
<LollipopChart
  data={data}
  xKey="month"
  yKey="revenue"
  radius={6}
/>
```

`PieChart` accepts labeled values, assigns theme colors, and can also render as a donut:

```tsx
<PieChart
  data={[
    { label: 'Product', value: 70 },
    { label: 'Services', value: 30 },
  ]}
  innerRadius="45%"
/>
```

`GaugeChart` displays a value against a maximum as a configurable arc:

```tsx
<GaugeChart
  value={72}
  max={100}
  innerRadius="70%"
  valueColor="#6750a4"
/>
```

## Data edge cases

- Empty datasets, empty series, and datasets without usable values display `No data`
  inside the existing chart layout. The renderer is not mounted.
- Cartesian X values must be strings or finite numbers. Rows with invalid X values
  are discarded. Invalid Y values (`NaN`, infinity, or nonnumeric values) become
  missing values; they are never converted to zero. `connectMissingData` retains
  its existing behavior.
- Bubbles, candlesticks, and area ranges require complete finite numeric samples.
- A lone valid sample in line, area, and sparkline charts is shown as a marker.
  Single area ranges show their endpoints; stacked areas mark cumulative values.
  Constant series, including zero, retain their values and use Victory's expanded scales.
- Pie charts ignore nonpositive and nonfinite slice values. An all-zero pie displays
  `No data`. Gauge continues to clamp values to its valid range.
- Histograms ignore nonfinite observations and invalid domains. Invalid bin counts
  default to 10; finite counts are clamped to 1–1,000 to bound allocations.

Explore these cases under **Examples / Edge Cases** in Storybook.

## Example app

Type checking and declaration builds use TypeScript 7.0.2 through the
`@typescript/native` npm alias. The `typescript` dependency aliases
`@typescript/typescript6` for tools that require the JavaScript compiler API,
including ESLint, Bob's declaration processing and TypeDoc. Both the library
and the Expo example use this setup; `tsc --version` reports 7.0.2.

Internal library imports use `@/` to refer to `src/`. TypeScript, Jest, Metro and
Storybook resolve this alias during development. `npm run build` rewrites it to
relative paths in CommonJS, ESM, declarations and the native sources in `lib/native`.
Published packages use those native sources, so consumers need no alias configuration.

The Expo development app consumes the package directly from `src` through Metro:

```sh
npm run example
npm run example:ios
npm run example:android
```

## Storybook

Install the example dependencies once, then start Storybook from the repository root:

```sh
npm --prefix example install
npm run storybook
```

Open <http://localhost:6006> to explore all 17 charts. The example installation
also copies the CanvasKit WASM files required by Skia on web.

```sh
npm run storybook:build
npm run storybook:preview
npm run test:e2e
npm run test:e2e:dev
```

The browser tests require Chromium (`cd example && npx playwright install chromium`).

### Stable props and updates

Chart components use shallow memoization. Keep `data`, `series`, palette arrays,
styles, and formatter callbacks stable with module constants or `useMemo` /
`useCallback` when they are reused. Update data and series immutably: replace the
array when its contents change instead of mutating it in place.

Internally, axes and theme configuration retain their references when their
values are unchanged. Theme changes do not re-prepare Cartesian data. Histogram
bins depend on domain endpoints rather than the domain array reference.

### Tooltip selection

`useChartPointSelection()` provides `activePoint`, `selectPoint(index)` and
`clearPoint()`. Render it inside the tooltip overlay so pointer movement updates
only that overlay. Requests within a frame are coalesced to the latest index;
reselecting the same index does not update React state. Pending work is cancelled
on unmount. This hook uses React and `requestAnimationFrame` on RN and Web.

The caller maps coordinates to a point index, renders the tooltip, and clears the
selection when data changes (or remounts the overlay with a data/period key).
The Rewards stories demonstrate hover, focus, tap and touch drag for evenly spaced
buckets. Selection on tap/drag release persists; leaving a hover target or cancelling
a touch clears it.

[workflow-ci]: https://github.com/ElJijuna/charts/actions/workflows/ci.yml
[workflow-release]: https://github.com/ElJijuna/charts/actions/workflows/release.yml
[npm-package]: https://www.npmjs.com/package/@real-native/charts
[license]: https://github.com/ElJijuna/charts/blob/main/LICENSE
[coverage-tests]: https://github.com/ElJijuna/charts/tree/main/src/cartesian
[web-tests]: https://github.com/ElJijuna/charts/blob/main/example/e2e/charts.spec.ts
[roadmap]: https://github.com/ElJijuna/charts/blob/main/ROADMAP.md
[badge-ci]: https://github.com/ElJijuna/charts/actions/workflows/ci.yml/badge.svg
[badge-release]: https://github.com/ElJijuna/charts/actions/workflows/release.yml/badge.svg
[badge-npm]: https://img.shields.io/npm/v/%40real-native%2Fcharts?logo=npm
[badge-license]: https://img.shields.io/badge/license-MIT-green
[badge-coverage]: https://img.shields.io/badge/branch_coverage-95.67%25-brightgreen
[badge-web]: https://img.shields.io/badge/web_charts-100%25_in_Chromium-brightgreen?logo=googlechrome
[badge-rn]: https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB
[badge-expo]: https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white
[badge-ts]: https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white
[badge-victory]: https://img.shields.io/badge/Victory_Native-6750A4
[badge-skia]: https://img.shields.io/badge/Skia-386A20
[badge-reanimated]: https://img.shields.io/badge/Reanimated-7667FF
[badge-rnweb]: https://img.shields.io/badge/React_Native_Web-20232A?logo=react&logoColor=61DAFB
[badge-gestures]: https://img.shields.io/badge/Gesture_Handler-00639B
[chart-line]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/line.png
[chart-bar]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/bar.png
[chart-horizontal-bar]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/horizontal-bar.png
[chart-horizontal-stacked-bar]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/horizontal-stacked-bar.png
[chart-stacked-bar]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/stacked-bar.png
[chart-area]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/area.png
[chart-stacked-area]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/stacked-area.png
[chart-area-range]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/area-range.png
[chart-scatter]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/scatter.png
[chart-bubble]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/bubble.png
[chart-sparkline]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/sparkline.png
[chart-histogram]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/histogram.png
[chart-lollipop]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/lollipop.png
[chart-candlestick]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/candlestick.png
[chart-combo]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/combo.png
[chart-pie]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/pie.png
[chart-gauge]: https://raw.githubusercontent.com/ElJijuna/charts/main/docs/images/charts/gauge.png
