const jwt = require("jsonwebtoken")

const validateCookie = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.sendStatus(401); //Acceso denegado
        const payload = validateToken(token);
        req.user = payload //Se guarda el objeto decodificado dentro de req.user para utilizar
        next();
    } catch (error) {
        return res.sendStatus(401); //Acceso denegado
    }

}

function validateToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { validateCookie }