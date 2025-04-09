// File: server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const actionRoutes = require('../routes/actionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', actionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
