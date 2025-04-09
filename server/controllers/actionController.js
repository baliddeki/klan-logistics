// File: controllers/actionController.js
const Action = require('../models/actionModel');

const getActions = (req, res) => {
  const actions = Action.getAllActions();
  res.json(actions);
};

const createAction = (req, res) => {
  const result = Action.addAction(req.body);
  res.status(201).json({ message: 'Action saved successfully', id: result.lastInsertRowid });
};

module.exports = {
  getActions,
  createAction,
};
