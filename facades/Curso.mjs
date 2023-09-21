import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class CursoFacade {

    constructor() {
        this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
    }

    async cadastrar(nome) {
        try {
            const comando = `INSERT INTO cursos(nome) VALUES ('${nome}')`
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro
        }
    }

    async editar(id, nome) {
        try {
            const comando = `UPDATE cursos set nome = '${nome}' where id = ${id}`
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro
        }
    }

    async consultar(id) {
        try {
            if (id == 'todas' || id == 'todos') {
                const comando = `SELECT * FROM cursos`;
                const resultado = await this.client.query(comando);
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM cursos where id = ${id}`;
                const resultado = await this.client.query(comando);
                return resultado.rows;
            }
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async deletar(id) {
        try {
            const comando = `DELETE FROM cursos WHERE id = ${id}`;
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async importarCSV(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        try {
            for (const row of data) {
                const comando = `INSERT INTO cursos(nome) VALUES ('${row.nome}')`;
                await this.client.query(comando);
            }
            return data
        } catch (erro) {
            console.error(erro);
            return erro;
        }

    }

    async closeDatabase() {
        await this.client.close()
    }
}