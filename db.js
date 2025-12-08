import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPromise = open({
  filename: path.join("/mnt/data", "prn.db"),
  driver: sqlite3.Database,
});

export default {
  async run(...args) {
    const db = await dbPromise;
    return db.run(...args);
  },

  async get(...args) {
    const db = await dbPromise;
    return db.get(...args);
  },

  async all(...args) {
    const db = await dbPromise;
    return db.all(...args);
  },
};
