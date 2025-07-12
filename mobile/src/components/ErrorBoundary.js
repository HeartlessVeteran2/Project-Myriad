import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Log error to monitoring service in production
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>🚨 Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try refreshing the app.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.error}>{this.state.error.toString()}</Text>
          )}
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    margin: 32,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  title: {
    color: '#dc3545',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    color: '#6c757d',
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    color: '#721c24',
    fontSize: 12,
    marginTop: 8,
  },
});

export default ErrorBoundary;
