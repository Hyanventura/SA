const database = require("../config/database")


exports.update = (req,res) =>{
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