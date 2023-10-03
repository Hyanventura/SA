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

    async agendarAula(data, id_curso, id_turma, cpf_professor, id_sala, id_disciplina) {
        console.log(`- agendarAula(${data}, ${id_curso}, ${id_turma}, ${cpf_professor}, ${id_sala}, ${id_disciplina}) -- facades/Agenda.mjs`);

        const professorEstaDisponivel = await this.verificarDisponibilidadeDoProfessor(data, cpf_professor);
        const turmaFazParteDoCurso = await this.verificarSeTurmaFazParteDoCurso(id_curso, id_turma);
        const salaEstaDisponivel = await this.verificarDisponibilidadeDaSalaNoDia(data, id_sala);
        const professorLecionaADisciplina = await this.verificarSeProfessorDaAulaParaADisciplina(cpf_professor, id_disciplina);

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
            } else if (!professorLecionaADisciplina) {
                console.error(`-- ERRO -- PROFESSOR NÃO LECIONA ESSA DISCIPLINA`);
                return 'professor não dá aula para a disciplina selecionada'
            } else {
                const comando = `INSERT INTO agenda (data, id_curso, id_turma, cpf_professor, id_sala, id_disciplina) VALUES ('${data}', ${id_curso}, ${id_turma}, ${cpf_professor}, ${id_sala}, ${id_disciplina})`
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

            const dataSelecionada = new Date(data);
            const dia_semana = dias_da_semana[dataSelecionada.getDay()];
            //função getDay() só funciona quando é usada em um Date(), por isso acima coloquei esse Date(data) na dataSelecionada
            //é utilizada para buscar no array dias_da_semana[] e verificar o dia da semana da data selecionada

            const disponibilidade = await professorFacade.consultarDisponibilidade(cpf_professor);

            const verificarTipoDeDisponibilidade = async () => {
                if (Number.isInteger(parseInt(disponibilidade[0]))) {
                    disponibilidade = parseInt(disponibilidade[0])

                    console.log(`- tipo de disponibilidade do professor: quantidade -- facades/Agenda.mjs`)
                    return 'quantidade'
                } else {

                    console.log(`- tipo de disponibilidade do professor: específica -- facades/Agenda.mjs`)
                    return 'especifica'
                }
            }

            const tipoDeDisponibilidade = await verificarTipoDeDisponibilidade();

            if (tipoDeDisponibilidade == 'especifica') {
                const estaDisponivelNoDia = ([disponibilidade.find((dia) => dia == dia_semana)]);

                if (estaDisponivelNoDia[0] == undefined) {
                    return false
                } else {
                    return true
                }

            } else if (tipoDeDisponibilidade == 'quantidade') {
                
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

            const salasUsadasNoDia = resultado.map(row => row.id_sala);

            const estaDisponivelNoDia = ([salasUsadasNoDia.find((sala) => sala == id_sala)]);

            if (estaDisponivelNoDia[0] == undefined) {
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

    async verificarSeProfessorDaAulaParaADisciplina(cpf_professor, id_disciplina) {
        try {
            this.conectarDatabase();

            console.log(`- verificarSeProfessorDaAulaParaADisciplina(${cpf_professor}, ${id_disciplina}) -- facades/Agenda.mjs`);

            const consultarDisciplinasDoProfessor = async () => {
                const comando = `SELECT id_disciplina FROM disciplina_professores WHERE cpf_professor = ${cpf_professor}`;
                const resultado = (await this.client.query(comando)).rows;
                const disciplinas = resultado.map(row => row.id_disciplina);

                return disciplinas;
            }

            const disciplinasDoProfessor = await consultarDisciplinasDoProfessor();

            const professorLecionaADisciplina = ([disciplinasDoProfessor.find((disciplina) => disciplina == id_disciplina)]);

            if (professorLecionaADisciplina[0] == undefined) {
                return false;
            } else {
                return true;
            }

        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase();
        }
    }


    async closeDatabase() {
        await this.client.end();
        console.log('- Desconectado do BD -- facades/Agenda.mjs');
    }
}