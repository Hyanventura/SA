import CursoFacade from "../facades/Curso.mjs";
const cursoFacade = new CursoFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;

    await cursoFacade.cadastrar(nome);
    res.status(201).send(`Curso '${nome}' cadastrado com sucesso!`)
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;

    await cursoFacade.editar(id, nome);
    res.status(201).send(`Curso ID=${id} alterado com sucesso!\nNOME=${nome}`)
}

const consultar = async (req, res) => {
    const id = req.params.id;

    const resultado = await cursoFacade.consultar(id);
    res.status(200).send({cursos: resultado})
}

const deletar = async (req, res) => {
    const id = req.params.id;

    await cursoFacade.deletar(id);
    res.status(200).send(`Curso ID=${id} excluído com sucesso.`)
}

export { cadastrar, editar, consultar, deletar };