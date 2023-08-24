const express = require('express')
const router = express.Router()
const controller = require('./../controllers/editar')

router.put('/professor/:cpf', controller.professor)
router.put('/disciplina/:id', controller.disciplina)

module.exports = router