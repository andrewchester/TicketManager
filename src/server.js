const express = require('express');
const cors = require('cors');
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

    console.log('created user', username);

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

    res.status(200).json(response);
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

    if (!success)
        return res.status(500).send("Server error");

    res.status(200).send("Updated");
});

app.post('/update', auth, async (req, res) => {
    const {username, title, updateText} = req.body;

    const sourceUser = await db.getUser(username);

    if (!sourceUser)
        return res.status(401).send("Invalid user");

    let {success, ticket} = await db.getTicketByName(title);

    if (!success)
        return res.status(500).send("Error fetching ticket.");

    if (sourceUser.level != db.level.admin && ticket.agent != sourceUser.username)
        return res.status(403).send("Forbidden");

    success = await db.addUpdate(title, username, updateText);

    if (!success)
        return res.status(500).send("Failed to add update");

    res.status(200).send("Successful update");
});

app.get('/updates', auth, async (req, res) => {
    const {username, title} = req.query;

    const sourceUser = await db.getUser(username);

    if (!sourceUser)
        return res.status(401).send("Invalid user");

    const {ticket} = await db.getTicketByName(title);
    
    if (ticket.owner != sourceUser.username && sourceUser.level == db.level.user)
        return res.status(403).send("Forbidden");

    const {updates} = await db.getUpdates(ticket.id);
    res.status(200).json(updates);
});

app.post('/assign', auth, async (req, res) => {
    const {assigner, assignee, title} = req.body;
    const assignerUser = await db.getUser(assigner);

    if (!assignerUser)
        return res.status(401).send("Invalid user");

    const {ticket} = await db.getTicketByName(title);

    if (assignerUser.level == db.level.user || 
       (ticket.agent != null && assignerUser.level != db.level.admin))
        return res.status(403).send("Forbidden");
    
    success = await db.updateAssignment(ticket.id, assignee);

    if (!success)
        return res.status(500).send("Server error");

    console.log("Assigned", ticket.title, "to", assignee);
    res.status(200).send("Assigned");
});

app.post('/close', auth, async (req, res) => {
    const {username, title} = req.body;
    const user = await db.getUser(username);

    console.log(username, title);

    if (!user)
        return res.status(401).send("Invalid user");

    const {ticket} = await db.getTicketByName(title);

    if (!ticket)
        return res.status(404).send("Ticket not found");

    if (user.level != db.level.admin && ticket.agent != user.username)
        return res.status(403).send("Forbidden");

    success = await db.updateTicketStatus(title, false);

    if (!success)
        return res.status(500).send("Server error");

    console.log("Closed", title);
    res.status(200).send("Closed");
});

app.post('/reopen', auth, async (req, res) => {
    const {username, title} = req.body;
    const user = await db.getUser(username);

    if (!user)
        return res.status(401).send("Invalid user");

    const {ticket} = await db.getTicketByName(title);

    if (!ticket)
        return res.status(404).send("Ticket not found");

    if (user.level != db.level.admin && ticket.agent != user.username)
        return res.status(403).send("Forbidden");

    success = await db.updateTicketStatus(title, true);

    if (!success)
        return res.status(500).send("Server error");

    console.log("Reopened", title);
    res.status(200).send("Reopened");
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});