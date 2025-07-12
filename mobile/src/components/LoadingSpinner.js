import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const sizeMap = {
  small: 20,
  medium: 40,
  large: 60,
};

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <View style={[styles.container, size === 'large' && { minHeight: 200 }]}>
      <ActivityIndicator size={sizeMap[size] || 40} color="#007bff" />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingSpinner;
