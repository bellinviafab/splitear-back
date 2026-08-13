const Sequelize = require('sequelize')
const sequelize = new Sequelize("DB_NAME", DB_USER, DB_PASSWORD, { //Pasar credenciales al .env
    dialect: 'postgres',
    host: 'DB_HOST'
})

module.exports = sequelize