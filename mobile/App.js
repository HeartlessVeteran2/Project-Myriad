import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { features } from './features';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Myriad</Text>
      <Text style={styles.subtitle}>Features</Text>
      <FlatList
        data={features}
        keyExtractor={item => item}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    marginVertical: 2,
  },
});
