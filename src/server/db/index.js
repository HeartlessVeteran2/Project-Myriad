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
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
