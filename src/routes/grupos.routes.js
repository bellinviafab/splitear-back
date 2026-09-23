const express = require("express");
const router = express.Router();
//const Grupo = require("../models/Grupo.js");
const grupoController = require("../controllers/grupos.controller.js")
const authMiddleware = require("../middlewares/auth.middlewares.js")

router.post('/', authMiddleware.validateCookie, grupoController.crearGrupo); //Verificar roles
router.post('/:id/miembros', authMiddleware.validateCookie, grupoController.agregarMiembro);
router.delete('/:id', authMiddleware.validateCookie, grupoController.eliminarGrupo);
router.delete('/:id/miembros/:userId', authMiddleware.validateCookie, grupoController.eliminarMiembro);
router.get('/', authMiddleware.validateCookie, grupoController.getGrupos)


module.exports = router;