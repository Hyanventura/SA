const database = require("../config/database")


exports.get = (req, res) => {
    const query = "SELECT * FROM professores"
    database.query(query).then(
        (resultado) => {
            res.status(200).send({ professores: resultado.rows })
          
        },
        (erro) => {
            res.status(500).send({ erro: erro })
        
        }

    )
}