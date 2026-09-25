const Grupo = require("../models/Grupo")
const User = require("../models/User")
const gastosService = require("./gastos.service")

const getGrupos = async (idUser) => {
    const listaGrupos = await Grupo.findAll({
        attributes: ['id', 'nombreGrupo', 'fechaFin', 'image'],

        include: [{
            model: User,    //Como User tiene belongsToMany through pertenencia, se debe llamar al modelo final.
            where: { id: idUser },
            attributes: [],
            through: { attributes: [] } // Evita que el JSON traiga el objeto Pertenencia
        }]
    })
    return listaGrupos
}

const getGrupo = async (idGrupo) => {  //Utilizado para detalleGrupo
    return await Grupo.findByPk(idGrupo, {
        attributes: ['id', 'nombreGrupo', 'fechaFin', 'image']
    })
}

const getDetalleGrupo = async (idGrupo) => {
    const grupo = await getGrupo(idGrupo);  //Se debe validar primero el grupo
    if (!grupo)  //fail fast
        return null

    const integrantes = await User.findAll({
        attributes: ['id', 'name', 'last_name', 'alias', 'image'],

        include: [{
            model: Grupo,
            where: { id: idGrupo },
            attributes: [],
            through: { attributes: [] }
        }]
    })

    const gastosMap = await gastosService.obtenerGastoTotalIntegrante(idGrupo);
    const gastosPorIntegrante = Object.fromEntries(gastosMap) //Se debe pasar a un arreglo de objetos. El front no puede deserializar un map desde un json

    let sumaTotal = 0
    for (const monto of gastosMap.values()) { sumaTotal += monto }
    const gastoTotalGrupo = sumaTotal
    return { grupo, integrantes, gastosPorIntegrante, gastoTotalGrupo }
}

const validaPermiso = async (idUser, idGrupo) => {
    return await Grupo.findOne({
        where: { id: idGrupo, creador: idUser }
    })
}


module.exports = { getGrupos, getDetalleGrupo, validaPermiso }