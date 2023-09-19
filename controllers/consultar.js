// const database = require("../config/database")


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

// exports.disciplina = (req, res) => {
//     const query = "SELECT * FROM disciplinas"
//     database.query(query).then(
//         (resultado) => {
//             res.status(200).send({ disciplinas: resultado.rows })
          
//         },
//         (erro) => {
//             res.status(500).send({ erro: erro })
        
//         }

//     )
// }


// exports.sala = (req, res) => {
//     const query = "SELECT * FROM salas"
//     database.query(query).then(
//         (resultado) => {
//             res.status(200).send({ Salas : resultado.rows })
          
//         },
//         (erro) => {
//             res.status(500).send({ erro: erro })
        
//         }

//     )
// }



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

// exports.disponibilidadeEspecifica = (req, res) => {
//     const query = "select professores.nome as PROFESSOR, dias_semana.nome as DISPONIVEL from disponibilidade left join professores on professores.cpf = disponibilidade.cpf_professor left join dias_semana on dias_semana.id = disponibilidade.id_dia_semana where disponibilidade.cpf_professor = $1"
//     const values = [req.params.cpf_professor]
//     database.query(query, values).then(
//         (resultado) => {
//             res.status(200).send({ DisponibilidadeDoProfessor : resultado.rows })
          
//         },
//         (erro) => {
//             res.status(500).send({ erro: erro })
        
//         }

//     )
// }

// exports.disponibilidade = (req, res) => {
//     const query = "select professores.nome as PROFESSOR, dias_semana.nome as DISPONIVEL from disponibilidade left join professores on professores.cpf = disponibilidade.cpf_professor left join dias_semana on dias_semana.id = disponibilidade.id_dia_semana"
 
//     database.query(query).then(
//         (resultado) => {
//             res.status(200).send({ Disponibilidade : resultado.rows })
          
//         },
//         (erro) => {
        
//             res.status(500).send({ erro: erro })
        
//         }

//     )
// }

