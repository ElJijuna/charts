import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyChartStateProps {
  label?: string;
  color: string;
  render?: () => ReactNode;
}

export function EmptyChartState({ label, color, render }: EmptyChartStateProps) {
  return (
    <View style={styles.container}>
      {render ? render() : label ? <Text style={[styles.label, { color }]}>{label}</Text> : null}
    </View>
  );
}

export function emptyAccessibilityLabel(
  accessibilityLabel: string,
  hasData: boolean,
  emptyLabel: string | undefined,
) {
  return hasData || !emptyLabel ? accessibilityLabel : `${accessibilityLabel}: ${emptyLabel}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12 },
});
