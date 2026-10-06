import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActivityIndicator } from 'react-native';
import type { MultiSeriesTooltipStoryProps } from './MultiSeriesTooltipStory';

const loadStory = async () => {
  const { MultiSeriesTooltipStory } = await import('./MultiSeriesTooltipStory');
  return { default: MultiSeriesTooltipStory };
};
function MultiSeriesTooltip(props: MultiSeriesTooltipStoryProps) {
  return (
    <WithSkiaWeb
      componentProps={props}
      getComponent={loadStory}
      fallback={<ActivityIndicator accessibilityLabel="Loading chart renderer" />}
    />
  );
}
const meta = {
  title: 'Examples/Multi Series Tooltip',
  component: MultiSeriesTooltip,
  args: { missingValues: true },
  argTypes: { missingValues: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component:
          'Two series share a numeric, nonuniform X domain. Selection zones use midpoints between renderOverlay coordinates; markers use each series geometry. Missing values remain missing. Changing the dataset clears selection without remounting the chart.',
      },
    },
  },
} satisfies Meta<typeof MultiSeriesTooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const WithGaps: Story = {};
export const CompleteSeries: Story = { args: { missingValues: false } };
