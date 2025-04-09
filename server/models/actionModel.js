// File: models/actionModel.js
const db = require('../db/database');

const getAllActions = () => {
  const stmt = db.prepare('SELECT * FROM actions');
  return stmt.all();
};

const addAction = (action) => {
  const { event_id, record_date, action_date, action_taken, remarks } = action;
  const stmt = db.prepare(
    'INSERT INTO actions (event_id, record_date, action_date, action_taken, remarks) VALUES (?, ?, ?, ?, ?)'
  );
  return stmt.run(event_id, record_date, action_date, action_taken, remarks);
};

module.exports = {
  getAllActions,
  addAction,
};
