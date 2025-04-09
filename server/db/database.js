// File: db/database.js
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../actions.db'));

db.exec(`CREATE TABLE IF NOT EXISTS actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT,
  record_date TEXT,
  action_date TEXT,
  action_taken TEXT,
  remarks TEXT
);`);

module.exports = db;
