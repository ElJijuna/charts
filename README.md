# @real-native/charts

Friendly, customizable charts for React Native, powered by Victory Native.

## Installation

```sh
npm install @real-native/charts victory-native @shopify/react-native-skia react-native-gesture-handler react-native-reanimated
```

Follow the Reanimated and Skia installation instructions for your React Native or Expo version.

## Usage

```tsx
import { LineChart } from '@real-native/charts';

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
    />
  );
}
```

## Example app

The Expo development app consumes the package directly from `src` through Metro:

```sh
npm run example
npm run example:ios
npm run example:android
```
