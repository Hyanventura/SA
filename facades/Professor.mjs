import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
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

            const comando = `select dias_semana.nome as DIA_SEMANA, professores.nome as PROFESSOR from disponibilidade left join dias_semana on dias_semana.id = disponibilidade.id_dia_semana left join professores on professores.cpf = disponibilidade.cpf_professor where disponibilidade.cpf_professor = ${cpf}`;
            const resultado = await this.client.query(comando);
            const diasDisponiveis = resultado.rows.map(row => row.dia_semana);
            const professor = resultado.rows.map(row => row.professor);

            let mensagem = `O professor ${professor[0]}, CPF=${cpf} está disponível nos dias: `

            for (let i = 0; i < diasDisponiveis.length; i++) {
                mensagem = `${mensagem}\n${diasDisponiveis[i]}`
            }

            console.log(`- consultarDisponibilidade(${cpf}) -- facades/Professor.mjs`)
            return mensagem;
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }

    async cadastrarDisponibilidade(cpf, seg, ter, qua, qui, sex) {
        try {
            this.conectarDatabase()

            let diasSemana = [seg, ter, qua, qui, sex]
            let id_dia_semana = 2;

            const comandoDeletarDisponibilidade = `DELETE FROM disponibilidade where cpf_professor = (${cpf})`
            await this.client.query(comandoDeletarDisponibilidade)

            console.log(`- cadastrarDisponibilidade(${cpf}, ${seg}, ${ter}, ${qua}, ${qui}, ${sex}) -- facades/Professor.mjs`)
            for (let i = 0; i < diasSemana.length; i++) {

                if (diasSemana[i] == 1) {
                    const comando = `INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES (${cpf}, ${id_dia_semana})`
                    await this.client.query(comando)

                    console.log(`- cadastrada disponibilidade - ${cpf}, ${id_dia_semana}`)
                }
                id_dia_semana++;
            }

            
        } catch (erro) {
            console.error(erro)
            return erro
        } finally {
            this.closeDatabase()
        }
    }

    async cadastrarDisciplina(cpf, disciplina) {
        try {
            this.conectarDatabase()

            comando = `INSERT INTO disciplina_professores (cpf_professor, id_disciplina) VALUES (${cpf}, ${disciplina})`
            await this.client.query(comando)

            console.log(`- cadastrarDisciplina(${cpf}, ${disciplina}) -- facades/Professor.mjs`)
        } catch (erro) {
            console.error(erro)
            return erro
        } finally {
            this.closeDatabase()
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