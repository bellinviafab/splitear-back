const express = require('express');
const router = express.Router();
const User = require('../models/User')
const authController = require('../controllers/auth.controller')

/*router.get('/register', (req, res) => {
    User.findAll().then(result => res.send(result))
})*/

router.post('/register', authController.crearUsuario);
router.post('/login', authController.loginUsuario);
router.post('/logout', authController.logoutUsuario);


module.exports = router;