const User = require("./User")
const Grupo = require("./Grupo")
const Pertenencia = require("./Pertenencia")
const Gasto = require("./Gasto")
const Detalle_gasto = require("./Detalle_gasto")

Grupo.belongsTo(User, { as: 'creador', foreignKey: 'creadorId' }) //1:1 por ser creador
User.belongsToMany(Grupo, { through: Pertenencia, foreignKey: 'integranteId' }) //M:N Usuario--Integra--Grupo
Grupo.belongsToMany(User, { through: Pertenencia, foreignKey: 'grupoId' })  //M:N Grupo--Contiene--Usuario
Grupo.hasMany(Gasto, { as: 'gastoRealizado', foreignKey: 'idGrupo' })
User.hasMany(Gasto, { as: 'creadorGasto', foreignKey: 'idCreadorGasto' })
User.belongsToMany(Gasto, { through: Detalle_gasto, foreignKey: 'idParticipante', otherKey: 'idGasto', as: 'gastos' })
Gasto.belongsToMany(User, { through: Detalle_gasto, foreignKey: 'idGasto', otherKey: 'idParticipante', as: 'participantes' })
Detalle_gasto.belongsTo(Gasto, { as: 'gasto', foreignKey: 'idGasto' });
Detalle_gasto.belongsTo(User, { as: 'participante', foreignKey: 'idParticipante' })  //Permite consultas directas

module.exports = { Grupo, User, Gasto, Detalle_gasto };