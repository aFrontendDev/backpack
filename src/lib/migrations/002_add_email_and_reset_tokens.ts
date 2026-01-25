import type Database from 'better-sqlite3';
import type { Migration } from './index';

export const migration: Migration = {
  name: '002_add_email_and_reset_tokens',
  up: (db: Database.Database) => {
    // Add email column to users table
    // SQLite doesn't allow adding UNIQUE columns directly, so we add the column
    // and then create a unique index separately
    db.exec(`ALTER TABLE users ADD COLUMN email TEXT DEFAULT ''`);
    db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)`);

    // Create password reset tokens table
    db.exec(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
  },
};
