const database = require("../config/database");


exports.post = (req, res) => {
    const query = "INSERT INTO professores(cpf, nome,  status) VALUES ($1, $2, $3);";
    const values = [req.body.cpf, req.body.nome, req.body.status];
    database.query(query, values).then(
        () => {
            console.log('ta dando insert')
            return res.status(201).send({ mensagem: "Professor cadastrado com Sucesso!" });
        },
        (erro) => {
            console.log('deu erro no insert')
            return res.status(500).send({ erro: erro });
        }
    )
},

exports.cadastrarDisciplina = (req, res) => {
    const query = "INSERT INTO disciplinas(id,nome) VALUES ($1, $2);";
    const values = [req.body.id,req.body.nome];
    database.query(query, values).then(
        () => {
            return res.status(201).send({ mensagem: "Disciplina cadastrada com Sucesso!" });
        },
        (erro) => {
            return res.status(500).send({ erro: erro });
        }
    )
}   