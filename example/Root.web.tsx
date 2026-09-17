import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const loadApp = async () => {
  const { App } = await import('./App');
  return { default: App };
};

export function Root() {
  return (
    <WithSkiaWeb
      fallback={
        <View style={styles.loading} testID="skia-loading">
          <ActivityIndicator accessibilityLabel="Loading chart renderer" size="large" />
        </View>
      }
      getComponent={loadApp}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
