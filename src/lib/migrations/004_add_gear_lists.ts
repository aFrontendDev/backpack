import type Database from 'better-sqlite3';
import type { Migration } from './index';

export const migration: Migration = {
  name: '004_add_gear_lists',
  up: (db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS gear_lists (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        target_weight_g REAL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_gear_lists_user_id ON gear_lists(user_id);

      CREATE TABLE IF NOT EXISTS gear_list_items (
        id TEXT PRIMARY KEY,
        list_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (list_id) REFERENCES gear_lists(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_gear_list_items_list_id ON gear_list_items(list_id);
      CREATE INDEX IF NOT EXISTS idx_gear_list_items_item_id ON gear_list_items(item_id);
    `);
  },
};
