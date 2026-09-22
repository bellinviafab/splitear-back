const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middlewares.js")
const gastosController = require("../controllers/gastos.controller.js");

router.post('/:id', authMiddleware.validateCookie, gastosController.crearGasto);
router.delete('/:id/:idGasto', authMiddleware.validateCookie, gastosController.eliminarGasto);
router.post('/grupos/:id/balance', authMiddleware.validateCookie, gastosController.liquidarDeuda)




module.exports = router