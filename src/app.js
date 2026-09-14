const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes.js');
const cookieParser = require('cookie-parser');
const grupoRoutes = require("./routes/grupos.routes.js");
const gastoRoutes = require("./routes/grupos.routes.js")

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/grupos', grupoRoutes);
app.use('/gastos', gastoRoutes);


module.exports = app;
