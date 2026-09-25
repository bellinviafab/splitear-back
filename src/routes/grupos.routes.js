const express = require("express");
const router = express.Router();
//const Grupo = require("../models/Grupo.js");
const grupoController = require("../controllers/grupos.controller.js")
const authMiddleware = require("../middlewares/auth.middlewares.js")

router.post('/', authMiddleware.validateCookie, grupoController.crearGrupo); //Verificar roles
router.post('/:id/miembros', authMiddleware.validateCookie, authMiddleware.validaPertenencia, grupoController.agregarMiembro);
router.delete('/:id', authMiddleware.validateCookie, authMiddleware.validaPermiso, grupoController.eliminarGrupo);
router.delete('/:id/miembros/:userId', authMiddleware.validateCookie, authMiddleware.validaPermiso, grupoController.eliminarMiembro);
router.get('/', authMiddleware.validateCookie, grupoController.getGrupos)
router.get('/:id', authMiddleware.validateCookie, authMiddleware.validaPertenencia, grupoController.detalleGrupo);
router.get('/:id/gastos', authMiddleware.validateCookie, authMiddleware.validaPertenencia, grupoController.listadoGastosGrupo)


module.exports = router;