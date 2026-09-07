const fs = require('fs');
const path = require('path');
const { getClient, pool } = require('../config/db');

/**
 * Execute all pending database migrations in sequential order.
 */
async function runMigrations() {
  const client = await getClient();
  try {
    console.log('[Migration] Checking database schema migrations...');

    // Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Fetch previously applied migrations
    const { rows: appliedRows } = await client.query('SELECT name FROM schema_migrations ORDER BY id ASC;');
    const appliedNames = new Set(appliedRows.map((r) => r.name));

    // Read migration files in alphabetic/numerical order
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (!appliedNames.has(file)) {
        console.log(`[Migration] Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (name) VALUES ($1);', [file]);
          await client.query('COMMIT');
          console.log(`[Migration] Successfully applied: ${file}`);
          appliedCount++;
        } catch (migrationErr) {
          await client.query('ROLLBACK');
          console.error(`[Migration] Failed to apply ${file}:`, migrationErr.message);
          throw migrationErr;
        }
      }
    }

    if (appliedCount === 0) {
      console.log('[Migration] Database is already up to date. No pending migrations.');
    } else {
      console.log(`[Migration] Successfully applied ${appliedCount} migration(s).`);
    }

    return { success: true, appliedCount };
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('[Migration] Migration process complete.');
      pool.end();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Migration] Migration failed:', err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { runMigrations };
