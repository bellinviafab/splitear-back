const Grupo = require("../models/Grupo.js");
const Pertenencia = require("../models/Pertenencia.js");
const User = require("../models/User.js");

const crearGrupo = async (req, res) => {
    const { nombreGrupo } = req.body;  //Extrae el nombre del grupo y el usuario del body
    const user = req.user;
    const grupo = await Grupo.findOne({ where: { nombreGrupo: nombreGrupo, creadorId: user.id } })  //Verifica que no exista en bd para ese usuario
    if (grupo)
        return res.sendStatus(400)
    const newGrupo = await Grupo.create({
        nombreGrupo: nombreGrupo,
        creadorId: user.id
    }); //fechaFin Opcional
    const { integrantes } = req.body;
    for (integrante in integrantes) {

    }

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

module.exports = crearGrupo;