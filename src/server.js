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

    success = await db.newUser(username, password);

    if (!success)
        return res.status(500).send("Error registering user.");

    const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });

    response = {
        token: token,
        user: {
            username: username,
            level: 1
        }
    }

    res.status(201).json(response);
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    const user = await db.getUser(username);

    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).send("Invalid login.");

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    response = {
        token: token,
        user: {
            username: username,
            level: user.level
        }
    }


    res.json(response);
});

app.get('/tickets', auth, async (req, res) => {
    const {username} = req.query;

    const user = await db.getUser(username);

    if (!user)
        return res.status(500).send("Invalid user.");

    let perms = user.level != db.level.user;
    const {success, tickets} = perms ? await db.getAllTickets() : await db.getUserTickets(user.id);
        
    if (!success)
        return res.status(500).send("Server error");

    res.json(tickets);
});

app.get('/users', auth, async (req, res) => {
    const {username} = req.query;
    const user = await db.getUser(username);

    if (!user)
        return res.status(500).send("Invalid user.");

    if (user.level != db.level.admin)
        return res.status(403).send("Protected route");

    const {success, users} = await db.getUsersSummary();

    if (!success)
        return res.status(500).send("Server error");

    res.json(users);
});

app.post('/ticket', auth, async (req, res) => {    
    const {username, title, description} = req.body;

    const user = await db.getUser(username);

    if (!user)
        return res.status(401).send("Invalid username");

    ticket = {
        user_id: user.id,
        owner: username,
        title: title,
        description: description
    }

    success = await db.newTicket(ticket);

    if (!success)
        return res.status(500).send("Server error. Could not create ticket.");

    res.status(200).send("Created ticket");
});

app.post('/updateUserLevel', auth, async (req, res) => {
    const {username, updates} = req.body; // key pairs

    const sourceUser = await db.getUser(username);

    if (!sourceUser)
        return res.status(401).send("Invalid user");

    if (sourceUser.level != db.level.admin)
        return res.status(403).send("Unauthorized");

    let success = true;
    for (const [user, newlevel] of Object.entries(updates))
        success &= await db.setUserLevel(user, newlevel);

    const users = await db.getUsersSummary();

    if (!success)
        return res.status(500).send("Server error");

    res.status(200).send("Updated");
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});