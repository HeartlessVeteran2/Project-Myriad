// Test setup for backend

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.PORT = '0'; // Use random available port for testing

// Global test setup
beforeAll(async () => {
  console.log('🔧 Setting up backend tests...');

  // Check if test database is available
  try {
    // You can add database setup here
    console.log('✅ Backend test setup completed');
  } catch (error) {
    console.log('⚠️  Database not available for testing');
  }
});

afterAll(async () => {
  console.log('🧹 Cleaning up backend tests...');
  // Add any cleanup logic here
});

// Silence console in tests unless debugging
if (!process.env.DEBUG_TESTS) {
  console.log = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
}
