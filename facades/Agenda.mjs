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
        const professorEstaDisponivel = await this.verificarDisponibilidadeDoProfessor(data, cpf_professor)

        if(professorEstaDisponivel) {
            return 'sua aula foi agendada com sucesso'
        } else {
            return 'professor não possui disponibilidade para o dia selecionado'
        }
    }

    async verificarDisponibilidadeDoProfessor(data, cpf_professor) {
        data = new Date(data)
        const dia_semana = dias_da_semana[data.getDay()]

        const disponivel = await professorFacade.consultarDisponibilidade(cpf_professor)

        const estaDisponivelNoDia = ([disponivel.find((dia) => dia == dia_semana)]) 

        if (estaDisponivelNoDia[0] == undefined) {
            return false;
        } else {
            return true;
        }
    }

}