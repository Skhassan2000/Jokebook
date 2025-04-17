const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jokebook.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    setup TEXT NOT NULL,
    delivery TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);
});

module.exports = db;
