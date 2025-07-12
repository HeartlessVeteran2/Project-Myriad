import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { jest } from '@jest/globals';

/**
 * Custom testing utilities for React Native components
 */

// Mock AsyncStorage
export const mockAsyncStorage = () => {
  const store = {};
  return {
    getItem: jest.fn((key) => Promise.resolve(store[key] || null)),
    setItem: jest.fn((key, value) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
    multiGet: jest.fn((keys) => 
      Promise.resolve(keys.map(key => [key, store[key] || null]))
    ),
    multiSet: jest.fn((keyValuePairs) => {
      keyValuePairs.forEach(([key, value]) => {
        store[key] = value;
      });
      return Promise.resolve();
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach(key => delete store[key]);
      return Promise.resolve();
    }),
  };
};

// Mock navigation
export const mockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(() => ({})),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

// Mock route
export const mockRoute = (params = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

// Mock theme context
export const mockThemeContext = (theme = 'light') => ({
  theme,
  effectiveTheme: theme,
  isDark: theme === 'dark',
  isLight: theme === 'light',
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
});

// Mock auth context
export const mockAuthContext = (user = null) => ({
  user,
  token: user ? 'mock-token' : null,
  isAuthenticated: !!user,
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  updateProfile: jest.fn(),
});

// Mock notification context
export const mockNotificationContext = () => ({
  notifications: [],
  addNotification: jest.fn(),
  removeNotification: jest.fn(),
  clearAll: jest.fn(),
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn(),
  showInfo: jest.fn(),
});

// Mock API service
export const mockApiService = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  upload: jest.fn(),
  download: jest.fn(),
});

// Custom render function with providers
export const renderWithProviders = (component, options = {}) => {
  const {
    theme = 'light',
    user = null,
    navigation = mockNavigation(),
    route = mockRoute(),
    ...renderOptions
  } = options;

  const AllTheProviders = ({ children }) => {
    return (
      // Add your providers here
      children
    );
  };

  return render(component, { wrapper: AllTheProviders, ...renderOptions });
};

// Test utilities for async operations
export const waitForLoading = async (testId = 'loading-spinner') => {
  await waitFor(() => {
    expect(screen.queryByTestId(testId)).toBeNull();
  }, { timeout: 5000 });
};

export const waitForError = async (errorMessage) => {
  await waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeTruthy();
  }, { timeout: 3000 });
};

// Mock fetch for API testing
export const mockFetch = (response, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      headers: new Map(),
    })
  );
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockItem = (overrides = {}) => ({
  id: '1',
  title: 'Test Item',
  description: 'Test description',
  image: 'https://example.com/image.jpg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Performance testing utilities
export const measureRenderTime = async (renderFn) => {
  const start = performance.now();
  await renderFn();
  const end = performance.now();
  return end - start;
};

export const expectRenderTimeBelow = async (renderFn, maxTime = 100) => {
  const renderTime = await measureRenderTime(renderFn);
  expect(renderTime).toBeLessThan(maxTime);
};

// Custom matchers
expect.extend({
  toBeAccessible(received) {
    const accessibilityProps = [
      'accessible',
      'accessibilityLabel',
      'accessibilityHint',
      'accessibilityRole',
    ];
    
    const hasAccessibilityProps = accessibilityProps.some(prop => 
      received.props && received.props[prop]
    );
    
    if (hasAccessibilityProps) {
      return {
        message: () => `Element has accessibility properties`,
        pass: true,
      };
    } else {
      return {
        message: () => `Element lacks accessibility properties`,
        pass: false,
      };
    }
  },

  toHaveTestId(received, testId) {
    const hasTestId = received.props && received.props.testID === testId;
    
    if (hasTestId) {
      return {
        message: () => `Element has testID "${testId}"`,
        pass: true,
      };
    } else {
      return {
        message: () => `Element does not have testID "${testId}"`,
        pass: false,
      };
    }
  },
});

// Snapshot testing utilities
export const createComponentSnapshot = (Component, props = {}) => {
  const tree = render(<Component {...props} />);
  expect(tree).toMatchSnapshot();
};

// Error boundary testing
export const triggerErrorBoundary = (component, error = new Error('Test error')) => {
  const ThrowError = ({ shouldThrow }) => {
    if (shouldThrow) {
      throw error;
    }
    return component;
  };

  return <ThrowError shouldThrow={true} />;
};

export default {
  renderWithProviders,
  mockAsyncStorage,
  mockNavigation,
  mockRoute,
  mockThemeContext,
  mockAuthContext,
  mockNotificationContext,
  mockApiService,
  mockFetch,
  createMockUser,
  createMockItem,
  waitForLoading,
  waitForError,
  measureRenderTime,
  expectRenderTimeBelow,
  createComponentSnapshot,
  triggerErrorBoundary,
};
