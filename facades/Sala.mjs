import pg from "pg";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class SalaFacade {

    constructor() {
        // this.conectarDatabase();
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE);
        await this.client.connect();
        console.log('- Conectado ao BD -- facades/Sala.mjs')
    }

    async cadastrar(nome, cod) {
        try {
            this.conectarDatabase();

            const comando = `INSERT INTO salas(nome, cod) VALUES ('${nome}', ${cod})`
            await this.client.query(comando);

            console.log(`- cadastrar(${nome}, ${cod}) -- facades/Sala.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            await this.closeDatabase()
        }
    }

    async editar(id, nome, cod) {
        try {
            this.conectarDatabase();

            const comando = `UPDATE salas SET nome = '${nome}', cod = ${cod} where id = ${id}`
            await this.client.query(comando);

            console.log(`- editar(${id}, ${nome}, ${cod}) -- facades/Sala.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            await this.closeDatabase()
        }
    }

    async consultar(id) {
        try {
            this.conectarDatabase();

            if (id == 'todas' || id == 'todos') {
                const comando = `SELECT * FROM salas`;
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${id}) -- facades/Sala.mjs`)
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM salas where id = ${id}`
                const resultado = await this.client.query(comando);

                console.log(`- consultar(${id}) -- facades/Sala.mjs`)
                return resultado.rows;
            }
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            await this.closeDatabase()
        }
    }

    async deletar(id) {
        try {
            this.conectarDatabase();

            const comando = `DELETE FROM salas WHERE id = ${id}`;
            await this.client.query(comando);

            console.log(`- deletar(${id}) -- facades/Sala.mjs`)
        } catch (erro) {
            console.error(erro);
            return erro;
        } finally {
            await this.closeDatabase()
        }
    }

    async importarCSV(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        try {
            this.conectarDatabase();

            console.log(`- importarCSV(${filePath}) -- facades/Sala.mjs`)
            for (const row of data) {
                const comando = `INSERT INTO salas(nome, cod) VALUES ('${row.nome}', ${row.cod})`;
                await this.client.query(comando);

                console.log(`- importado: '${row.nome}', '${row.cod}' -- facades/Sala.mjs`)
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
        await this.client.end();
        console.log('- Desconectado do BD -- facades/Sala.mjs')
    }
}