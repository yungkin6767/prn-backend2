import db from "./db.js";

async function init() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      subscription TEXT DEFAULT 'free',
      diamonds INTEGER DEFAULT 0
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      code TEXT,
      created_at TEXT,
      updated_at TEXT
    );
  `);

  console.log("PRN Database Initialized.");
}

init();

