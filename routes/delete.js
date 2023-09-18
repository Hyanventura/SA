import express from 'express'
const router = express.Router()
import controller from './../controllers/delete'

router.delete('/professor/:cpf', controller.professor)
router.delete('/disciplina/:id', controller.disciplina)
router.delete('/sala/:id', controller.sala)
router.delete('/turmas/:id', controller.turma)
router.delete('/curso/:id', controller.curso)

module.exports = router