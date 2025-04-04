const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite DB
const db = new Database(path.join(__dirname, 'actions.db'));
db.exec(`CREATE TABLE IF NOT EXISTS actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT,
  record_date TEXT,
  action_date TEXT,
  action_taken TEXT,
  remarks TEXT
);`);

// Get all saved actions
app.get('/api/actions', (req, res) => {
  const stmt = db.prepare('SELECT * FROM actions');
  const actions = stmt.all();
  res.json(actions);
});

// Save new action
app.post('/api/actions', (req, res) => {
  const { event_id, record_date, action_date, action_taken, remarks } = req.body;
  const stmt = db.prepare(
    'INSERT INTO actions (event_id, record_date, action_date, action_taken, remarks) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(event_id, record_date, action_date, action_taken, remarks);
  res.status(201).json({ message: 'Action saved successfully' });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
