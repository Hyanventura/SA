const pg = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const database = new pg.Client(process.env.DATABASE)

database.connect((erro) => {
    if (erro) {
        return console.log("Não foi possivel conectar com o  elephantSQL", erro)
    } else {
        return console.log("conectado ao elephantSQL!")
    }

})

module.exports = database