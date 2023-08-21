const express = require('express')
const router = express.Router()
const controller = require('./../controllers/editar')

router.put('/:cpf', controller.update)

module.exports = router