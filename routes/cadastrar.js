const express = require('express')
const router = express.Router()
const controller = require('./../controllers/cadastrar')

router.post('/', controller.post)

module.exports = router