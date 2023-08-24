
const database = require("../config/database")

exports.professor = (req,res) =>{
    const query = "DELETE FROM professores WHERE cpf=$1;"
    const values = [req.params.cpf]
    
database.query(query, values).then(
    () => {
        res.status(200).json({mensagem : "Professor removida com sucesso"})
    },
    (erro) =>{
        res.status(500).send({erro:erro})
    }
)
}

exports.disciplina = (req,res) =>{
    const query = "DELETE FROM disciplinas WHERE id=$1;"
    const values = [req.params.id]
    
database.query(query, values).then(
    () => {
        res.status(200).json({mensagem : "Disciplina removida com sucesso"})
    },
    (erro) =>{
        res.status(500).send({erro:erro})
    }
)
}


