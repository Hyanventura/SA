import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class TurmaFacade {

    constructor() {
        // this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
        console.log('- Conectado ao BD -- facades/Turma.mjs')
    }

    async cadastrar(nome, id_curso) {
        try {
            this.conectarDatabase();

            const comando = `INSERT INTO turmas(nome, id_curso) VALUES ('${nome}', ${id_curso})`;
            await this.client.query(comando);

            console.log(`- cadastrar(${nome}, ${id_curso}) -- facades/Turma.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }

    async editar(id, nome, id_curso) {
        try {
            this.conectarDatabase();

            const comando = `UPDATE turmas set nome = '${nome}', id_curso = ${id_curso} where id = ${id}`;
            await this.client.query(comando);

            console.log(`- editar(${id}, ${nome}, ${id_curso}) -- facades/Turma.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }

    async consultar(id) {
        try {
            this.conectarDatabase();

            if (id == 'todas' || id == 'todos') {
                const comando = `SELECT * FROM turmas`;
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${id}) -- facades/Turma.mjs`)
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM turmas where id = ${id}`
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${id}) -- facades/Turma.mjs`)
                return resultado.rows;
            }
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }
    }

    async deletar(id) {
        try {
            this.conectarDatabase();

            const comando = `DELETE FROM turmas WHERE id = ${id}`
            await this.client.query(comando);

            console.log(`- deletar(${id}) -- facades/Turma.mjs`)
        } catch (erro) {
            console.log(erro);
            return erro;
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
            this.conectarDatabase();

            console.log(`- importarCSV(${filePath}) -- facades/Turma.mjs`)
            for (const row of data) {
                const comando = `INSERT INTO turmas(nome, id_curso) VALUES ('${row.nome}', ${row.id_curso})`;
                await this.client.query(comando);

                console.log(`- importado: '${row.nome}', '${row.id_curso}' -- facades/Turma.mjs`)
            }
            return data
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            await this.closeDatabase()
        }

    }

    async closeDatabase() {
        await this.client.end()
        console.log('- Desconectado do BD -- facades/Turma.mjs')
    }
}