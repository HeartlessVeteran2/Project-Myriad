# 🧪 Testing Guide

## Overview

This guide covers testing strategies, frameworks, and best practices for Project Myriad. We employ comprehensive testing across all layers of the application to ensure reliability, performance, and maintainability.

## Testing Strategy

### Testing Pyramid

```
    /\
   /  \    E2E Tests (10%)
  /____\
 /      \   Integration Tests (30%)
/________\  Unit Tests (60%)
```

- **Unit Tests (60%)**: Fast, isolated tests for individual functions and components
- **Integration Tests (30%)**: Test component interactions and API endpoints
- **E2E Tests (10%)**: Full user workflow testing across the entire application

### Test Types

1. **Unit Tests**: Individual functions, components, and classes
2. **Integration Tests**: API endpoints, database operations, service interactions
3. **Component Tests**: React components with mocked dependencies
4. **Visual Tests**: UI regression testing and accessibility
5. **Performance Tests**: Load testing and benchmarking
6. **Security Tests**: Vulnerability scanning and penetration testing

## Backend Testing

### Unit Testing with Jest

```javascript
// backend/tests/unit/library.test.js
const { LibraryService } = require('../../services/libraryService');
const { DatabaseService } = require('../../services/databaseService');

// Mock dependencies
jest.mock('../../services/databaseService');

describe('LibraryService', () => {
  let libraryService;
  let mockDb;

  beforeEach(() => {
    mockDb = new DatabaseService();
    libraryService = new LibraryService(mockDb);
    jest.clearAllMocks();
  });

  describe('addItem', () => {
    it('should add a new item to the library', async () => {
      // Arrange
      const userId = 'user123';
      const itemData = {
        title: 'Test Manga',
        type: 'manga',
        source: 'test-source',
      };
      const expectedItem = { id: 'item123', ...itemData, userId };

      mockDb.query.mockResolvedValue([expectedItem]);

      // Act
      const result = await libraryService.addItem(userId, itemData);

      // Assert
      expect(result).toEqual(expectedItem);
      expect(mockDb.query).toHaveBeenCalledWith(
        'INSERT INTO library_items (user_id, title, type, source) VALUES (?, ?, ?, ?)',
        [userId, itemData.title, itemData.type, itemData.source]
      );
    });

    it('should throw error for invalid item type', async () => {
      const userId = 'user123';
      const invalidItem = {
        title: 'Test Item',
        type: 'invalid-type',
        source: 'test-source',
      };

      await expect(libraryService.addItem(userId, invalidItem)).rejects.toThrow(
        'Invalid item type: invalid-type'
      );
    });

    it('should handle database errors gracefully', async () => {
      const userId = 'user123';
      const itemData = {
        title: 'Test Manga',
        type: 'manga',
        source: 'test-source',
      };

      mockDb.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(libraryService.addItem(userId, itemData)).rejects.toThrow(
        'Failed to add item to library'
      );
    });
  });

  describe('getItems', () => {
    it('should return paginated library items', async () => {
      const userId = 'user123';
      const options = { page: 1, limit: 10, type: 'manga' };
      const mockItems = [
        { id: 'item1', title: 'Manga 1', type: 'manga' },
        { id: 'item2', title: 'Manga 2', type: 'manga' },
      ];

      mockDb.query.mockResolvedValue(mockItems);

      const result = await libraryService.getItems(userId, options);

      expect(result).toEqual(mockItems);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM library_items WHERE user_id = ? AND type = ?'),
        expect.arrayContaining([userId, options.type])
      );
    });

    it('should apply sorting correctly', async () => {
      const userId = 'user123';
      const options = { sort: 'title', order: 'asc' };

      await libraryService.getItems(userId, options);

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY title ASC'),
        expect.any(Array)
      );
    });
  });
});
```

### API Integration Testing

```javascript
// backend/tests/integration/api.test.js
const request = require('supertest');
const app = require('../../app');
const { DatabaseService } = require('../../services/databaseService');
const { AuthService } = require('../../services/authService');

describe('Library API Integration Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Setup test database
    await DatabaseService.setupTestDatabase();

    // Create test user and get auth token
    const authService = new AuthService();
    const testUser = await authService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
    });

    userId = testUser.id;
    authToken = testUser.accessToken;
  });

  afterAll(async () => {
    await DatabaseService.teardownTestDatabase();
  });

  beforeEach(async () => {
    await DatabaseService.clearTestData();
  });

  describe('POST /api/library', () => {
    it('should create a new library item', async () => {
      const itemData = {
        title: 'Test Manga',
        type: 'manga',
        source: 'test-source',
        metadata: {
          author: 'Test Author',
          genres: ['action', 'adventure'],
        },
      };

      const response = await request(app)
        .post('/api/library')
        .set('Authorization', `Bearer ${authToken}`)
        .send(itemData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          title: itemData.title,
          type: itemData.type,
          source: itemData.source,
          userId: userId,
        },
      });
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        title: '', // Empty title
        type: 'invalid-type',
        source: 'test-source',
      };

      const response = await request(app)
        .post('/api/library')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.any(String),
        },
      });
    });

    it('should return 401 for unauthorized requests', async () => {
      const itemData = {
        title: 'Test Manga',
        type: 'manga',
        source: 'test-source',
      };

      await request(app).post('/api/library').send(itemData).expect(401);
    });
  });

  describe('GET /api/library', () => {
    beforeEach(async () => {
      // Create test data
      await request(app).post('/api/library').set('Authorization', `Bearer ${authToken}`).send({
        title: 'Manga 1',
        type: 'manga',
        source: 'source1',
      });

      await request(app).post('/api/library').set('Authorization', `Bearer ${authToken}`).send({
        title: 'Anime 1',
        type: 'anime',
        source: 'source2',
      });
    });

    it('should return user library items', async () => {
      const response = await request(app)
        .get('/api/library')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          items: expect.arrayContaining([
            expect.objectContaining({
              title: 'Manga 1',
              type: 'manga',
            }),
            expect.objectContaining({
              title: 'Anime 1',
              type: 'anime',
            }),
          ]),
          pagination: {
            page: 1,
            limit: 20,
            total: 2,
          },
        },
      });
    });

    it('should filter by type', async () => {
      const response = await request(app)
        .get('/api/library?type=manga')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].type).toBe('manga');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/library?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        limit: 1,
        total: 2,
      });
    });
  });
});
```

### Database Testing

```javascript
// backend/tests/integration/database.test.js
const { DatabaseService } = require('../../services/databaseService');

describe('Database Integration Tests', () => {
  let db;

  beforeAll(async () => {
    db = new DatabaseService();
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    await db.beginTransaction();
  });

  afterEach(async () => {
    await db.rollback();
  });

  describe('User operations', () => {
    it('should create and retrieve user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      };

      const userId = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [userData.username, userData.email, userData.passwordHash]
      );

      const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

      expect(user[0]).toMatchObject({
        id: userId,
        username: userData.username,
        email: userData.email,
      });
    });

    it('should enforce unique constraints', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      };

      await db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [
        userData.username,
        userData.email,
        userData.passwordHash,
      ]);

      // Try to insert duplicate
      await expect(
        db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [
          userData.username,
          userData.email,
          userData.passwordHash,
        ])
      ).rejects.toThrow();
    });
  });

  describe('Library operations', () => {
    let userId;

    beforeEach(async () => {
      userId = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        ['testuser', 'test@example.com', 'hashed_password']
      );
    });

    it('should maintain referential integrity', async () => {
      const itemData = {
        userId: userId,
        title: 'Test Manga',
        type: 'manga',
        source: 'test-source',
      };

      const itemId = await db.query(
        'INSERT INTO library_items (user_id, title, type, source) VALUES (?, ?, ?, ?)',
        [itemData.userId, itemData.title, itemData.type, itemData.source]
      );

      // Delete user should cascade delete library items
      await db.query('DELETE FROM users WHERE id = ?', [userId]);

      const items = await db.query('SELECT * FROM library_items WHERE user_id = ?', [userId]);

      expect(items).toHaveLength(0);
    });
  });
});
```

## Frontend Testing

### Component Testing with React Testing Library

```javascript
// frontend/src/components/__tests__/LibraryItem.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LibraryItem from '../LibraryItem';
import libraryReducer from '../../store/librarySlice';

// Mock API calls
jest.mock('../../services/api');

const mockStore = configureStore({
  reducer: {
    library: libraryReducer,
  },
  preloadedState: {
    library: {
      items: [],
      loading: false,
      error: null,
    },
  },
});

const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <Provider store={options.store || mockStore}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

describe('LibraryItem', () => {
  const mockItem = {
    id: 'item123',
    title: 'Test Manga',
    type: 'manga',
    source: 'test-source',
    coverUrl: 'https://example.com/cover.jpg',
    progress: 50,
    totalChapters: 100,
    metadata: {
      author: 'Test Author',
      genres: ['action', 'adventure'],
    },
  };

  it('renders item information correctly', () => {
    renderWithProviders(<LibraryItem item={mockItem} />);

    expect(screen.getByText('Test Manga')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('action, adventure')).toBeInTheDocument();
    expect(screen.getByText('50 / 100')).toBeInTheDocument();
  });

  it('displays cover image with fallback', () => {
    renderWithProviders(<LibraryItem item={mockItem} />);

    const coverImage = screen.getByAltText('Test Manga cover');
    expect(coverImage).toHaveAttribute('src', mockItem.coverUrl);
  });

  it('handles missing cover image', () => {
    const itemWithoutCover = { ...mockItem, coverUrl: null };
    renderWithProviders(<LibraryItem item={itemWithoutCover} />);

    const placeholderImage = screen.getByAltText('Test Manga cover');
    expect(placeholderImage).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('opens context menu on right click', async () => {
    renderWithProviders(<LibraryItem item={mockItem} />);

    const itemElement = screen.getByTestId('library-item');
    fireEvent.contextMenu(itemElement);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Mark as Read')).toBeInTheDocument();
    });
  });

  it('navigates to item details on click', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    renderWithProviders(<LibraryItem item={mockItem} />);

    const itemElement = screen.getByTestId('library-item');
    fireEvent.click(itemElement);

    expect(mockNavigate).toHaveBeenCalledWith(`/library/${mockItem.id}`);
  });

  it('updates progress when progress bar is clicked', async () => {
    renderWithProviders(<LibraryItem item={mockItem} />);

    const progressBar = screen.getByTestId('progress-bar');
    fireEvent.click(progressBar, { clientX: 200 }); // Mock click at 50% position

    await waitFor(() => {
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', () => {
    renderWithProviders(<LibraryItem item={mockItem} />);

    const itemElement = screen.getByTestId('library-item');

    fireEvent.keyDown(itemElement, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith(`/library/${mockItem.id}`);

    fireEvent.keyDown(itemElement, { key: ' ' });
    expect(mockNavigate).toHaveBeenCalledWith(`/library/${mockItem.id}`);
  });
});
```

### Hook Testing

```javascript
// frontend/src/hooks/__tests__/useLibrary.test.js
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useLibrary from '../useLibrary';
import libraryReducer from '../../store/librarySlice';
import * as api from '../../services/api';

jest.mock('../../services/api');

const createWrapper = (initialState = {}) => {
  const store = configureStore({
    reducer: {
      library: libraryReducer,
    },
    preloadedState: {
      library: {
        items: [],
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });

  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

describe('useLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches library items on mount', async () => {
    const mockItems = [
      { id: 'item1', title: 'Manga 1' },
      { id: 'item2', title: 'Manga 2' },
    ];

    api.getLibraryItems.mockResolvedValue({
      data: { items: mockItems, pagination: { total: 2 } },
    });

    const { result, waitForNextUpdate } = renderHook(() => useLibrary(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.items).toEqual(mockItems);
    expect(api.getLibraryItems).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });
  });

  it('handles fetch errors', async () => {
    const errorMessage = 'Failed to fetch library';
    api.getLibraryItems.mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => useLibrary(), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.items).toEqual([]);
  });

  it('adds new item', async () => {
    const newItem = { title: 'New Manga', type: 'manga' };
    const createdItem = { id: 'item123', ...newItem };

    api.addLibraryItem.mockResolvedValue({ data: createdItem });

    const { result } = renderHook(() => useLibrary(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.addItem(newItem);
    });

    expect(api.addLibraryItem).toHaveBeenCalledWith(newItem);
    expect(result.current.items).toContainEqual(createdItem);
  });

  it('updates existing item', async () => {
    const initialItems = [{ id: 'item1', title: 'Original Title', progress: 10 }];

    const updatedItem = { id: 'item1', title: 'Updated Title', progress: 20 };

    api.updateLibraryItem.mockResolvedValue({ data: updatedItem });

    const { result } = renderHook(() => useLibrary(), {
      wrapper: createWrapper({ items: initialItems }),
    });

    await act(async () => {
      await result.current.updateItem('item1', {
        title: 'Updated Title',
        progress: 20,
      });
    });

    expect(api.updateLibraryItem).toHaveBeenCalledWith('item1', {
      title: 'Updated Title',
      progress: 20,
    });

    const updatedItemInState = result.current.items.find(item => item.id === 'item1');
    expect(updatedItemInState).toEqual(updatedItem);
  });

  it('filters items by type', async () => {
    const mockItems = [
      { id: 'item1', title: 'Manga 1', type: 'manga' },
      { id: 'item2', title: 'Anime 1', type: 'anime' },
    ];

    api.getLibraryItems.mockResolvedValue({
      data: { items: mockItems.filter(item => item.type === 'manga') },
    });

    const { result, rerender } = renderHook(props => useLibrary(props), {
      wrapper: createWrapper(),
      initialProps: { filters: { type: 'manga' } },
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(api.getLibraryItems).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      type: 'manga',
    });
  });
});
```

## E2E Testing with Playwright

### Setup

```javascript
// e2e/playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```javascript
// e2e/tests/library.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Library Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should add new manga to library', async ({ page }) => {
    await page.goto('/library');

    // Open add item dialog
    await page.click('[data-testid="add-item-button"]');
    await expect(page.locator('[data-testid="add-item-dialog"]')).toBeVisible();

    // Fill form
    await page.fill('[data-testid="title-input"]', 'One Piece');
    await page.selectOption('[data-testid="type-select"]', 'manga');
    await page.fill('[data-testid="author-input"]', 'Eiichiro Oda');
    await page.fill('[data-testid="description-input"]', 'Epic pirate adventure');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Verify item was added
    await expect(page.locator('[data-testid="library-item"]')).toContainText('One Piece');
    await expect(page.locator('[data-testid="library-item"]')).toContainText('Eiichiro Oda');
  });

  test('should update reading progress', async ({ page }) => {
    await page.goto('/library');

    // Assume item exists from previous test or setup
    const libraryItem = page.locator('[data-testid="library-item"]').first();
    await libraryItem.click();

    // Update progress
    await page.fill('[data-testid="progress-input"]', '25');
    await page.click('[data-testid="update-progress-button"]');

    // Verify progress updated
    await expect(page.locator('[data-testid="progress-display"]')).toContainText('25');

    // Check progress bar reflects change
    const progressBar = page.locator('[data-testid="progress-bar"]');
    await expect(progressBar).toHaveAttribute('aria-valuenow', '25');
  });

  test('should filter library by type', async ({ page }) => {
    await page.goto('/library');

    // Apply manga filter
    await page.selectOption('[data-testid="type-filter"]', 'manga');

    // Wait for filter to apply
    await page.waitForLoadState('networkidle');

    // Verify only manga items are shown
    const items = page.locator('[data-testid="library-item"]');
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      await expect(items.nth(i).locator('[data-testid="item-type"]')).toContainText('manga');
    }
  });

  test('should search library items', async ({ page }) => {
    await page.goto('/library');

    // Search for specific item
    await page.fill('[data-testid="search-input"]', 'One Piece');
    await page.press('[data-testid="search-input"]', 'Enter');

    // Wait for search results
    await page.waitForLoadState('networkidle');

    // Verify search results
    const items = page.locator('[data-testid="library-item"]');
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toContainText('One Piece');
    }
  });

  test('should handle offline functionality', async ({ page, context }) => {
    await page.goto('/library');

    // Go offline
    await context.setOffline(true);

    // Try to add item (should show offline message)
    await page.click('[data-testid="add-item-button"]');
    await expect(page.locator('[data-testid="offline-message"]')).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Verify functionality restored
    await page.reload();
    await page.click('[data-testid="add-item-button"]');
    await expect(page.locator('[data-testid="add-item-dialog"]')).toBeVisible();
  });
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# tests/performance/load-test.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 5
      name: 'Warm up'
    - duration: 120
      arrivalRate: 10
      name: 'Ramp up load'
    - duration: 300
      arrivalRate: 20
      name: 'Sustained load'
  processor: './auth-processor.js'

scenarios:
  - name: 'Library operations'
    weight: 70
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'TestPassword123!'
          capture:
            - json: '$.data.accessToken'
              as: 'token'
      - get:
          url: '/api/library'
          headers:
            Authorization: 'Bearer {{ token }}'
      - post:
          url: '/api/library'
          headers:
            Authorization: 'Bearer {{ token }}'
          json:
            title: 'Load Test Manga {{ $randomString() }}'
            type: 'manga'
            source: 'load-test'

  - name: 'Search operations'
    weight: 20
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'TestPassword123!'
          capture:
            - json: '$.data.accessToken'
              as: 'token'
      - get:
          url: '/api/search?q={{ $randomString() }}'
          headers:
            Authorization: 'Bearer {{ token }}'

  - name: 'Extension operations'
    weight: 10
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'TestPassword123!'
          capture:
            - json: '$.data.accessToken'
              as: 'token'
      - get:
          url: '/api/extensions'
          headers:
            Authorization: 'Bearer {{ token }}'
```

### Frontend Performance Testing

```javascript
// tests/performance/lighthouse.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouseTests() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const pages = [
    'http://localhost:3000/',
    'http://localhost:3000/library',
    'http://localhost:3000/search',
    'http://localhost:3000/reader/sample-manga',
  ];

  const results = [];

  for (const url of pages) {
    console.log(`Testing ${url}...`);
    const runnerResult = await lighthouse(url, options);

    const scores = {
      url,
      performance: runnerResult.lhr.categories.performance.score * 100,
      accessibility: runnerResult.lhr.categories.accessibility.score * 100,
      bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
      seo: runnerResult.lhr.categories.seo.score * 100,
    };

    results.push(scores);
    console.log(`Scores for ${url}:`, scores);
  }

  await chrome.kill();
  return results;
}

// Performance thresholds
const thresholds = {
  performance: 80,
  accessibility: 90,
  bestPractices: 85,
  seo: 85,
};

runLighthouseTests().then(results => {
  let failed = false;

  results.forEach(result => {
    Object.keys(thresholds).forEach(category => {
      if (result[category] < thresholds[category]) {
        console.error(
          `❌ ${result.url} ${category}: ${result[category]} < ${thresholds[category]}`
        );
        failed = true;
      } else {
        console.log(`✅ ${result.url} ${category}: ${result[category]} >= ${thresholds[category]}`);
      }
    });
  });

  process.exit(failed ? 1 : 0);
});
```

## Test Utilities

### Test Database Setup

```javascript
// backend/tests/utils/testDb.js
const { DatabaseService } = require('../../services/databaseService');

class TestDatabaseService extends DatabaseService {
  constructor() {
    super();
    this.testDatabaseName = `test_myriad_${Date.now()}`;
  }

  async setupTestDatabase() {
    // Create test database
    await this.query(`CREATE DATABASE ${this.testDatabaseName}`);
    await this.query(`USE ${this.testDatabaseName}`);

    // Run migrations
    await this.runMigrations();

    // Seed test data
    await this.seedTestData();
  }

  async teardownTestDatabase() {
    await this.query(`DROP DATABASE ${this.testDatabaseName}`);
  }

  async clearTestData() {
    const tables = ['library_items', 'users', 'reading_progress'];

    // Disable foreign key checks
    await this.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of tables) {
      await this.query(`TRUNCATE TABLE ${table}`);
    }

    // Re-enable foreign key checks
    await this.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  async seedTestData() {
    // Create test users
    await this.query(`
      INSERT INTO users (id, username, email, password_hash) VALUES
      ('user1', 'testuser1', 'test1@example.com', 'hashed_password_1'),
      ('user2', 'testuser2', 'test2@example.com', 'hashed_password_2')
    `);

    // Create test library items
    await this.query(`
      INSERT INTO library_items (id, user_id, title, type, source) VALUES
      ('item1', 'user1', 'Test Manga 1', 'manga', 'test-source'),
      ('item2', 'user1', 'Test Anime 1', 'anime', 'test-source'),
      ('item3', 'user2', 'Test Novel 1', 'light_novel', 'test-source')
    `);
  }
}

module.exports = { TestDatabaseService };
```

### API Test Helpers

```javascript
// backend/tests/utils/apiHelpers.js
const request = require('supertest');
const { AuthService } = require('../../services/authService');

class ApiTestHelpers {
  constructor(app) {
    this.app = app;
    this.authService = new AuthService();
  }

  async createTestUser(userData = {}) {
    const defaultUserData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'TestPassword123!',
    };

    const user = await this.authService.register({
      ...defaultUserData,
      ...userData,
    });

    return user;
  }

  async authenticatedRequest(method, url, data = {}) {
    const user = await this.createTestUser();

    return request(this.app)
      [method](url)
      .set('Authorization', `Bearer ${user.accessToken}`)
      .send(data);
  }

  async post(url, data = {}) {
    return this.authenticatedRequest('post', url, data);
  }

  async get(url) {
    return this.authenticatedRequest('get', url);
  }

  async put(url, data = {}) {
    return this.authenticatedRequest('put', url, data);
  }

  async delete(url) {
    return this.authenticatedRequest('delete', url);
  }

  expectSuccessResponse(response, expectedData = {}) {
    expect(response.body).toMatchObject({
      success: true,
      data: expectedData,
    });
  }

  expectErrorResponse(response, expectedError = {}) {
    expect(response.body).toMatchObject({
      success: false,
      error: expectedError,
    });
  }
}

module.exports = { ApiTestHelpers };
```

## Test Automation

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test_password
          MYSQL_DATABASE: test_db
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run unit tests
        working-directory: ./backend
        run: npm run test:unit
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 3306
          DB_NAME: test_db
          DB_USER: root
          DB_PASSWORD: test_password

      - name: Run integration tests
        working-directory: ./backend
        run: npm run test:integration
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 3306
          DB_NAME: test_db
          DB_USER: root
          DB_PASSWORD: test_password

  test-frontend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run tests
        working-directory: ./frontend
        run: npm run test -- --coverage --watchAll=false

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./frontend/coverage

  test-e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
          cd ../e2e && npm ci

      - name: Install Playwright
        working-directory: ./e2e
        run: npx playwright install --with-deps

      - name: Start services
        run: |
          cd backend && npm start &
          cd frontend && npm start &
          sleep 30

      - name: Run E2E tests
        working-directory: ./e2e
        run: npx playwright test

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: e2e/playwright-report/
```

This comprehensive testing guide ensures Project Myriad maintains high quality and reliability across all components and features.
