import express from 'express';
const router = express.Router();
import * as controller from '../controllers/cursos.mjs';

router.post('/cadastrar', controller.cadastrar);
router.put('/editar/:id', controller.editar);
router.get('/consultar/:id', controller.consultar);
router.delete('/deletar/:id', controller.deletar);

export default router;