const S = require("sequelize");
const db = require("../db");

class Grupo extends S.Model { };

Grupo.init({
    nombreGrupo: {
        type: S.STRING,
        allowNull: false,
    },
    fechaFin: {
        type: S.DATE,
        allowNull: true,
    }
}, { sequelize: db, modelName: 'grupo' })

module.exports = Grupo;