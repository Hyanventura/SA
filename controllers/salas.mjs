import SalaFacade from "../facades/Sala.mjs";
const salaFacade = new SalaFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;
    const cod = req.body.cod;

    await salaFacade.cadastrar(nome, cod);
    res.status(201).send(`Sala '${nome}' de código ${cod} cadastrada com sucesso!`);
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const cod = req.body.cod;

    await salaFacade.editar(id, nome, cod);
    res.status(201).send(`Sala ID=${id} alterada com sucesso!\nNOME=${nome}\nCOD=${cod}`)
}

const consultar = async (req, res) => {
    const id = req.params.id;

    const resultado = await salaFacade.consultar(id);
    res.status(200).send({salas: resultado})
}

const deletar = async (req, res) => {
    const id = req.params.id;

    await salaFacade.deletar(id);
    res.status(200).send(`Sala ID=${id} excluída com sucesso.`);
}

export { cadastrar, editar, consultar, deletar };