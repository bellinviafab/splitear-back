const express = require("express");
const router = express.Router();
//const Grupo = require("../models/Grupo.js");
const grupoController = require("../controllers/grupos.controller.js")
const authMiddleware = require("../middlewares/auth.middlwares.js")

router.post('/', authMiddleware.validateCookie, grupoController.crearGrupo); //Verificar roles



module.exports = router;