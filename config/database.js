const pg = require("pg")

const database = new pg.Client("postgres://goifywky:yNxHas72t1YA-WqvO3HWkYfAWoFZysyO@silly.db.elephantsql.com/goifywky")


database.connect((erro) => {
    if (erro) {
        return console.log("Não foi possivel conectar com o  elephantSQL", erro)
    } else {
        return console.log("conectado ao elephantSQL!")
    }

})

module.exports = database