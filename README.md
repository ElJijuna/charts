# @real-native/charts

Friendly, customizable charts for React Native, powered by Victory Native.

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

## Example app

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
