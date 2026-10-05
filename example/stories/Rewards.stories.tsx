import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { RewardsStoryProps } from './RewardsStory';

const loadRewards = async () => {
  const { RewardsStory } = await import('./RewardsStory');
  return { default: RewardsStory };
};

function RewardsRenderer(props: RewardsStoryProps) {
  return (
    <View style={styles.host} testID="rewards-host">
      <WithSkiaWeb
        componentProps={props}
        fallback={<ActivityIndicator accessibilityLabel="Cargando recompensas" />}
        getComponent={loadRewards}
      />
    </View>
  );
}

const meta = {
  title: 'Examples/Rewards',
  component: RewardsRenderer,
  parameters: { layout: 'fullscreen' },
  argTypes: { variant: { control: 'radio', options: ['line', 'area'] } },
} satisfies Meta<typeof RewardsRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = { args: { variant: 'line' } };
export const Area: Story = { args: { variant: 'area' } };

const styles = StyleSheet.create({
  host: { width: '100%', padding: 16, alignItems: 'center' },
});
