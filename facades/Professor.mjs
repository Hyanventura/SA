import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
import DisciplinaFacade from "./Disciplina.mjs";
const disciplinaFacade = new DisciplinaFacade();
dotenv.config();

export default class ProfessorFacade {

    constructor() {
        // this.conectarDatabase()
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE)
        await this.client.connect()
        console.log('- Conectado ao BD -- facades/Professor.mjs')
    }

    async cadastrar(cpf, nome, status) {
        try {
            this.conectarDatabase()

            const comando = `INSERT INTO professores(cpf, nome,  status) VALUES (${cpf}, '${nome}', ${status});`
            const resultado = await this.client.query(comando)

            console.log(`- cadastrar(${cpf}, ${nome}, ${status}) -- facades/Professor.mjs`)
            return resultado.rows
        } catch (erro) {
            console.error(erro)
            return erro
        } finally {
            this.closeDatabase()
        }
    }

    async editar(cpf, nome, status) {
        try {
            this.conectarDatabase()

            const comando = `UPDATE professores SET nome = '${nome}', status = ${status} where cpf = ${cpf}`;
            await this.client.query(comando);

            console.log(`- editar(${cpf}, ${nome}, ${status}) -- facades/Professor.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }

    async consultar(cpf) {
        try {
            this.conectarDatabase()

            if (cpf == 'todos') {
                const comando = `SELECT * FROM professores`;
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${cpf}) -- facades/Professor.mjs`)
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM professores where cpf = ${cpf}`;
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${cpf}) -- facades/Professor.mjs`)
                return resultado.rows;
            }
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }

    async consultarDisponibilidade(cpf) {
        try {
            this.conectarDatabase()

            const comando = `select dias_semana.nome as DIA_SEMANA, professores.nome as PROFESSOR, disponibilidade.qtd_dias_disponiveis as QUANTIDADE from disponibilidade left join dias_semana on dias_semana.id = disponibilidade.id_dia_semana left join professores on professores.cpf = disponibilidade.cpf_professor where disponibilidade.cpf_professor = ${cpf}`;
            const resultado = (await this.client.query(comando)).rows;
            const diasDisponiveis = resultado.map(row => row.dia_semana);
            const qtdDiasDisponiveis = resultado.map(row => row.quantidade);
            // const professor = resultado.map(row => row.professor);

            // let mensagem = `O professor ${professor[0]}, CPF=${cpf} está disponível nos dias: `

            // for (let i = 0; i < diasDisponiveis.length; i++) {
            //     mensagem = `${mensagem}\n${diasDisponiveis[i]}`
            // }

            for (let i = 0; i < resultado.length; i++) {
                if ((qtdDiasDisponiveis[i] > 0) && (qtdDiasDisponiveis[i] < 6)) {
                    return qtdDiasDisponiveis;
                } else if (diasDisponiveis[i] > 1) {
                    return diasDisponiveis;
                }

            }

            console.log(`- consultarDisponibilidade(${cpf}) -- facades/Professor.mjs`)
            return (diasDisponiveis);
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }

    async cadastrarDisponibilidade(cpf, seg, ter, qua, qui, sex, qtd) {
        try {
            this.conectarDatabase();

            let diasSemana = [seg, ter, qua, qui, sex, qtd];
            let id_dia_semana = 2;

            const comandoDeletarDisponibilidade = `DELETE FROM disponibilidade where cpf_professor = (${cpf})`;
            await this.client.query(comandoDeletarDisponibilidade);

            console.log(`- cadastrarDisponibilidade(${cpf}, ${seg}, ${ter}, ${qua}, ${qui}, ${sex}, ${qtd}) -- facades/Professor.mjs`)
            for (let i = 0; i < diasSemana.length; i++) {

                if ((diasSemana[i] == 1) && (diasSemana[5] == undefined)) {
                    const comando = `INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES (${cpf}, ${id_dia_semana})`;
                    await this.client.query(comando);

                    console.log(`- cadastrada disponibilidade - ${cpf}, ${id_dia_semana}`)

                } else if ((diasSemana[5] > 0) && (diasSemana[5] < 6) && (i == 5)) {
                    const comando = `INSERT INTO disponibilidade(cpf_professor, qtd_dias_disponiveis) VALUES (${cpf}, ${qtd})`;
                    await this.client.query(comando);

                    console.log(`- cadastrada disponibilidade - ${cpf}, ${qtd} dias por semana`)
                }
                id_dia_semana++;
            }


        } catch (erro) {
            console.error(erro);
            return erro
        } finally {
            this.closeDatabase();
        }
    }

    async consultarDisciplinasDoProfessor(cpf) {
        try {
            this.conectarDatabase();

            const comando = `select disciplina_professores.cpf_professor, professores.nome as PROFESSOR, disciplinas.nome as DISCIPLINA from disciplina_professores left join professores on professores.cpf = disciplina_professores.cpf_professor left join disciplinas on disciplinas.id = disciplina_professores.id_disciplina where disciplina_professores.cpf_professor = ${cpf}`;
            const resultado = await this.client.query(comando);
            const disciplinas = resultado.rows.map(row => row.disciplina);

            console.log(`- consultarDisciplinasDoProfessor(${cpf}) -- facades/Professor.mjs`);
            return disciplinas;
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase();
        }
    }

    async cadastrarDisciplinas(cpf, disciplinas) {
        try {
            this.conectarDatabase();

            const comandoDeletarDisciplina = `DELETE FROM disciplina_professores WHERE cpf_professor = ${cpf}`;
            await this.client.query(comandoDeletarDisciplina);

            for (let i = 0; i < disciplinas.length; i++) {
                const comando = `INSERT INTO disciplina_professores (cpf_professor, id_disciplina) VALUES (${cpf}, ${disciplinas[i]})`;
                await this.client.query(comando);
            }

            console.log(`- cadastrarDisciplina(${cpf}, [${disciplinas}]) -- facades/Professor.mjs`);
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase();
        }
    }

    async importarCSV(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        try {
            this.conectarDatabase()

            //for row of data vai percorrer todos os objetos armazenados no array data, onde ele consegue inserir as informações de acordo com os atributos de cada objeto
            for (const row of data) {
                const comando = `INSERT INTO professores (cpf, nome, status) VALUES (${row.cpf}, '${row.nome}', ${row.status})`;
                await this.client.query(comando)

                console.log(`- importarCSV(${filePath}) -- facades/Professor.mjs`)
                console.log(`- importado: ${row.cpf}, ${row.nome}, ${row.status} -- facades/Professor.mjs`)

                let id_dia_semana = 2;
                let diasSemana = [row.seg, row.ter, row.qua, row.qui, row.sex]

                for (let i = 0; i < diasSemana.length; i++) {

                    if (diasSemana[i] == 1) {
                        const comandoDisponibilidade = `INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES (${row.cpf}, ${id_dia_semana})`
                        await this.client.query(comandoDisponibilidade)

                        console.log(`- importada disponibilidade: '${row.cpf}', '${id_dia_semana}' -- facades/Professor.mjs`)
                    }
                    id_dia_semana++;
                }
            }
            return data;
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }


    }


    async closeDatabase() {
        await this.client.end()
        console.log('- Desconectado do BD -- facades/Professor.mjs')
    }
}