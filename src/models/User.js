const S = require('sequelize')
const db = require('../db')

class User extends S.Model { } //Declara clase user y hereda modelo de sequelize

User.init({
    username: {
        type: S.STRING,
        allowNull: false
    },
    email: {
        type: S.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true //Validación nativa de sequelize
        }
    },
    age: {
        type: S.INTEGER
    },
    name: {
        type: S.STRING,
        allowNull: false
    },
    last_name: {
        type: S.STRING,
        allowNull: false
    },
    alias: {
        type: S.STRING
    },
    image: {
        type: S.STRING,
        allowNull: true
    }
}, { sequelize: db, modelName: "user" })

module.exports = User