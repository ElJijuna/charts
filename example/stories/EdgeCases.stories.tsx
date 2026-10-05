import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActivityIndicator, View } from 'react-native';

import type { EdgeCaseStoryProps } from './EdgeCaseStory';

const loadStory = async () => {
  const { EdgeCaseStory } = await import('./EdgeCaseStory');
  return { default: EdgeCaseStory };
};
function EdgeCases(props: EdgeCaseStoryProps) {
  return (
    <View style={{ width: 280 }}>
      <WithSkiaWeb
        getComponent={loadStory}
        componentProps={props}
        fallback={<ActivityIndicator />}
      />
    </View>
  );
}
const meta = {
  title: 'Examples/Edge Cases',
  component: EdgeCases,
  args: { kind: 'line' },
  argTypes: {
    kind: {
      control: 'select',
      options: [
        'line',
        'area',
        'bar',
        'horizontal-bar',
        'horizontal-stacked-bar',
        'stacked-bar',
        'stacked-area',
        'area-range',
        'scatter',
        'bubble',
        'sparkline',
        'histogram',
        'lollipop',
        'candlestick',
        'combo',
        'pie',
        'gauge',
      ],
    },
  },
} satisfies Meta<typeof EdgeCases>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = { args: { scenario: 'empty' } };
export const SinglePoint: Story = { args: { scenario: 'single' } };
export const Invalid: Story = { args: { scenario: 'invalid' } };
export const Constant: Story = { args: { scenario: 'constant' } };
export const Zero: Story = { args: { scenario: 'zero' } };
