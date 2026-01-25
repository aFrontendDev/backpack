import type Database from 'better-sqlite3';

export interface Migration {
  name: string;
  up: (db: Database.Database) => void;
}

// Import migrations in order
import { migration as m001 } from './001_initial_schema';
import { migration as m002 } from './002_add_email_and_reset_tokens';

const migrations: Migration[] = [
  m001,
  m002,
];

export function runMigrations(db: Database.Database): void {
  // Create migrations table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      run_at INTEGER NOT NULL
    )
  `);

  // Get list of already-run migrations
  const completedMigrations = db
    .prepare('SELECT name FROM _migrations')
    .all() as { name: string }[];

  const completedSet = new Set(completedMigrations.map(m => m.name));

  // Run pending migrations in a transaction
  for (const migration of migrations) {
    if (completedSet.has(migration.name)) {
      continue;
    }

    console.log(`Running migration: ${migration.name}`);

    const runMigration = db.transaction(() => {
      migration.up(db);
      db.prepare('INSERT INTO _migrations (name, run_at) VALUES (?, ?)').run(
        migration.name,
        Date.now()
      );
    });

    runMigration();
    console.log(`Completed migration: ${migration.name}`);
  }
}
