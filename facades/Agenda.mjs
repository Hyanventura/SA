import Pool from "pg-pool";
import xlsx from "xlsx";
import dotenv from "dotenv";
import ProfessorFacade from "./Professor.mjs";
const professorFacade = new ProfessorFacade()
dotenv.config();

const dias_da_semana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo']

export default class AgendaFacade {

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE,
        });
    }

    async consultar(dataInicial, dataFinal) {
        console.log(`- consultar(${dataInicial}, ${dataFinal}) -- facades/Agenda.mjs`)

        try {
            const client = await this.pool.connect();
            try {

                const comando = `select agenda.data, cursos.id as ID_CURSO ,cursos.nome as NOME_CURSO, turmas.id as ID_TURMA ,turmas.nome as NOME_TURMA, professores.cpf as CPF_PROFESSOR ,professores.nome as NOME_PROFESSOR, salas.id as ID_SALA ,salas.cod as COD_SALA, salas.nome as NOME_SALA from agenda left join cursos on cursos.id = agenda.id_curso left join turmas on turmas.id = agenda.id_turma left join professores on professores.cpf = agenda.cpf_professor left join salas on salas.id = agenda.id_sala where agenda.data between '${dataInicial}' and '${dataFinal}'`;
                const resultado = (await client.query(comando)).rows

                return resultado;

            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async agendarAula(data, id_curso, id_turma, cpf_professor, id_sala, id_disciplina) {
        console.log(`- agendarAula(${data}, ${id_curso}, ${id_turma}, ${cpf_professor}, ${id_sala}, ${id_disciplina}) -- facades/Agenda.mjs`);

        try {
            const professorEstaDisponivel = await this.verificarDisponibilidadeDoProfessor(data, cpf_professor);
            const turmaFazParteDoCurso = await this.verificarSeTurmaFazParteDoCurso(id_curso, id_turma);
            const salaEstaDisponivel = await this.verificarDisponibilidadeDaSalaNoDia(data, id_sala);
            const professorLecionaADisciplina = await this.verificarSeProfessorDaAulaParaADisciplina(cpf_professor, id_disciplina);
            const professorJaTemAulaNoDia = await this.verificarSeProfessorJaTemAulaNoDia(cpf_professor, data);

            const client = await this.pool.connect();

            try {
                if (!professorEstaDisponivel) {
                    console.error(`-- ERRO -- PROFESSOR NÃO POSSUI DISPONIBILIDADE PARA O DIA SELECIONADO OU EXCEDEU LIMITE DE AULAS DISPONÍVEIS POR SEMANA -- facades/Agenda.mjs`);
                    return 'professor não possui disponibilidade para o dia selecionado ou excedeu limite de aulas disponíveis por semana';
                } else if (!turmaFazParteDoCurso) {
                    console.error(`-- ERRO -- TURMA NÃO FAZ O CURSO SELECIONADO -- facades/Agenda.mjs`);
                    return 'turma não faz o curso selecionado';
                } else if (!salaEstaDisponivel) {
                    console.error(`-- ERRO -- SALA JÁ ESTÁ OCUPADA NO DIA SELECIONADO -- facades/Agenda.mjs`);
                    return 'sala já está ocupada no dia selecionado';
                } else if (!professorLecionaADisciplina) {
                    console.error(`-- ERRO -- PROFESSOR NÃO LECIONA ESSA DISCIPLINA`);
                    return 'professor não dá aula para a disciplina selecionada';
                } else if (!professorJaTemAulaNoDia) {
                    console.error(`-- ERRO -- PROFESSOR JÁ TEM AULA MARCADA PARA O DIA SELECIONADO`);
                    return 'professor já tem aula marcada para o dia selecionado';
                } else {
                    const comando = `INSERT INTO agenda (data, id_curso, id_turma, cpf_professor, id_sala, id_disciplina) VALUES ('${data}', ${id_curso}, ${id_turma}, ${cpf_professor}, ${id_sala}, ${id_disciplina})`;
                    await client.query(comando);

                    console.log(`- função agendarAula() concluída com sucesso.`);
                    return `aula agendada para a data ${data} com sucesso`;
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async verificarDisponibilidadeDoProfessor(data, cpf_professor) {
        console.log(`- verificarDisponibilidadeDoProfessor(${data}, ${cpf_professor}) -- facades/Agenda.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const dataSelecionada = new Date(data);
                const dia_semana = dataSelecionada.getDay();
                //função getDay() só funciona quando é usada em um Date(), por isso acima coloquei esse Date(data) na dataSelecionada
                //é utilizada para buscar no array dias_da_semana[] e verificar o dia da semana da data selecionada

                let disponibilidade = await professorFacade.consultarDisponibilidade(cpf_professor);

                const verificarTipoDeDisponibilidade = async () => {
                    //se a disponibilidade consultada for um número inteiro o tipo de disponibilidade é por quantidade
                    //se for NaN, o tipo de disponibilidade é específica

                    if (Number.isInteger(parseInt(disponibilidade[0]))) {
                        disponibilidade = parseInt(disponibilidade[0]);

                        console.log(`- tipo de disponibilidade do professor: quantidade -- facades/Agenda.mjs`);
                        return 'quantidade';
                    } else {

                        console.log(`- tipo de disponibilidade do professor: específica -- facades/Agenda.mjs`);
                        return 'especifica';
                    }
                }

                const tipoDeDisponibilidade = await verificarTipoDeDisponibilidade();

                if (tipoDeDisponibilidade == 'especifica') {
                    const estaDisponivelNoDia = ([disponibilidade.find((dia) => dia == dias_da_semana[dia_semana])]);

                    if (estaDisponivelNoDia[0] == undefined) {
                        return false;
                    } else {
                        return true;
                    }

                } else if (tipoDeDisponibilidade == 'quantidade') {
                    const segundaFeira = await this.acharSegundaFeira(data);
                    const dateSegundaFeira = new Date(segundaFeira)

                    const dateSabado = new Date(segundaFeira);
                    dateSabado.setDate(dateSegundaFeira.getDate() + 5);

                    const sabado = dateSabado.toISOString().split('T')[0];

                    const comando = `SELECT COUNT(*) FROM agenda WHERE cpf_professor = '${cpf_professor}' AND data BETWEEN '${segundaFeira}' AND '${sabado}'`;
                    const quantidade = (await client.query(comando)).rows.map(row => row.count)[0];

                    if (quantidade >= disponibilidade) {
                        return false;
                    } else {
                        return true;
                    }
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async acharSegundaFeira(data) {
        data = new Date(data);
        const diferenca = data.getDay();

        const segundaFeira = new Date(data);
        segundaFeira.setDate(data.getDate() - diferenca);

        const segundaFeiraDaSemana = segundaFeira.toISOString().split('T')[0];

        return segundaFeiraDaSemana;
    }

    async verificarSeProfessorJaTemAulaNoDia(cpf_professor, data) {
        console.log(`- verificarSeProfessorJaTemAulaNoDia(${cpf_professor}, ${data}) -- facades/Agenda.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `SELECT cpf_professor FROM agenda WHERE cpf_professor = ${cpf_professor} AND data = '${data}'`;
                const resultado = ((await client.query(comando)).rows.map(row => row.cpf_professor))[0];

                if (resultado == undefined) {
                    return true;
                } else {
                    return false;
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async verificarSeTurmaFazParteDoCurso(id_curso, id_turma) {
        console.log(`- verificarSeTurmaFazParteDoCurso(${id_curso}, ${id_turma}) -- facades/Agenda.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comando = `SELECT id_curso FROM turmas WHERE turmas.id = ${id_turma}`;
                const resultado = (await client.query(comando)).rows;

                const cursos = resultado.map(row => row.id_curso)

                const cursosDaTurma = ([cursos.find((curso) => curso == id_curso)]);

                if (cursosDaTurma[0] == undefined) {
                    return false;
                } else {
                    return true;
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async verificarDisponibilidadeDaSalaNoDia(data, id_sala) {
        console.log(`- verificarDisponibilidadeDaSalaNoDia(${data}, ${id_sala}) -- facades/Agenda.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comando = `SELECT data, id_sala FROM agenda WHERE data = '${data}'`;
                const resultado = (await client.query(comando)).rows;

                const salasUsadasNoDia = resultado.map(row => row.id_sala);

                const estaDisponivelNoDia = ([salasUsadasNoDia.find((sala) => sala == id_sala)]);

                if (estaDisponivelNoDia[0] == undefined) {
                    return true;
                } else {
                    return false;
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async verificarSeProfessorDaAulaParaADisciplina(cpf_professor, id_disciplina) {
        console.log(`- verificarSeProfessorDaAulaParaADisciplina(${cpf_professor}, ${id_disciplina}) -- facades/Agenda.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const consultarDisciplinasDoProfessor = async () => {
                    const comando = `SELECT id_disciplina FROM disciplina_professores WHERE cpf_professor = ${cpf_professor}`;
                    const resultado = (await client.query(comando)).rows;
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
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}