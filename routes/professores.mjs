import express from 'express';
const router = express.Router();
import * as controller from '../controllers/professores.mjs';

router.post('/cadastrar', controller.cadastrar);
router.put('/editar/:cpf', controller.editar);
router.get('/consultar/:cpf', controller.consultar);
router.get('/consultar_nome', controller.consultarPorNome);
router.get('/consultar_disponibilidade/:cpf', controller.consultarDisponibilidade);
router.get('/consultar_disciplinas/:cpf', controller.consultarDisciplinasDoProfessor);
router.post('/importar_csv', controller.importarCSV);

export default router;