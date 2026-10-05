import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActivityIndicator } from 'react-native';

import type { RewardsStoryProps } from './RewardsStory';

const loadRewards = async () => {
  const { RewardsStory } = await import('./RewardsStory');
  return { default: RewardsStory };
};

function RewardsRenderer(props: RewardsStoryProps) {
  return (
    <WithSkiaWeb
      componentProps={props}
      fallback={<ActivityIndicator accessibilityLabel="Cargando recompensas" />}
      getComponent={loadRewards}
    />
  );
}

const meta = {
  title: 'Examples/Rewards',
  component: RewardsRenderer,
  parameters: { layout: 'centered' },
  argTypes: { variant: { control: 'radio', options: ['line', 'area'] } },
} satisfies Meta<typeof RewardsRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = { args: { variant: 'line' } };
export const Area: Story = { args: { variant: 'area' } };
