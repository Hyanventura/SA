import express from 'express';
const router = express.Router();
import * as controller from '../controllers/agenda.mjs'

router.post('/agendar_aula', controller.agendarAula);

export default router;