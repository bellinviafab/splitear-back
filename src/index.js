require('dotenv').config();
const app = require('./app');
const db = require('./db');
const PORT = process.env.PORT || 3000; //Crear .env


db.sync().then(() => {
    app.listen(PORT)
})



