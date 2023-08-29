const database = require("../config/database");


exports.professor = (req, res) => {
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

exports.disciplina = (req, res) => {
    const query = "INSERT INTO disciplinas(nome) VALUES ($1);";
    const values = [req.body.nome];
    database.query(query, values).then(
        () => {
            return res.status(201).send({ mensagem: "Disciplina cadastrada com Sucesso!" });
        },
        (erro) => {
            return res.status(500).send({ erro: erro });
        }
    )
}   

exports.sala = (req, res) => {
    const query = "INSERT INTO salas(nome) VALUES ($1);";
    const values = [req.body.nome];
    database.query(query, values).then(
        () => {
            return res.status(201).send({ mensagem: "Sala cadastrada com Sucesso!" });
        },
        (erro) => {
            return res.status(500).send({ erro: erro });
        }
    )
}   

exports.turma = (req, res) => {
    const query = "INSERT INTO turmas(nome) VALUES ($1);";
    const values = [req.body.nome];
    database.query(query, values).then(
        () => {
            return res.status(201).send({ mensagem: "Turma cadastrada com Sucesso!" });
        },
        (erro) => {
            return res.status(500).send({ erro: erro });
        }
    )
}   