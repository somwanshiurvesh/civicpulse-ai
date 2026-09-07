const { Pool } = require('pg');
require('./env');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'civicpulse',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[Database Pool] Unexpected error on idle PostgreSQL client:', err);
});

/**
 * Execute a single query against the connection pool.
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<pg.QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Acquire a dedicated client for transaction handling.
 * @returns {Promise<pg.PoolClient>}
 */
const getClient = () => pool.connect();

/**
 * Test database connectivity and verify PostGIS extension.
 * @returns {Promise<{ healthy: boolean, postgisVersion: string|null, error: string|null }>}
 */
const testDbConnection = async () => {
  try {
    const result = await pool.query('SELECT PostGIS_Version() AS postgis_version;');
    return {
      healthy: true,
      postgisVersion: result.rows[0]?.postgis_version || 'Enabled',
      error: null,
    };
  } catch (err) {
    return {
      healthy: false,
      postgisVersion: null,
      error: err.message,
    };
  }
};

module.exports = {
  pool,
  query,
  getClient,
  testDbConnection,
};
