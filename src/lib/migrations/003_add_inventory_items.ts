import type Database from 'better-sqlite3';
import type { Migration } from './index';

export const migration: Migration = {
  name: '003_add_inventory_items',
  up: (db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        brand TEXT,
        weight_g REAL NOT NULL DEFAULT 0,
        category TEXT,
        is_owned INTEGER NOT NULL DEFAULT 1,
        url TEXT,
        notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id ON inventory_items(user_id);
    `);
  },
};
