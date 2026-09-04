const User = require("./User")
const Grupo = require("./Grupo")
const Pertenencia = require("./Pertenencia")

Grupo.belongsTo(User, { as: 'creador', foreignKey: 'creadorId' })
User.belongsToMany(Grupo, { through: Pertenencia, foreignKey: 'integranteId' })
Grupo.belongsToMany(User, { through: Pertenencia, foreignKey: 'grupoId' })

module.exports = { Grupo, User };