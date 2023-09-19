import express from 'express'
const router = express.Router()
import * as controller from '../controllers/disciplinas.mjs'

router.post('/cadastrar', controller.cadastrar);
router.put('/editar/:id', controller.editar);
router.get('/', controller.consultar);
router.delete('/deletar/:id', controller.deletar);

export default router