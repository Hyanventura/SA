const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cadastrarRoutes = require("./routes/cadastrar")
const editarRoutes = require ("./routes/editar")
const consultarRoutes = require("./routes/consultar")
const deleteRoutes = require("./routes/delete")
const importRoutes = require("./routes/import-excel")

app.use('/cadastrar', cadastrarRoutes)
app.use('/editar', editarRoutes)
app.use('/consultar', consultarRoutes)
app.use('/deletar', deleteRoutes)
app.use('/import', importRoutes)


app.listen(port, () =>{
    console.log('servidor express rodando')
})
