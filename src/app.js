const express = require('express');
const app = express();
const routes = require('./routes/auth.routes.js');

app.use(express.json());

app.use('/auth', routes);

module.exports = app;
