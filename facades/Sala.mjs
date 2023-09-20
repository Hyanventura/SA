import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export default class SalaFacade {
    
    constructor() {
        this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
    }

    async cadastrar(nome, cod) {
        try {
           const comando = `INSERT INTO salas(nome, cod) VALUES ('${nome}', ${cod})` 
           await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async editar(id, nome, cod) {
        try {
            const comando = `UPDATE salas SET nome = '${nome}', cod = ${cod} where id = ${id}`
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async consultar(id) {
        try {
            if(id == 'todas' || id == 'todos'){
                const comando = `SELECT * FROM salas`;
                const resultado = await this.client.query(comando);
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM salas where id = ${id}`
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
            const comando = `DELETE FROM salas WHERE id = ${id}`;
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