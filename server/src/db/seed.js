const { query, pool } = require('../config/db');

/**
 * Seed initial baseline users for development and automated testing.
 */
async function seedDatabase() {
  console.log('[Seed] Seeding database with baseline identities...');

  const users = [
    {
      id: 'USR-001',
      name: 'Urvesh Somwanshi',
      email: 'citizen@civicpulse.org',
      role: 'CITIZEN',
    },
    {
      id: 'AUTH-001',
      name: 'Central Municipal Authority',
      email: 'authority@civicpulse.org',
      role: 'AUTHORITY',
    },
  ];

  for (const user of users) {
    await query(
      `INSERT INTO users (id, name, email, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE 
       SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;`,
      [user.id, user.name, user.email, user.role]
    );
    console.log(`[Seed] Seeded user: ${user.id} (${user.email})`);
  }

  console.log('[Seed] Database seeding completed successfully.');
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      pool.end();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Seeding failed:', err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedDatabase };
