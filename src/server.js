const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const auth = require('../middleware/auth');
require('dotenv').config({path: '../.env'});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const hashed = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password, elevated) VALUES (?, ?, FALSE)`, [username, hashed], function (err) {
        if (err) {
            console.log(err);
            return res.status(401).send("Invalid registration.")
        }

        const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, message: `${username} registered` });

        console.log('registered', username);
    });
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid login.");
        }

        console.log(username, 'logged in');

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    });
});

app.get('/tickets', auth, (req, res) => {
    const {username} = req.headers;
    console.log('getting tickets for', username);
    
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).send("Invalid username");
        }

        db.all(`SELECT * FROM tickets WHERE user_id = ?`, [user.id], function (err, tickets) {
            if (err) {
                console.log(err);
                return res.status(401).send("Server error.");
            }

            res.status(200).json(tickets);
        });
    });
});

app.post('/ticket', auth, (req, res) => {    
    const {username, title, description} = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).send("Invalid username");
        }

        db.run(`INSERT INTO tickets (user_id, title, description) VALUES (?, ?, ?)`, [user.id, title, description], function (err) {
            if (err) {
                console.log(err);
                return res.status(401).send("Server error.")
            }

            console.log('inserted into tickets:');
            console.log('\t',title);
            console.log('\t',description);
            console.log();

            res.status(200).send("Created ticket");
        });
    });
});


const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});