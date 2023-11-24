import SalaFacade from "../facades/Sala.mjs";
const salaFacade = new SalaFacade();

const cadastrar = async (req, res) => {
    const nome = req.body.nome;
    const cod = req.body.cod;

    const resultado = await salaFacade.cadastrar(nome, cod);
    res.status(201).send({resultado: resultado});
}

const editar = async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const cod = req.body.cod;

    const resultado = await salaFacade.editar(id, nome, cod);
    res.status(201).send({resultado: resultado});
}

const consultar = async (req, res) => {
    const id = req.params.id;

    const resultado = await salaFacade.consultar(id);
    res.status(200).send({salas: resultado})
}

const deletar = async (req, res) => {
    const id = req.params.id;

    const resultado = await salaFacade.deletar(id);
    res.status(200).send({resultado: resultado});
}

const importarCSV = async (req, res) => {
    const filePath = req.body.file_path;

    const data = await salaFacade.importarCSV(filePath);
    res.status(200).send({InformaçõesImportadas: data})
}

export { cadastrar, editar, consultar, deletar, importarCSV };