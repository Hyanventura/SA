import ProfessorFacade from "../facades/Professor.mjs";
const professorFacade = new ProfessorFacade()

const cadastrar = async (req, res) => {
    const cpf = req.body.cpf;
    const nome = req.body.nome;
    const status = req.body.status;
    const seg = req.body.seg;
    const ter = req.body.ter;
    const qua = req.body.qua;
    const qui = req.body.qui;
    const sex = req.body.sex;
    const qtd = req.body.qtd;
    const disciplinas = req.body.disciplinas;

    const resultado = await professorFacade.cadastrar(cpf, nome, status, disciplinas, seg, ter, qua, qui, sex, qtd);
    res.status(201).send({ resultado: resultado });
}

const editar = async (req, res) => {
    const cpf = req.params.cpf;
    const nome = req.body.nome;
    const status = req.body.status;
    const seg = req.body.seg;
    const ter = req.body.ter;
    const qua = req.body.qua;
    const qui = req.body.qui;
    const sex = req.body.sex;
    const qtd = req.body.qtd;
    const disciplinas = req.body.disciplinas;

    const resultado = await professorFacade.editar(cpf, nome, status, disciplinas, seg, ter, qua, qui, sex, qtd);
    res.status(201).send({ resultado: resultado })
}

const consultar = async (req, res) => {
    const cpf = req.params.cpf;

    const resultado = await professorFacade.consultar(cpf)
    res.status(200).send(resultado)
}

const consultarDisponibilidade = async (req, res) => {
    const cpf = req.params.cpf;

    const resultado = await professorFacade.consultarDisponibilidade(cpf)
    res.status(200).send(resultado)
}

const consultarDisciplinasDoProfessor = async (req, res) => {
    const cpf = req.params.cpf;

    const resultado = await professorFacade.consultarDisciplinasDoProfessor(cpf);
    res.status(200).send(resultado)
}

const importarCSV = async (req, res) => {
    const filePath = req.body.file_path;
    //para usar essa função e garantir que não vai dar erros deve ser escolhido um arquivo .csv, o caminho no body deve ser digitado com '/' no lugar da '\'
    //por exemplo: C:\users\ramon\desktop\arquivo.xlsx INCORRETO
    //             C:/users/ramon/desktop/arquivo.csv CORRETO 

    const data = await professorFacade.importarCSV(filePath);
    res.status(201).send({ InformaçõesImportadas: data })
}

export { cadastrar, editar, consultar, consultarDisponibilidade, consultarDisciplinasDoProfessor, importarCSV };