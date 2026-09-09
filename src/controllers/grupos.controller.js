const Grupo = require("../models/Grupo.js");
const Pertenencia = require("../models/Pertenencia.js");
const User = require("../models/User.js");
const s = require('../db.js')


const crearGrupo = async (req, res) => {
    const t = await s.transaction();
    try {
        const { nombreGrupo } = req.body;  //Extrae el nombre del grupo y el usuario del body
        const user = req.user;
        const grupo = await Grupo.findOne({ where: { nombreGrupo: nombreGrupo, creadorId: user.id }, transaction: t })  //Verifica que no exista en bd para ese usuario
        if (grupo) {
            await t.rollback(); //Cancelo la transaccion y libero la bd.
            return res.sendStatus(400); //Invalido por existencia del grupo con ese nombre en la cuenta de ese usuario
        }
        const newGrupo = await Grupo.create({
            nombreGrupo: nombreGrupo,
            creadorId: user.id   //fechaFin Opcional
        }, { transaction: t });

        const { integrantes = [] } = req.body;
        const arrayIntegrantes = [];

        for (let integrante of integrantes) {
            const newIntegrante = await User.findOne({ where: { email: integrante.email }, transaction: t })
            if (!newIntegrante)
                enviarMail(integrante.email, newGrupo.nombreGrupo);
            else
                arrayIntegrantes.push(newIntegrante);
        }
        //const usuarioCreador = await User.findByPk(user.id, { transaction: t }) //Añadir al administrador como integrante del grupo.
        arrayIntegrantes.push(user.id);
        await newGrupo.addUsers(arrayIntegrantes, { transaction: t });

        await t.commit();
        return res.status(201).json(newGrupo);
    } catch (error) {
        await t.rollback();
        return res.sendStatus(500);
    }

}

async function enviarMail() {
    //Invitacion por mail
}

const eliminarGrupo = async (req, res) => {  //Soft delete
    try {
        const idUser = req.user.id;
        const idGrupo = req.params.id;
        const grupo = await Grupo.findOne({ where: { id: idGrupo, creadorId: idUser } }) //Busqueda por id y por fk al creador
        if (!grupo)
            return res.sendStatus(404); //Grupo no encontrado
        await grupo.destroy();
        return res.status(200).json({ mensaje: "Grupo eliminado exitosamente" }); //Grupo soft-deleted
    } catch (error) {
        return res.sendStatus(500);
    }

}

const agregarMiembro = async (req, res) => {
    try {
        const { integrante = {} } = req.body;
        const grupo = await Grupo.findOne({ where: { id: req.params.id, creadorId: req.user.id } })
        if (!grupo)
            return res.status(404).json({ mensaje: "Grupo no encontrado y/o Usuario no autorizado" });

        const newIntegrante = await User.findOne({ where: { email: integrante.email } })

        if (!newIntegrante) {
            enviarMail(integrante.email, grupo);
            return res.status(200).json({ mensaje: "El usuario no posee cuenta, se ha enviado un email de invitación" })
        }

        if (await grupo.hasUser(newIntegrante))
            return res.status(400).json({ mensaje: "Usuario ya forma parte del grupo" })

        await grupo.addUser(newIntegrante);
        return res.status(200).json({ mensaje: "Usuario añadido con exito" })
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

const eliminarMiembro = async (req, res) => {
    try {
        const grupo = await Grupo.findOne({ where: { id: req.params.id, creadorId: req.user.id } })
        const miembroElim = Number(req.params.userId) //Express parsea params como string
        if (!grupo) //Grupo inexistente o usuario no tiene permisos por no ser el creador
            return res.status(404).json({ mensaje: "Grupo no encontrado y/o Usuario no autorizado" })

        if (miembroElim == req.user.id)
            return res.status(400).json({ mensaje: "El administrador no puede eliminarse" })

        if (!(await grupo.hasUser(miembroElim)))
            return res.status(400).json({ mensaje: "Usuario no pertenece al grupo" })

        await grupo.removeUser(miembroElim)
        return res.status(200).json({ mensaje: "Miembro eliminado con exito" })
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}


module.exports = { crearGrupo, eliminarGrupo, agregarMiembro, eliminarMiembro };