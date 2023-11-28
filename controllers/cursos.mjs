import CursoFacade from "../facades/Curso.mjs";
const cursoFacade = new CursoFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;
    const cod = req.body.cod;
    const disciplinas = req.body.disciplinas;
    const qtd_aulas_semana = req.body.qtd_aulas_semana;

    const resultado = await cursoFacade.cadastrar(nome, cod, disciplinas, qtd_aulas_semana);
    res.status(201).send({resultado: resultado})
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const cod = req.body.cod;
    const disciplinas = req.body.disciplinas;
    const qtd_aulas_semana = req.body.qtd_aulas_semana;

    const resultado = await cursoFacade.editar(id, nome, cod, disciplinas, qtd_aulas_semana);
    res.status(201).send({resultado: resultado})
}

const consultar = async (req, res) => {
    const id = req.params.id;

    const resultado = await cursoFacade.consultar(id);
    res.status(200).send({resultado: resultado})
}

const consultarPorNome = async (req, res) => {
    const nome = req.body.nome;

    const resultado = await cursoFacade.consultarPorNome(nome);
    res.status(200).send({resultado: resultado});
}

const deletar = async (req, res) => {
    const id = req.params.id;

    const resultado = await cursoFacade.deletar(id);
    res.status(200).send({resultado: resultado})
}

const importarCSV = async (req, res) => {
    const filePath = req.body.file_path;

    const data = await cursoFacade.importarCSV(filePath);
    res.status(200).send({InformaçõesImportadas: data})
}

export { cadastrar, editar, consultar, deletar, importarCSV, consultarPorNome };