import Database, { type Database as DatabaseType } from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

let _connection: DatabaseType;
let _db: BetterSQLite3Database<typeof schema>;

function _openDb() {
  if (_connection) _connection.close();
  const sqlite = new Database("sqlite.db");
  sqlite.pragma("journal_mode = WAL");
  _connection = sqlite;
  _db = drizzle(sqlite, { schema });
}

export function closeDb() {
  if (_connection) {
    _connection.close();
  }
}

export function openDb() {
  closeDb();
  _openDb();
}

export function getDb() {
  if (!_db) _openDb();
  return _db;
}

_openDb();
