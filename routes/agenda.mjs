import express from 'express';
const router = express.Router();
import * as controller from '../controllers/agenda.mjs'

router.get('/consultar', controller.consultar);
router.post('/agendar_aula', controller.agendarAula);

export default router;