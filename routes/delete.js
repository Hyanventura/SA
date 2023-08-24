const express = require('express')
const router = express.Router()
const controller = require('./../controllers/delete')

router.delete('/professor/:cpf', controller.professor)
router.delete('/disciplina/:id', controller.disciplina)

module.exports = router