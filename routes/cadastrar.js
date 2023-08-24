const express = require('express')
const router = express.Router()
const controller = require('./../controllers/cadastrar')


router.post('/professor', controller.professor)
router.post('/disciplina', controller.disciplina)
router.post('/sala', controller.sala)

module.exports = router