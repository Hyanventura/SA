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
        console.log(`- agendarAula(${data}, ${id_curso}, ${id_turma}, ${cpf_professor}, ${id_sala}) -- facades/Agenda.mjs`);

        const professorEstaDisponivel = await this.verificarDisponibilidadeDoProfessor(data, cpf_professor);
        const turmaFazParteDoCurso = await this.verificarSeTurmaFazParteDoCurso(id_curso, id_turma);
        const salaEstaDisponivel = await this.verificarDisponibilidadeDaSalaNoDia(data, id_sala);

        try {
            this.conectarDatabase()

            if (!professorEstaDisponivel) {
                console.error(`-- ERRO -- PROFESSOR NÃO POSSUI DISPONIBILIDADE PARA O DIA SELECIONADO -- facades/Agenda.mjs`)
                return 'professor não possui disponibilidade para o dia selecionado'
            } else if (!turmaFazParteDoCurso) {
                console.error(`-- ERRO -- TURMA NÃO FAZ O CURSO SELECIONADO -- facades/Agenda.mjs`)
                return 'turma não faz o curso selecionado'
            } else if (!salaEstaDisponivel) {
                console.error(`-- ERRO -- SALA JÁ ESTÁ OCUPADA NO DIA SELECIONADO -- facades/Agenda.mjs`)
                return 'sala já está ocupada no dia selecionado'
            } else {
                const comando = `INSERT INTO agenda (data, id_curso, id_turma, cpf_professor, id_sala) VALUES ('${data}', ${id_curso}, ${id_turma}, ${cpf_professor}, ${id_sala})`
                await this.client.query(comando)
    
                console.log(`- função agendarAula() concluída com sucesso.`)
                return `aula agendada para a data ${data} com sucesso`
            }

        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase();
        }

        
    }

    async verificarDisponibilidadeDoProfessor(data, cpf_professor) {
        try {
            console.log(`- verificarDisponibilidadeDoProfessor(${data}, ${cpf_professor}) -- facades/Agenda.mjs`);

            const dataSelecionada = new Date(data)
            const dia_semana = dias_da_semana[dataSelecionada.getDay()]

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

            console.log(`- verificarSeTurmaFazParteDoCurso(${id_curso}, ${id_turma}) -- facades/Agenda.mjs`);

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

    async verificarDisponibilidadeDaSalaNoDia(data, id_sala) {
        try {
            this.conectarDatabase();

            console.log(`- verificarDisponibilidadeDaSalaNoDia(${data}, ${id_sala}) -- facades/Agenda.mjs`);

            const comando = `SELECT data, id_sala FROM agenda WHERE data = '${data}'`;
            const resultado = (await this.client.query(comando)).rows;

            const salasUsadasNoDia = resultado.map(row => row.id_sala)

            const estaOcupadaNoDia = ([salasUsadasNoDia.find((sala) => sala == id_sala)]);

            if (estaOcupadaNoDia[0] == undefined) {
                return true;
            } else {
                return false;
            }

        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase();
        }
    }


    async closeDatabase() {
        await this.client.end()
        console.log('- Desconectado do BD -- facades/Agenda.mjs')
    }
}