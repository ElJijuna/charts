import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { ChartKind, ChartStoryProps } from './ChartStory';

const loadChartStory = async () => {
  const { ChartStory } = await import('./ChartStory');
  return { default: ChartStory };
};

function StoryRenderer(props: ChartStoryProps) {
  return (
    <WithSkiaWeb
      componentProps={props}
      fallback={
        <View style={styles.loading} testID="skia-loading">
          <ActivityIndicator accessibilityLabel="Loading chart renderer" size="large" />
        </View>
      }
      getComponent={loadChartStory}
    />
  );
}

const meta = {
  component: StoryRenderer,
  title: 'Charts',
} satisfies Meta<typeof StoryRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

const story = (kind: ChartKind): Story => ({ args: { kind } });

export const Line = story('line');
export const Bar = story('bar');
export const HorizontalBar = story('horizontal-bar');
export const HorizontalStackedBar = story('horizontal-stacked-bar');
export const StackedBar = story('stacked-bar');
export const Area = story('area');
export const StackedArea = story('stacked-area');
export const AreaRange = story('area-range');
export const Scatter = story('scatter');
export const Bubble = story('bubble');
export const Sparkline = story('sparkline');
export const Histogram = story('histogram');
export const Lollipop = story('lollipop');
export const Candlestick = story('candlestick');
export const Combo = story('combo');
export const Pie = story('pie');
export const Gauge = story('gauge');

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    height: 320,
    justifyContent: 'center',
    width: 720,
  },
});
