const express = require('express')
const router = express.Router()
const controller = require('./../controllers/cadastrar')


router.post('/cadastrar', controller.post)
router.post('/cadastrar-disciplina', controller.cadastrarDisciplina)

module.exports = router