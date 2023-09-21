import TurmaFacade from "../facades/Turma.mjs";
const turmaFacade = new TurmaFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;
    const id_curso = req.body.id_curso;

    await turmaFacade.cadastrar(nome, id_curso);
    res.status(201).send(`Turma '${nome}' cadastrada com sucesso!`);
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const id_curso = req.body.id_curso;

    await turmaFacade.editar(id, nome, id_curso);
    res.status(201).send(`Turma ID=${id} alterada com sucesso!\nNOME=${nome}\nID_CURSO=${id_curso}`)
}

const consultar = async (req, res) => {
    const id = req.params.id;

    const resultado = await turmaFacade.consultar(id);
    res.status(200).send({ turmas: resultado })
}

const deletar = async (req, res) => {
    const id = req.params.id;

    await turmaFacade.deletar(id);
    res.status(200).send(`Turma ID=${id} excluída com sucesso.`)
}

const importarCSV = async (req, res) => {
    const filePath = req.body.file_path;

    const data = await turmaFacade.importarCSV(filePath);
    res.status(200).send({InformaçõesImportadas: data})
}

export { cadastrar, editar, consultar, deletar, importarCSV };