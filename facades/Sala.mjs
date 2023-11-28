import Pool from "pg-pool";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class SalaFacade {

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE,
        });
    }

    async cadastrar(nome, cod) {
        console.log(`- cadastrar(${nome}, ${cod}) -- facades/Sala.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comando = `INSERT INTO salas(nome, cod) VALUES ('${nome}', ${cod})`;
                await client.query(comando);

                return `Sala '${nome}' de código ${cod} cadastrada com sucesso!`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async editar(id, nome, cod) {
        console.log(`- editar(${id}, ${nome}, ${cod}) -- facades/Sala.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comando = `UPDATE salas SET nome = '${nome}', cod = ${cod} where id = ${id}`
                await client.query(comando);

                return `Sala ID=${id} alterada com sucesso!\nNOME=${nome}\nCOD=${cod}`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async consultar(id) {
        console.log(`- consultar(${id}) -- facades/Sala.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                if (id == 'todas' || id == 'todos') {
                    const comando = `SELECT * FROM salas`;
                    const resultado = await client.query(comando);

                    return resultado.rows;
                } else {
                    const comando = `SELECT * FROM salas where id = ${id}`
                    const resultado = await client.query(comando);

                    return resultado.rows;
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async consultarPorNome(nome) {
        try {
            const client = await this.pool.connect();
            try {
                const comando = `SELECT id, nome, cod FROM salas WHERE unaccent(nome) ilike '%${nome}%'`;
                const resultado = (await client.query(comando)).rows

                return resultado;

            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async deletar(id) {
        console.log(`- deletar(${id}) -- facades/Sala.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comando = `DELETE FROM salas WHERE id = ${id}`;
                await client.query(comando);

                return `Sala ID=${id} excluída com sucesso.`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async importarCSV(filePath) {
        console.log(`- importarCSV(${filePath}) -- facades/Sala.mjs`);

        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            const client = await this.pool.connect();

            try {
                for (const row of data) {
                    const comando = `INSERT INTO salas(nome, cod) VALUES ('${row.nome}', ${row.cod})`;
                    await client.query(comando);
    
                    console.log(`- importado: '${row.nome}', '${row.cod}' -- facades/Sala.mjs`)
                }
                return data
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}