import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
    
    // Enhanced error logging with more context
    const errorReport = {
      error: error.toString(),
      errorInfo,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location?.href : 'N/A',
      userId: this.props.userId || 'anonymous'
    };
    
    console.error('ErrorBoundary caught an error:', errorReport);
    
    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production' && this.props.onError) {
      this.props.onError(errorReport);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          theme={this.props.theme}
        />
      );
    }
    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, onRetry, theme = 'light' }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🚨</Text>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Oops! Something went wrong
        </Text>
        <Text style={[styles.message, isDark && styles.messageDark]}>
          We're sorry, but something unexpected happened. Don't worry, your data is safe.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.retryButton, isDark && styles.retryButtonDark]} 
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.detailsButton, isDark && styles.detailsButtonDark]}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={[styles.detailsButtonText, isDark && styles.detailsButtonTextDark]}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDetails && __DEV__ && error && (
          <View style={[styles.errorDetails, isDark && styles.errorDetailsDark]}>
            <Text style={[styles.errorTitle, isDark && styles.errorTitleDark]}>
              Error Details (Development Mode)
            </Text>
            <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
              {error.toString()}
            </Text>
            {errorInfo?.componentStack && (
              <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
                Component Stack: {errorInfo.componentStack}
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, isDark && styles.helpTitleDark]}>
            What can you do?
          </Text>
          <Text style={[styles.helpText, isDark && styles.helpTextDark]}>
            • Try refreshing the app
          </Text>
          <Text style={[styles.helpText, isDark && styles.helpTextDark]}>
            • Check your internet connection
          </Text>
          <Text style={[styles.helpText, isDark && styles.helpTextDark]}>
            • Contact support if the problem persists
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  containerDark: {
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80%',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    color: '#dc3545',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleDark: {
    color: '#ff6b6b',
  },
  message: {
    color: '#6c757d',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  messageDark: {
    color: '#adb5bd',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonDark: {
    backgroundColor: '#0d6efd',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  detailsButtonDark: {
    borderColor: '#adb5bd',
  },
  detailsButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButtonTextDark: {
    color: '#adb5bd',
  },
  errorDetails: {
    width: '100%',
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorDetailsDark: {
    backgroundColor: '#2d1b1e',
    borderColor: '#5a2d31',
  },
  errorTitle: {
    color: '#721c24',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorTitleDark: {
    color: '#f8d7da',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  errorTextDark: {
    color: '#f8d7da',
  },
  helpSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  helpTitle: {
    color: '#495057',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  helpTitleDark: {
    color: '#e9ecef',
  },
  helpText: {
    color: '#6c757d',
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  helpTextDark: {
    color: '#adb5bd',
  },
});

export default ErrorBoundary;
