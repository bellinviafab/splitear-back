const S = require("sequelize");
const db = require("../db");

class Pertenencia extends S.Model { };

Pertenencia.init({/*Fk a grupo y fk a user*/ }, { sequelize: db, modelName: pertenencia });

module.exports = Pertenencia;