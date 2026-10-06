import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActivityIndicator } from 'react-native';

import type { ChartStatesStoryProps } from './ChartStatesStory';

const loadStory = async () => {
  const { ChartStatesStory } = await import('./ChartStatesStory');
  return { default: ChartStatesStory };
};

function ChartStates(props: ChartStatesStoryProps) {
  return (
    <WithSkiaWeb
      componentProps={props}
      fallback={<ActivityIndicator accessibilityLabel="Loading chart renderer" />}
      getComponent={loadStory}
    />
  );
}

const meta = {
  title: 'Examples/Chart States',
  component: ChartStates,
  args: { scenario: 'label', emptyLabel: 'No activity yet', loadingDelay: 2000 },
  argTypes: {
    scenario: { control: 'select', options: ['label', 'custom', 'silent', 'loading'] },
    emptyLabel: { control: 'text' },
    loadingDelay: { control: { type: 'range', min: 500, max: 5000, step: 500 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'emptyLabel supplies the empty message; renderEmpty replaces its content. ' +
          'Loading is managed by the consumer, which supplies empty data and a loading view ' +
          'until the request completes. WithSkiaWeb separately loads the renderer.',
      },
    },
  },
} satisfies Meta<typeof ChartStates>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyLabel: Story = {};
export const CustomEmpty: Story = { args: { scenario: 'custom' } };
export const SilentEmpty: Story = { args: { scenario: 'silent' } };
export const LoadingToData: Story = { args: { scenario: 'loading' } };
