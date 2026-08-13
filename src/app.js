const express = require('express');
const app = express();

app.use(express.json());

const routes = require('./routes/auth.routes.js');

app.use('/auth', routes);

module.exports = app;
