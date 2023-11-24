import AgendaFacade from "../facades/Agenda.mjs";
const agendaFacade = new AgendaFacade()

const consultar = async (req, res) => {
    const dataInicial = req.body.dataInicial;
    const dataFinal = req.body.dataFinal;

    const resultado = await agendaFacade.consultar(dataInicial, dataFinal);
    res.status(200).send({resultado: resultado});
}

const agendarAula = async (req, res) => {
    const data = req.body.data;
    const id_curso = req.body.id_curso;
    const id_turma = req.body.id_turma;
    const cpf_professor = req.body.cpf_professor;
    const id_sala = req.body.id_sala;
    const id_disciplina = req.body.id_disciplina;

    const resultado = await agendaFacade.agendarAula(data, id_curso, id_turma, cpf_professor, id_sala, id_disciplina);
    res.status(201).send({ resultado: resultado });
}

export { agendarAula, consultar };