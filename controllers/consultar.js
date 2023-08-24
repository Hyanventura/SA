const database = require("../config/database")


exports.professor = (req, res) => {
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

exports.disciplina = (req, res) => {
    const query = "SELECT * FROM disciplinas"
    database.query(query).then(
        (resultado) => {
            res.status(200).send({ disciplinas: resultado.rows })
          
        },
        (erro) => {
            res.status(500).send({ erro: erro })
        
        }

    )
}