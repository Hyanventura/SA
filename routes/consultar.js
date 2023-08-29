const express = require('express')
const router = express.Router()
const controller = require('./../controllers/consultar')

router.get('/professor', controller.professor)
router.get('/disciplina', controller.disciplina)
router.get('/sala', controller.sala)
router.get('/turma', controller.turma)


module.exports = router