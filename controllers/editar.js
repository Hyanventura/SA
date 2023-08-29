const database = require("../config/database")


exports.professor = (req,res) =>{
    const query = "UPDATE professores SET nome=$1, status=$2 WHERE cpf=$3"
    const values = [req.body.nome, req.body.status, req.params.cpf]

    database.query(query,values).then(
        ()=>{
            res.status(200).send({mensagem: "Professor atualizado com sucesso!"}
            )
            
        },
        (erro) => {
            res.status(500).send({erro:erro})
        }
    )
}

exports.disciplina = (req,res) =>{
    const query = "UPDATE disciplinas SET nome=$1 WHERE id=$2"
    const values = [req.body.nome, req.params.id]

    database.query(query,values).then(
        ()=>{
            res.status(200).send({mensagem: "Disciplina atualizada com sucesso!"}
            )
            
        },
        (erro) => {
            res.status(500).send({erro:erro})
        }
    )
}

exports.sala = (req,res) =>{
    const query = "UPDATE salas SET nome=$1 WHERE id=$2"
    const values = [req.body.nome, req.params.id]

    database.query(query,values).then(
        ()=>{
            res.status(200).send({mensagem: "Sala atualizada com sucesso!"}
            )
            
        },
        (erro) => {
            res.status(500).send({erro:erro})
        }
    )
}

exports.turma = (req,res) =>{
    const query = "UPDATE turmas SET nome=$1, id_curso=$2 WHERE id=$3"
    const values = [req.body.nome,req.body.id_curso, req.params.id]

    database.query(query,values).then(
        ()=>{
            res.status(200).send({mensagem: "turma atualizada com sucesso!"}
            )
            
        },
        (erro) => {
            res.status(500).send({erro:erro})
        }
    )
}

exports.curso = (req,res) =>{
    const query = "UPDATE cursos SET nome=$1 WHERE id=$2"
    const values = [req.body.nome, req.params.id]

    database.query(query,values).then(
        ()=>{
            res.status(200).send({mensagem: "Curso atualizado com sucesso!"}
            )
            
        },
        (erro) => {
            res.status(500).send({erro:erro})
        }
    )
}