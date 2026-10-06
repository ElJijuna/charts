import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActivityIndicator } from 'react-native';

import type { LargeDatasetStoryProps } from './LargeDatasetStory';

const loadStory = async () => {
  const { LargeDatasetStory } = await import('./LargeDatasetStory');
  return { default: LargeDatasetStory };
};

function LargeDatasets(props: LargeDatasetStoryProps) {
  return (
    <WithSkiaWeb getComponent={loadStory} componentProps={props} fallback={<ActivityIndicator />} />
  );
}

const meta = {
  title: 'Examples/Large Datasets',
  component: LargeDatasets,
  args: { kind: 'line', size: 1_000, animate: false },
  argTypes: {
    kind: {
      control: 'select',
      options: [
        'line',
        'area',
        'stacked-area',
        'scatter',
        'bubble',
        'bar',
        'histogram',
        'sparkline',
        'candlestick',
      ],
    },
    size: { control: 'select', options: [1_000, 10_000, 50_000] },
  },
} satisfies Meta<typeof LargeDatasets>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Points1k: Story = { args: { size: 1_000 } };
export const Points10k: Story = { args: { size: 10_000 } };
export const Points50k: Story = { args: { size: 50_000 } };
