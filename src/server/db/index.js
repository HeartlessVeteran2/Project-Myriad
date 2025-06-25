// Database connection using pg
const { Pool } = require('pg');

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn(
    '[WARNING] DATABASE_URL environment variable is not set. Using default credentials. ' +
    'This is insecure and should not be used in production.'
  );
  connectionString = 'postgres://user:password@localhost:5432/myriad';
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connection successful');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};