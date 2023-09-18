import express from 'express'
const router = express.Router()
import * as controller from '../controllers/professores.mjs'

router.post('/cadastrar', controller.cadastrar)

export default router