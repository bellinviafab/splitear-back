const User = require("../models/User")
const { Op } = require("sequelize")


const obtenerListaUsuarios = async (nombre, idUser) => {
    const nombreBusqueda = `%${nombre}%`
    const lista = User.findAll({
        attributes: [
            'id', 'name', 'last_name', 'alias', 'email', 'image'
        ],
        where: {
            name: {
                [Op.iLike]: nombreBusqueda,
            },
            id: {
                [Op.ne]: idUser
            },
        },
        limit: 20
    })

    return lista;
}

const obtenerUsuario = async (idBusqueda) => {
    const usuario = await User.findByPk(idBusqueda, {
        attributes: ['id', 'name', 'last_name', 'alias', 'email', 'image']
    })
    return usuario
}


module.exports = { obtenerListaUsuarios, obtenerUsuario }