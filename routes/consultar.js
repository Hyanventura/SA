const express = require('express')
const router = express.Router()
const controller = require('./../controllers/consultar')

router.get('/professor', controller.professor)
router.get('/disciplina', controller.disciplina)

module.exports = router