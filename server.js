const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cadastrarRoutes = require("./routes/cadastrar")

app.use('/cadastrar', cadastrarRoutes)


app.listen(port, () =>{
    console.log('servidor express rodando')
})
