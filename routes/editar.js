const express = require('express')
const router = express.Router()
const controller = require('./../controllers/editar')

router.put('/professor/:cpf', controller.professor)
router.put('/disciplina/:id', controller.disciplina)
router.put('/sala/:id', controller.sala)
router.put('/turma/:id', controller.turma)

module.exports = router