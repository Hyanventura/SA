import express from 'express'
const router = express.Router()
import controller from './../controllers/cadastrar'


router.post('/professor', controller.professor)
router.post('/disciplina', controller.disciplina)
router.post('/sala', controller.sala)
router.post('/turma', controller.turma)
router.post('/curso', controller.curso)

module.exports = router