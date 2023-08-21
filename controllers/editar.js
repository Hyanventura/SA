const database = require("../config/database")


exports.update = (req,res) =>{
    const query = "UPDATE professores SET nome=$1, disciplina=$2, status=$3 WHERE cpf=$4"
    const values = [req.body.nome, req.body.disciplina, req.body.status, req.params.cpf]

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