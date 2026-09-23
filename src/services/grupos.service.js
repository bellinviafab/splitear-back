const Grupo = require("../models/Grupo")
const User = require("../models/User")

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

module.exports = { getGrupos }