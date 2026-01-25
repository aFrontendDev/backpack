import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { runMigrations } from './migrations/index';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use absolute path for database, defaulting to data directory outside web root
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../data/database.db');

export const db = new Database(dbPath);

// Run migrations to initialize/update database schema
runMigrations(db);

export default db;
