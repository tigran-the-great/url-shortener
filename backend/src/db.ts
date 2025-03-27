import Database from "better-sqlite3";
import path from "path";

const isTest = process.env.NODE_ENV === "test";

const db = isTest
  ? new Database(":memory:")
  : new Database(path.resolve(__dirname, "../data.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE,
    originalUrl TEXT NOT NULL,
    visitCount INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
