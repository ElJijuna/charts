import { StyleSheet, Text, View } from 'react-native';

export function EmptyChartState() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>No data</Text>
    </View>
  );
}

const emptyLabelColor = '#6b7280';

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { color: emptyLabelColor, fontSize: 12 },
});
