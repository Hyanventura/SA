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


exports.sala = (req, res) => {
    const query = "SELECT * FROM salas"
    database.query(query).then(
        (resultado) => {
            res.status(200).send({ Salas : resultado.rows })
          
        },
        (erro) => {
            res.status(500).send({ erro: erro })
        
        }

    )
}



exports.turma = (req, res) => {
    const query = "SELECT * FROM turmas"
    database.query(query).then(
        (resultado) => {
            res.status(200).send({ turmas : resultado.rows })
          
        },
        (erro) => {
            res.status(500).send({ erro: erro })
        
        }

    )
}

exports.curso = (req, res) => {
    const query = "SELECT * FROM cursos"
    database.query(query).then(
        (resultado) => {
            res.status(200).send({ cursos : resultado.rows })
          
        },
        (erro) => {
            res.status(500).send({ erro: erro })
        
        }

    )
}