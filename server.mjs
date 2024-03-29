import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(cors())

import professoresRoutes from "./routes/professores.mjs";
import disciplinasRoutes from './routes/disciplinas.mjs';
import salaRoutes from './routes/salas.mjs';
import turmaRoutes from './routes/turmas.mjs';
import cursoRoutes from './routes/cursos.mjs';
import agendaRoutes from './routes/agenda.mjs'

app.use('/professor', professoresRoutes);
app.use('/disciplina', disciplinasRoutes);
app.use('/sala', salaRoutes);
app.use('/turma', turmaRoutes);
app.use('/curso', cursoRoutes);
app.use('/agenda', agendaRoutes);


app.listen(port, () =>{
    console.log('servidor express rodando')
})
