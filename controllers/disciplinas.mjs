import DisciplinaFacade from "../facades/Disciplina.mjs";
const disciplinaFacade = new DisciplinaFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;

    await disciplinaFacade.cadastrar(nome);
    res.status(201).send({ mensagem: `Disciplina '${nome}' cadastrada com sucesso!` });
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;

    await disciplinaFacade.editar(id, nome);
    res.status(201).send({ mensagem: `Disciplina ID=${id} teve seu nome alterado para: ${nome}` });
}

const consultar = async(req, res) => {
    const resultado = await disciplinaFacade.consultar()
    res.status(200).send({disciplinas: resultado})
}

const deletar = async(req, res) => {
    const id = req.params.id;

    await disciplinaFacade.deletar(id);
    res.status(201).send({mensagem: `Disciplina ID=${id} excluída com sucesso.`})
}

export { cadastrar, editar, consultar, deletar };