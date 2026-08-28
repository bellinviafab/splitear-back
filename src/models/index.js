const Usuario = require("./User")
const Grupo = require("./Grupo")
const Pertenencia = require("./Pertenencia")

Grupo.belongsTo(Usuario, { as: 'creador', foreignKey: 'creadorId' })

module.exports = Grupo;