const User = require('../models/User');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Op } = require("sequelize")

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
    try {
        const { identificador, password } = req.body;

        const user = await User.findOne({//Operacion de I/O, sale del stack
            where: {
                [Op.or]: [
                    { username: identificador }, { email: identificador }
                ],
            },
        })
        if (!user)  //Salida -> "Usuario y/o contraseña incorrecto"
            return res.send(401);
        const validar = await user.validarPassword(password);
        if (!validar)   //salida -> "Usuario y/o contraseña incorrectos"
            return res.send(401)
        const payload = {  //Payload para el jwt
            id: user.id,
            username: user.username
        }
        const token = generarToken(payload)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login exitoso",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        return res.status(500).json({
            error: error.name,
            message: error.message,
        });
    }
}

function generarToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" }); //Secret es constante
    console.log("El token para fabri es: ", token)
    return token;
}

const logoutUsuario = (req, res) => {
    res.clearCookie("token");
    return res.sendStatus(204);
}

module.exports = { crearUsuario, loginUsuario, logoutUsuario }

