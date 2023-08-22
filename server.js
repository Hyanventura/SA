const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cadastrarRoutes = require("./routes/cadastrar")
const editarRoutes = require ("./routes/editar")
const consultarRoutes = require("./routes/consultar")
const deleteRoutes = require("./routes/delete")

app.use('/', cadastrarRoutes)
app.use('/editar', editarRoutes)
app.use('/consultar', consultarRoutes)
app.use('/deletar', deleteRoutes)


app.listen(port, () =>{
    console.log('servidor express rodando')
})
