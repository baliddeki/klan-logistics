const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // To allow CORS requests

const app = express();

// Enable CORS
app.use(cors());

// Use environment variables for configuration
const PORT = process.env.PORT || 5000; // Port based on environment variable
const DB_PATH = process.env.DB_PATH || './actions.db'; // Local SQLite or DB URL

let db;

// Check if we're using a remote DB (e.g., PostgreSQL) or SQLite for local
if (process.env.NODE_ENV === 'production') {
  // Connect to remote DB if in production (adjust for your platform)
  // For example, connecting to a PostgreSQL database
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: process.env.DATABASE_URL, // Use your cloud DB URL here
    ssl: { rejectUnauthorized: false }, // Optional, based on platform requirements
  });
} else {
  // Local SQLite database for development
  db = new sqlite3.Database(DB_PATH);
}

// Initialize database (Local SQLite or cloud DB)
if (process.env.NODE_ENV !== 'production') {
  // For SQLite (Local Development)
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId INTEGER,
        recordDate TEXT,
        actionDate TEXT,
        actionTaken TEXT,
        remarks TEXT
      )`
    );
  });
}

// Save action to the database
app.post('/api/actions', (req, res) => {
  const { eventId, recordDate, actionDate, actionTaken, remarks } = req.body;

  if (process.env.NODE_ENV === 'production') {
    // For cloud DB (PostgreSQL or other)
    const query = 'INSERT INTO actions (eventId, recordDate, actionDate, actionTaken, remarks) VALUES ($1, $2, $3, $4, $5)';
    const values = [eventId, recordDate, actionDate, actionTaken, remarks];
    
    db.query(query, values)
      .then((result) => {
        res.status(200).json({
          id: result.rows[0].id,
          eventId,
          recordDate,
          actionDate,
          actionTaken,
          remarks,
        });
      })
      .catch((err) => {
        console.error('Error saving action:', err);
        res.status(500).json({ error: 'Failed to save action' });
      });
  } else {
    // For SQLite (Local Development)
    const stmt = db.prepare(
      `INSERT INTO actions (eventId, recordDate, actionDate, actionTaken, remarks) VALUES (?, ?, ?, ?, ?)`
    );
    stmt.run(eventId, recordDate, actionDate, actionTaken, remarks, function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save action' });
      }
      res.status(200).json({
        id: this.lastID,
        eventId,
        recordDate,
        actionDate,
        actionTaken,
        remarks,
      });
    });
    stmt.finalize();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
