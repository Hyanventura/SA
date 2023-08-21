const express = require('express')
const router = express.Router()
const controller = require('./../controllers/delete')

router.delete('/:cpf', controller.delete)

module.exports = router