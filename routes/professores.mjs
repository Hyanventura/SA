import express from 'express'
const router = express.Router()
import * as controller from '../controllers/professores.mjs'

router.post('/cadastrar', controller.cadastrar)
router.put('/editar/:cpf', controller.editar)
router.get('/consultar/:cpf', controller.consultar)

export default router