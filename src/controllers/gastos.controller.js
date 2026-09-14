const Gasto = require("../models/Gasto")
const Grupo = require("../models/Grupo")
const Pertenencia = require("../models/Pertenencia")
const User = require("../models/User")
const { Op } = require("sequelize")
const gastoService = require("../services/gastos.service")

const crearGasto = async (req, res) => {
    try {
        const user = req.user;
        const idGrupo = req.params.id;
        const { monto, descripcion } = req.body;
        const grupo = await Grupo.findByPk(idGrupo)
        if (!grupo)
            return res.status(404).json({ mensaje: "Grupo no encontrado" })
        if (!monto)
            return res.status(400).json({ mensaje: "Monto invalido y/o inexistente" })
        const userParticipante = await Pertenencia.findOne({
            where: {
                [Op.and]: [
                    { integranteId: user.id }, { grupoId: grupo.id }
                ],
            },
        });
        if (!userParticipante)
            return res.status(403).json({ mensaje: "Usuario no pertenence y/o no existe en el grupo" })

        const { participantes = [] } = req.body;
        const arrayParticipantes = [];
        arrayParticipantes.push(user)
        console.log("aca")
        for (let participante of participantes) {   //Cambiar consulta para evitar N+1
            const newParticipante = await Pertenencia.findOne({ where: { integranteId: participante.id, grupoId: grupo.id } }) //Que sucede con los que dan null?
            if (!newParticipante)
                return res.status(400).json({ mensaje: `El participante con ID ${participante.id} no pertenece al grupo` })
            else
                arrayParticipantes.push(participante)
        }
        console.log("aca")
        const nuevoGasto = await gastoService.procesarYCrearGasto(grupo.id, arrayParticipantes, monto, user.id, descripcion)
        return res.status(201).json(nuevoGasto);
    } catch (error) {
        return res.status(500).json(error);
    }
}



/*
Traer al user desde req.user
Traer al grupo
Validar el grupo
validar que forme parte del grupo
Validar a los usuarios que forman parte del gasto
    Validar que formen parte del grupo

Crear Gasto general
Crear Detalle de gasto

*/


module.exports = { crearGasto };