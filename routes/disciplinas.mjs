import express from 'express';
const router = express.Router();
import * as controller from '../controllers/disciplinas.mjs';

router.post('/cadastrar', controller.cadastrar);
router.put('/editar/:id', controller.editar);
router.get('/consultar/:id', controller.consultar);
router.delete('/deletar/:id', controller.deletar);
router.post('/importar_csv', controller.importarCSV);

export default router;