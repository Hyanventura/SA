const express = require('express')
const router = express.Router()
const controller = require('./../controllers/consultar')

router.get('/professor', controller.professor)
router.get('/disciplina', controller.disciplina)
router.get('/sala', controller.sala)
router.get('/turma', controller.turma)
router.get('/curso', controller.curso)
router.get('/disciplinaProfessor', controller.disciplinaProfessor)
router.get('/disponibidadeEspecifica/:cpf_professor', controller.disponibilidadeEspecifica)


module.exports = router