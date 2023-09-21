import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();


export default class CursoFacade {

    constructor() {
        // this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
        console.log('- Conectado ao BD -- facades/Curso.mjs')
    }

    async cadastrar(nome) {
        try {
            this.conectarDatabase();

            const comando = `INSERT INTO cursos(nome) VALUES ('${nome}')`
            await this.client.query(comando);

            console.log(`- cadastrar(${nome}) -- facades/Curso.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro
        } finally {
            this.closeDatabase()
        }
    }

    async editar(id, nome) {
        try {
            this.conectarDatabase();

            const comando = `UPDATE cursos set nome = '${nome}' where id = ${id}`
            await this.client.query(comando);

            console.log(`- editar(${id}, ${nome}) -- facades/Curso.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro
        } finally {
            this.closeDatabase()
        }
    }

    async consultar(id) {
        try {
            this.conectarDatabase();

            if (id == 'todas' || id == 'todos') {
                const comando = `SELECT * FROM cursos`;
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${id}) -- facades/Curso.mjs`)
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM cursos where id = ${id}`;
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${id}) -- facades/Curso.mjs`)
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

            const comando = `DELETE FROM cursos WHERE id = ${id}`;
            await this.client.query(comando);

            console.log(`- deletar(${id}) -- facades/Curso.mjs`)
        } catch (erro) {
            console.error(erro);
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

            console.log(`- importarCSV(${filePath}) -- facades/Curso.mjs`)
            for (const row of data) {
                const comando = `INSERT INTO cursos(nome) VALUES ('${row.nome}')`;
                await this.client.query(comando);

                console.log(`- importado: '${row.nome}' -- facades/Curso.mjs`)
            }

            
            return data
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            this.closeDatabase()
        }

    }

    async closeDatabase() {
        await this.client.end()
        console.log('- Desconectado do BD -- facades/Curso.mjs')
    }
}