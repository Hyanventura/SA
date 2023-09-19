
// const database = require("../config/database")




// exports.sala = (req,res) =>{
//     const query = "DELETE FROM salas WHERE id=$1;"
//     const values = [req.params.id]
    
// database.query(query, values).then(
//     () => {
//         res.status(200).json({mensagem : "Sala removida com sucesso"})
//     },
//     (erro) =>{
//         res.status(500).send({erro:erro})
//     }
// )
// }


// exports.turma = (req,res) =>{
//     const query = "DELETE FROM turmas WHERE id=$1;"
//     const values = [req.params.id]
    
// database.query(query, values).then(
//     () => {
//         res.status(200).json({mensagem : "turma removida com sucesso"})
//     },
//     (erro) =>{
//         res.status(500).send({erro:erro})
//     }
// )
// }

// exports.curso = (req,res) =>{
//     const query = "DELETE FROM cursos WHERE id=$1;"
//     const values = [req.params.id]
    
// database.query(query, values).then(
//     () => {
//         res.status(200).json({mensagem : "Curso removido com sucesso"})
//     },
//     (erro) =>{
//         res.status(500).send({erro:erro})
//     }
// )
// }




