import CursoFacade from "../facades/Curso.mjs";
const cursoFacade = new CursoFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;
    const cod = req.body.cod;
    const disciplinas = req.body.disciplinas;
    const qtd_aulas_semana = req.body.qtd_aulas_semana;

    await cursoFacade.cadastrar(nome, cod);
    await cursoFacade.cadastrarDisciplinas(cod, disciplinas, qtd_aulas_semana);
    res.status(201).send(`Curso '${nome}' cadastrado com código '${cod}' com sucesso!`)
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const cod = req.body.cod;
    const disciplinas = req.body.disciplinas;
    const qtd_aulas_semana = req.body.qtd_aulas_semana;

    await cursoFacade.editar(id, nome, cod);
    await cursoFacade.cadastrarDisciplinas(cod, disciplinas, qtd_aulas_semana);
    res.status(201).send(`Curso ID=${id} alterado com sucesso!\nNOME=${nome}\nCOD=${cod}`)
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

const importarCSV = async (req, res) => {
    const filePath = req.body.file_path;

    const data = await cursoFacade.importarCSV(filePath);
    res.status(200).send({InformaçõesImportadas: data})
}

export { cadastrar, editar, consultar, deletar, importarCSV };