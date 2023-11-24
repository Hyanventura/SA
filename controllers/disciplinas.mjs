import DisciplinaFacade from "../facades/Disciplina.mjs";
const disciplinaFacade = new DisciplinaFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;

    const resultado = await disciplinaFacade.cadastrar(nome);
    res.status(201).send({ resultado: resultado });
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;

    const resultado = await disciplinaFacade.editar(id, nome);
    res.status(201).send({ resultado: resultado });
}

const consultar = async (req, res) => {
    const resultado = await disciplinaFacade.consultar()
    res.status(200).send({ disciplinas: resultado })
}

const deletar = async (req, res) => {
    const id = req.params.id;

    const resultado = await disciplinaFacade.deletar(id);
    res.status(201).send({ resultado: resultado })
}

const importarCSV = async (req, res) => {
    const filePath = req.body.file_path;

    const data = await disciplinaFacade.importarCSV(filePath);
    res.status(200).send({ InformaçõesImportadas: data })
}

export { cadastrar, editar, consultar, deletar, importarCSV };