const database = require("../config/database");


exports.professor = (req, res) => {
    const query = "INSERT INTO professores(cpf, nome,  status) VALUES ($1, $2, $3);";
    const values = [req.body.cpf, req.body.nome, req.body.status,];
    database.query(query, values).then(
        () => {
            disponibilidadeProfessor(req, res)
            disciplinaProfessor(req, res)
            return res.status(201).send({ mensagem: "Professor cadastrado com Sucesso!" });
        },
        (erro) => {
            return res.status(500).send({ erro: erro });
        }
    )


}

const disponibilidadeProfessor = (req, res) => {
    let diasSemana = [req.body.seg, req.body.ter, req.body.qua, req.body.qui, req.body.sex]
    let id_dia_semana = 1;

    for (let i = 0; i < diasSemana.length; i++) {
        id_dia_semana++;
        console.log(id_dia_semana)

        if (diasSemana[i] == 1) {
            let query = "INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES ($1, $2)"
            let values = [req.body.cpf, id_dia_semana]
            database.query(query, values)
        }
    }

}

const disciplinaProfessor = (req, res) => {
    const query = "INSERT INTO disciplina_professores (cpf_professor, id_disciplina) VALUES ($1,$2)"
    const values = [req.body.cpf, req.body.disciplina]
    database.query(query, values)
}

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
    const query = "INSERT INTO turmas(nome, id_curso) VALUES ($1, $2);";
    const values = [req.body.nome, req.body.id_curso];
    database.query(query, values).then(
        () => {
            return res.status(201).send({ mensagem: "Turma cadastrada com Sucesso!" });
        },
        (erro) => {
            return res.status(500).send({ erro: erro });
        }
    )
}

exports.curso = (req, res) => {
    const query = "INSERT INTO cursos(nome) VALUES ($1);";
    const values = [req.body.nome];
    database.query(query, values).then(
        () => {
            return res.status(201).send({ mensagem: "Curso cadastrado com Sucesso!" });
        },
        (erro) => {
            return res.status(500).send({ erro: erro });
        }
    )
}   