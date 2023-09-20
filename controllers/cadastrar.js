// const database = require("../config/database");


// exports.turma = (req, res) => {
//     const query = "INSERT INTO turmas(nome, id_curso) VALUES ($1, $2);";
//     const values = [req.body.nome, req.body.id_curso];
//     database.query(query, values).then(
//         () => {
//             return res.status(201).send({ mensagem: "Turma cadastrada com Sucesso!" });
//         },
//         (erro) => {
//             return res.status(500).send({ erro: erro });
//         }
//     )
// }

// exports.curso = (req, res) => {
//     const query = "INSERT INTO cursos(nome) VALUES ($1);";
//     const values = [req.body.nome];
//     database.query(query, values).then(
//         () => {
//             return res.status(201).send({ mensagem: "Curso cadastrado com Sucesso!" });
//         },
//         (erro) => {
//             return res.status(500).send({ erro: erro });
//         }
//     )
// }   