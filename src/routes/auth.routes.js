const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    res.send('Registrado con exito');
})

module.exports = router;