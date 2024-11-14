const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database(':memory:');
require('dotenv').config({path:'../.env'});

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

const level = {
    user: 1,
    agent: 2,
    admin: 3
}

// Create tables:
//      users -- submit tickets and take on tickets (if elevated perms)
//      tickets -- the actual tickets
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    level INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    agent_id INTEGER,
    owner TEXT,
    agent TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status BOOL DEFAULT True,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (agent_id) REFERENCES users (id)
  )`);

  bcrypt.hash(ADMIN_PASS, 10, (err, hashed) => {
    if (err) {
        console.error('Error hashing admin pass:', err);
        return;
    }

    db.run(`INSERT INTO users (username, password, level) VALUES (?, ?, 3)`, [ADMIN_USER, hashed], function (err) {
      if (err) {
        console.log(err);
      }

      console.log("initialized root user");
    });
  });
});

async function getUser(username) {
    const query = `SELECT * FROM users WHERE username = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [username], async (err, user) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(user);
        });
    });
}

async function getUserTickets(user_id) {
    const query = `SELECT * FROM tickets WHERE user_id = ?`;

    return new Promise((resolve, reject) => {
        db.all(query, [user_id], (err, tickets) => {
            if (err) {
                reject({success: false, tickets: []});
                return;
            }

            resolve({success: true, tickets: tickets});
        });
    });
}

async function getAllTickets() {
    const query = `SELECT * FROM tickets`;

    return new Promise((resolve, reject) => {
        db.all(query, (err, tickets) => {
            if (err) {
                reject({success: false, tickets: []});
                return;
            }

            resolve({success: true, tickets: tickets});
        });
    });
}

async function newUser(username, password) {
    const query = `INSERT INTO users (username, password, level) VALUES (?, ?, 1)`;
    const hashed = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      db.run(query, [username, hashed], function (err) {
          if (err) {
              reject(false);
              return;
          }

          resolve(true);
      });
    });
}

async function newTicket(ticket) {
    const {user_id, owner, title, description} = ticket;
    const query = `INSERT INTO tickets (user_id, owner, title, description) VALUES (?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(query, [user_id, owner, title, description], (err) => {
            if (err) {
                reject(false);
                return;
            }

            resolve(true);
        })
    });
}

module.exports = {
  db,
  level,
  getUser,
  getUserTickets,
  getAllTickets,
  newUser,
  newTicket
};