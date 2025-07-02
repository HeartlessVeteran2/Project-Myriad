// Test setup file
const { Pool } = require('pg');

// Set up test database
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db';
process.env.JWT_SECRET = 'test_secret';

// Global test timeout
jest.setTimeout(30000);

// Clean up database before each test
beforeEach(async () => {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
      await pool.query('TRUNCATE TABLE reading_progress, series, users CASCADE');
    } catch (error) {
      console.warn('Could not clean test database:', error.message);
    } finally {
      await pool.end();
    }
  }
});
