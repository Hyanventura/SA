import pg from "pg";
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

    async closeDatabase() {
        await this.client.close()
    }
}