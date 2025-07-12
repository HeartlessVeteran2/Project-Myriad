import React, { Suspense, lazy } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ErrorBoundary from './ErrorBoundary';

/**
 * Enhanced lazy loading component with error boundaries and loading states
 */
const LazyComponent = ({ 
  importFunc, 
  fallback, 
  errorFallback,
  ...props 
}) => {
  const Component = lazy(importFunc);

  const defaultFallback = (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || defaultFallback}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * HOC for lazy loading components
 */
export const withLazyLoading = (
  importFunc, 
  loadingComponent, 
  errorComponent
) => {
  return (props) => (
    <LazyComponent
      importFunc={importFunc}
      fallback={loadingComponent}
      errorFallback={errorComponent}
      {...props}
    />
  );
};

/**
 * Preload function for critical components
 */
export const preloadComponent = (importFunc) => {
  return importFunc();
};

/**
 * Route-based lazy loading
 */
export const LazyRoute = ({ 
  component: Component, 
  loading: LoadingComponent,
  error: ErrorComponent,
  ...props 
}) => {
  if (!Component) {
    throw new Error('LazyRoute requires a component prop');
  }

  return (
    <ErrorBoundary fallback={ErrorComponent}>
      <Suspense 
        fallback={
          LoadingComponent ? (
            <LoadingComponent />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
            </View>
          )
        }
      >
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default LazyComponent;
