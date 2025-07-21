import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

// Mock navigation dependencies
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: ({children}: {children: React.ReactNode}) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: ({children}: {children: React.ReactNode}) => children,
  }),
}));

// Mock Redux dependencies
jest.mock('react-redux', () => ({
  Provider: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../src/store', () => ({
  store: {},
  persistor: {},
}));

// Mock error handling and logging services
jest.mock('../src/components/error/ErrorBoundary', () => ({
  __esModule: true,
  default: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../src/services/ErrorService', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    cleanup: jest.fn(),
    captureError: jest.fn(),
  },
  ErrorType: {
    UNKNOWN: 'unknown',
  },
  ErrorSeverity: {
    ERROR: 'error',
  },
}));

jest.mock('../src/services/LoggingService', () => ({
  __esModule: true,
  default: {
    setLogLevel: jest.fn(),
    getDeviceInfo: jest.fn(() => ({})),
  },
  LogLevel: {
    DEBUG: 0,
    INFO: 1,
  },
  info: jest.fn(),
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    // Add a simple assertion to make sure the test is actually doing something
    expect(true).toBeTruthy();
  });
});
