const User = require('../models/User');
const bcrypt = require("bcrypt")

const crearUsuario = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const { password, salt, ...usuarioPublico } = newUser.toJSON();
        console.log(usuarioPublico)
        res.status(201).json(usuarioPublico);
    } catch (error) {
        res.status(400).json({
            error: error.name,
            message: error.message
        })
    }
}

const loginUsuario = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username: username } })
    if (!user)  //Usuario y/o contraseña incorrecto
        return res.send(401);
    const validar = await user.validarPassword(password);
    if (!validar)   //Usuario y/o contraseña incorrectos
        return res.send(401)

    return res.send(200); //login exitoso
}



const logoutUsuario = async (req, res) => {

}

module.exports = { crearUsuario, loginUsuario, logoutUsuario }

