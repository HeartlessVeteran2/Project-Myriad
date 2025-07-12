import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SearchBar, LoadingSpinner, Sidebar } from '../components';
import { features } from '../../features';

const HomeScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const filteredFeatures = features.filter(feature =>
    feature.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>📚 Project Myriad</Text>
        <Text style={styles.subtitle}>Your Personal Media Library</Text>
        
        <SearchBar 
          onSearch={setSearchQuery}
          theme={theme}
          placeholder="Search features..."
        />
        
        <Text style={styles.featuresTitle}>Available Features</Text>
        <FlatList
          data={filteredFeatures}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.featureItem}>
              <Text style={styles.featureText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.featuresList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#333',
  },
  featuresList: {
    flex: 1,
  },
  featureItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
