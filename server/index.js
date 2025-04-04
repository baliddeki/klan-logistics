const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./actions.db');

app.use(bodyParser.json());

// Initialize database
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

// Save action to the database
app.post('/api/actions', (req, res) => {
  const { eventId, recordDate, actionDate, actionTaken, remarks } = req.body;

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
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
