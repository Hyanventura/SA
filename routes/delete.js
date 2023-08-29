const express = require('express')
const router = express.Router()
const controller = require('./../controllers/delete')

router.delete('/professor/:cpf', controller.professor)
router.delete('/disciplina/:id', controller.disciplina)
router.delete('/sala/:id', controller.sala)
router.delete('/turmas/:id', controller.turma)
router.delete('/curso/:id', controller.curso)

module.exports = router