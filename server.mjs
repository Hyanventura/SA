import express from 'express';
const app = express();
const port = 3000;
import bodyParser from 'body-parser';
app.use(bodyParser.json());

import professoresRoutes from "./routes/professores.mjs";
import disciplinaRoutes from './routes/disciplinas.mjs';

app.use('/professor', professoresRoutes)
app.use('/disciplina', disciplinaRoutes)


app.listen(port, () =>{
    console.log('servidor express rodando')
})
