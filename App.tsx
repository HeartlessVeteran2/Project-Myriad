/**
 * Project Myriad: The Definitive Manga and Anime Platform
 * Main Application Entry Point
 */

import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/error/ErrorBoundary';
import errorService, { ErrorType, ErrorSeverity } from './src/services/ErrorService';
import loggingService, { LogLevel, info } from './src/services/LoggingService';

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize error service
    errorService.initialize();

    // Configure logging service
    if (__DEV__) {
      loggingService.setLogLevel(LogLevel.DEBUG);
    } else {
      loggingService.setLogLevel(LogLevel.INFO);
    }

    // Log application start
    info('App', 'Application started', {
      timestamp: Date.now(),
      deviceInfo: loggingService.getDeviceInfo(),
    });

    // Clean up on unmount
    return () => {
      errorService.cleanup();
    };
  }, []);

  const handleError = (error: Error, errorInfo: React.ErrorInfo): void => {
    // Log the error
    errorService.captureError(error, ErrorType.UNKNOWN, ErrorSeverity.ERROR, {
      component: 'App',
      action: 'render',
      data: { errorInfo },
    });
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary onError={handleError}>
          <AppNavigator />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

export default App;
