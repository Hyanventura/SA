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

    await professorFacade.cadastrar(cpf, nome, status);
    await professorFacade.disponibilidade(cpf, seg, ter, qua, qui, sex);
    res.status(201).send({ mensagem: `Professor ${nome} cadastrado com sucesso!` });
}

const editar = async (req, res) => {
    const cpf = req.body.cpf;
    const nome = req.body.nome;
    const status = req.body.status;
    const seg = req.body.seg;
    const ter = req.body.ter;
    const qua = req.body.qua;
    const qui = req.body.qui;
    const sex = req.body.sex;

    await professorFacade.editar(cpf, nome, status);
    await professorFacade.disponibilidade(cpf, seg, ter, qua, qui, sex);
    res.status(201).send({mensagem: `Professor portador do CPF ${cpf} editado com sucesso!`})
}

const consultar = async (req, res) => {
    const cpf = req.params.cpf;

    const resultado = await professorFacade.consultar(cpf)
    res.status(200).send(resultado)
}

export {cadastrar, editar, consultar};