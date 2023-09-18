import express from 'express';
const app = express();
const port = 3000;
import bodyParser from 'body-parser';
app.use(bodyParser.json());

import professoresRoutes from "./routes/professores.mjs";
// const editarRoutes = require ("./routes/editar")
// const consultarRoutes = require("./routes/consultar")
// const deleteRoutes = require("./routes/delete")
// const importRoutes = require("./routes/import-excel")

app.use('/professor', professoresRoutes)
// app.use('/editar', editarRoutes)
// app.use('/consultar', consultarRoutes)
// app.use('/deletar', deleteRoutes)
// app.use('/import', importRoutes)


app.listen(port, () =>{
    console.log('servidor express rodando')
})
