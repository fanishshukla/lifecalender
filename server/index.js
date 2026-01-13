const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Get all data for a specific user (User ID 1 for now)
app.get('/api/user-data/:userId', async (req, res) => {
    try {
        const goals = await pool.query('SELECT * FROM goals WHERE user_id = $1', [req.params.userId]);
        const events = await pool.query('SELECT * FROM events WHERE user_id = $1', [req.params.userId]);
        res.json({ goals: goals.rows, events: events.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post a new Goal
app.post('/api/goals', async (req, res) => {
    const { user_id, goal_type, target_date, content, color } = req.body;
    
    // Check if target_date is empty before sending to DB
    if (!target_date || target_date === "") {
        return res.status(400).json({ error: "Date cannot be empty" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO goals (user_id, goal_type, target_date, content, color) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, goal_type, target_date, content, color]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("DB Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Register Route
app.post('/api/register', async (req, res) => {
    const { username, password, birthDate } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password, birth_date) VALUES ($1, $2, $3) RETURNING id, username, birth_date',
            [username, password, birthDate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "Username already exists" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a goal
app.delete('/api/goals/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM goals WHERE id = $1', [req.params.id]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a goal (Edit)
app.put('/api/goals/:id', async (req, res) => {
    const { content, target_date, color } = req.body;
    try {
        const result = await pool.query(
            'UPDATE goals SET content = $1, target_date = $2, color = $3 WHERE id = $4 RETURNING *',
            [content, target_date, color, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/goals/:id/toggle', async (req, res) => {
    try {
        await pool.query('UPDATE goals SET is_done = NOT is_done WHERE id = $1', [req.params.id]);
        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Add Event Route
app.post('/api/events', async (req, res) => {
    const { user_id, title, from_date, to_date, color, event_type } = req.body;
    
    // Basic validation
    if (!title || !from_date || !to_date) {
        return res.status(400).json({ error: "Missing required event fields" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO events (user_id, title, from_date, to_date, color, event_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user_id, title, from_date, to_date, color, event_type]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Event DB Error:", err.message);
        res.status(500).json({ error: "Database error while saving event" });
    }
});


app.listen(5000, () => console.log('Backend listening on http://localhost:5000'));