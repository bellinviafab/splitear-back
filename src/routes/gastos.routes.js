const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middlewares.js")
const gastosController = require("../controllers/gastos.controller.js");

router.post('/grupos/:id/gastos', authMiddleware.validateCookie, gastosController.crearGasto);




module.exports = router