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
        console.error("El error es:", error);
        await t.rollback();
        return res.sendStatus(500);
    }

}

async function enviarMail() {
    //Invitacion por mail
}

/*  
    El user ya esta validado por el validateCookie
    Verificar nombre de grupo
        No debe coincidir con alguno de los ya existentes creados por el usuario
    Crear Grupo y extraer id
    Asignar al grupo la fk al userCreador
    Obtener en un arreglo los participantes
    Buscarlos en la bd
        Si se encuentran, vincularlos al grupo
        Si no se encuentran porque no crearon cuenta aún, enviarles un mail de invitación
*/

module.exports = { crearGrupo };