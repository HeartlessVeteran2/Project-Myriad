import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ onSearch, theme, placeholder = 'Search manga, anime, light novels...' }) => {
  const [query, setQuery] = useState('');

  const handleChange = (text) => {
    setQuery(text);
    if (onSearch) onSearch(text);
  };

  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} style={styles.icon} />
      <TextInput
        style={[styles.input, theme === 'dark' ? styles.inputDark : styles.inputLight]}
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: 500,
    marginVertical: 8,
  },
  icon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 16,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 2,
  },
  inputDark: {
    backgroundColor: '#2a2a2a',
    color: 'white',
    borderColor: '#333',
  },
  inputLight: {
    backgroundColor: 'white',
    color: '#333',
    borderColor: '#e0e6ed',
  },
});

export default SearchBar;
