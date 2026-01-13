require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db'); 
const app = express();

// --- CONFIGURATION ---
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_123';

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE: AUTHENTICATION ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user; 
        next();
    });
};

// --- AUTH ROUTES ---

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; 
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)', 
            [email]
        );
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (user.password === password) {
                const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
                return res.json({ 
                    token, 
                    user: { id: user.id, email: user.email, username: user.username, birth_date: user.birth_date } 
                });
            }
        }
        res.status(401).json({ error: "Invalid credentials" });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, birth_date FROM users WHERE id = $1', [req.user.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error fetching profile" });
    }
});

// --- EVENT ROUTES (Timeline) ---

app.get('/api/events', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events WHERE user_id = $1 ORDER BY from_date ASC', [req.user.id]);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/events', authenticateToken, async (req, res) => {
    const { title, from_date, to_date, color, event_type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO events (user_id, title, from_date, to_date, color, event_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.id, title, from_date, to_date, color, event_type || 'life']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
    const { title, from_date, to_date, color } = req.body;
    try {
        const result = await pool.query(
            'UPDATE events SET title=$1, from_date=$2, to_date=$3, color=$4 WHERE id=$5 AND user_id=$6 RETURNING *', 
            [title, from_date, to_date, color, req.params.id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM events WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- GOAL ROUTES (Right Sidebar) ---

app.get('/api/goals', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY target_date ASC', [req.user.id]);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/goals', authenticateToken, async (req, res) => {
    const { content, target_date, color, goal_type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO goals (user_id, content, target_date, color, goal_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, content, target_date, color, goal_type || 'personal']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/goals/:id', authenticateToken, async (req, res) => {
    const { content, target_date, color } = req.body;
    try {
        const result = await pool.query(
            'UPDATE goals SET content=$1, target_date=$2, color=$3 WHERE id=$4 AND user_id=$5 RETURNING *', 
            [content, target_date, color, req.params.id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/goals/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM goals WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));