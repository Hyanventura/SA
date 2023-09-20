import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export default class TurmaFacade {

    constructor() {
        this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
    }

    async cadastrar(nome, id_curso) {
        try {
            const comando = `INSERT INTO turmas(nome, id_curso) VALUES ('${nome}', ${id_curso})`;
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async editar(id, nome, id_curso) {
        try {
            const comando = `UPDATE turmas set nome = '${nome}', id_curso = ${id_curso} where id = ${id}`;
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async consultar(id) {
        try {
            if(id == 'todas' || id == 'todos'){
                const comando = `SELECT * FROM turmas`;
                const resultado = await this.client.query(comando);
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM turmas where id = ${id}`
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
            const comando = `DELETE FROM turmas WHERE id = ${id}`
            await this.client.query(comando);
        } catch (erro) {
            console.log(erro);
            return erro;
        }
    }

    async closeDatabase() {
        await this.client.close()
    }
}