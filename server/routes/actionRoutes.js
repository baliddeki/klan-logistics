// File: routes/actionRoutes.js
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

router.get('/actions', actionController.getActions);
router.post('/actions', actionController.createAction);

module.exports = router;
