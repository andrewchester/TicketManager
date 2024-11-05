const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database(':memory:');
require('dotenv').config({path:'../.env'});

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

// Create tables:
//      users -- submit tickets and take on tickets (if elevated perms)
//      tickets -- the actual tickets
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    elevated BOOL NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    agent_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (agent_id) REFERENCES users (id)
  )`);

  bcrypt.hash(ADMIN_PASS, 10, (err, hashed) => {
    if (err) {
        console.error('Error hashing admin pass:', err);
        return;
    }

    db.run(`INSERT INTO users (username, password, elevated) VALUES (?, ?, TRUE)`, [ADMIN_USER, hashed], function (err) {
      if (err) {
        console.log(err);
      }

      console.log("initialized root user");
    });
  });
});

module.exports = db;