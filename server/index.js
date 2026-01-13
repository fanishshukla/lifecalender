require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // MAKE SURE THIS IS INSTALLED
const pool = require('./db'); 
const app = express();

app.use(cors());
app.use(express.json());

// --- LOGIN ROUTE WITH STEP-BY-STEP LOGGING ---
app.post('/api/login', async (req, res) => {
  console.log("--- Login Attempt Started ---");
  const { email, password } = req.body; 
  
  try {
    console.log("Step 1: Checking database for user:", email);
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)', 
      [email]
    );
    
    console.log("Step 2: Database query finished. Rows found:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("Result: User not found");
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];
    console.log("Step 3: Comparing passwords...");

    if (user.password !== password) {
      console.log("Result: Password mismatch");
      return res.status(401).json({ error: "Invalid password" });
    }

    console.log("Step 4: Creating JWT Token...");
    // If the server stops here, 'jsonwebtoken' is likely not installed correctly
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev_secret_123',
      { expiresIn: '24h' }
    );

    console.log("Step 5: Sending successful response!");
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, birth_date: user.birth_date } 
    });

  } catch (err) {
    console.error("!!! CRITICAL LOGIN ERROR !!!");
    console.error(err); // This prints the full error stack trace
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Helper for other routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_123', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT id, username, email, birth_date FROM users WHERE id = $1', [req.user.id]);
  res.json(result.rows[0]);
});

// Basic error handling for the app
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).send('Something broke!');
});

app.listen(5000, () => console.log(`🚀 Server running on http://localhost:5000`));