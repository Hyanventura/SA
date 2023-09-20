// const database = require("../config/database")



// exports.turma = (req, res) => {
//     const query = "SELECT * FROM turmas"
//     database.query(query).then(
//         (resultado) => {
//             res.status(200).send({ turmas : resultado.rows })
          
//         },
//         (erro) => {
//             res.status(500).send({ erro: erro })
        
//         }

//     )
// }

// exports.curso = (req, res) => {
//     const query = "SELECT * FROM cursos"
//     database.query(query).then(
//         (resultado) => {
//             res.status(200).send({ cursos : resultado.rows })
          
//         },
//         (erro) => {
//             res.status(500).send({ erro: erro })
        
//         }

//     )
// }

// exports.disciplinaProfessor = (req, res) => {
//     const query = "select disciplina_professores.cpf_professor, professores.nome as PROFESSOR, disciplinas.nome as DISCIPLINA from disciplina_professores left join professores on professores.cpf = disciplina_professores.cpf_professor left join disciplinas on disciplinas.id = disciplina_professores.id_disciplina"
//     database.query(query).then(
//         (resultado) => {
//             res.status(200).send({ DisciplinaEProfessor : resultado.rows })
          
//         },
//         (erro) => {
//             res.status(500).send({ erro: erro })
        
//         }

//     )
// }
