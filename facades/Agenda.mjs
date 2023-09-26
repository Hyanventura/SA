import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
import ProfessorFacade from "./Professor.mjs";
const professorFacade = new ProfessorFacade()
dotenv.config();

const dias_da_semana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo']

export default class AgendaFacade {

    constructor() {
        // this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
        console.log('- Conectado ao BD -- facades/Agenda.mjs')
    }

    async agendarAula(data, id_curso, id_turma, cpf_professor, id_sala) {
        const professorEstaDisponivel = await this.verificarDisponibilidadeDoProfessor(data, cpf_professor);
        const turmaFazParteDoCurso = await this.verificarSeTurmaFazParteDoCurso(id_curso, id_turma);

        if (!professorEstaDisponivel) {
            return 'professor não possui disponibilidade para o dia selecionado'
        } else if (!turmaFazParteDoCurso) {
            return 'turma não faz o curso selecionado'
        } else {
            return 'aula agendada com sucesso'
        }
    }

    async verificarDisponibilidadeDoProfessor(data, cpf_professor) {
        try {
            data = new Date(data)
            const dia_semana = dias_da_semana[data.getDay()]

            const disponivel = await professorFacade.consultarDisponibilidade(cpf_professor)

            const estaDisponivelNoDia = ([disponivel.find((dia) => dia == dia_semana)])

            if (estaDisponivelNoDia[0] == undefined) {
                return false;
            } else {
                return true;
            }
        } catch (erro) {
            console.error(erro);
            return erro;
        }

    }

    async verificarSeTurmaFazParteDoCurso(id_curso, id_turma) {
        try {
            this.conectarDatabase();

            const comando = `SELECT id_curso FROM turmas WHERE turmas.id = ${id_turma}`;
            const resultado = (await this.client.query(comando)).rows;

            const cursos = resultado.map(row => row.id_curso)

            const cursosDaTurma = ([cursos.find((curso) => curso == id_curso)]);

            if (cursosDaTurma[0] == undefined) {
                return false;
            } else {
                return true;
            }
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }


    async closeDatabase() {
        await this.client.end()
        console.log('- Desconectado do BD -- facades/Agenda.mjs')
    }
}