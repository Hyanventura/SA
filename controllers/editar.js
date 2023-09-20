

// exports.turma = (req,res) =>{
//     const query = "UPDATE turmas SET nome=$1, id_curso=$2 WHERE id=$3"
//     const values = [req.body.nome,req.body.id_curso, req.params.id]

//     database.query(query,values).then(
//         ()=>{
//             res.status(200).send({mensagem: "turma atualizada com sucesso!"}
//             )
            
//         },
//         (erro) => {
//             res.status(500).send({erro:erro})
//         }
//     )
// }

// exports.curso = (req,res) =>{
//     const query = "UPDATE cursos SET nome=$1 WHERE id=$2"
//     const values = [req.body.nome, req.params.id]

//     database.query(query,values).then(
//         ()=>{
//             res.status(200).send({mensagem: "Curso atualizado com sucesso!"}
//             )
            
//         },
//         (erro) => {
//             res.status(500).send({erro:erro})
//         }
//     )
// }