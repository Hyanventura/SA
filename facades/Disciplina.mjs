import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class DisciplinaFacade {

    constructor() {
        this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
    }

    async cadastrar(nome) {
        try {
            const comando = `INSERT INTO disciplinas(nome) VALUES ('${nome}')`;
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async editar(id, nome) {
        try {
            const comando = `UPDATE disciplinas SET nome = '${nome}' where id = ${id}`;
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async consultar() {
        try {
            const comando = `SELECT * FROM disciplinas`;
            const resultado = await this.client.query(comando);
            return resultado.rows
            
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async deletar(id) {
        try {
            const comando = `DELETE FROM disciplinas WHERE id = ${id}`;
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
                const comando = `INSERT INTO disciplinas(nome) VALUES ('${row.nome}')`;
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