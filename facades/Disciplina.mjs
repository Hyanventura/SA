import Pool from "pg-pool";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class DisciplinaFacade {

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE,
        });
    }

    async cadastrar(nome) {
        console.log(`- cadastrar(${nome}) -- facades/Disciplina.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `INSERT INTO disciplinas(nome) VALUES ('${nome}')`;
                await client.query(comando);

                return `Disciplina '${nome}' cadastrada com sucesso!`
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async editar(id, nome) {
        console.log(`- editar(${id}, ${nome}) -- facades/Disciplina.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `UPDATE disciplinas SET nome = '${nome}' where id = ${id}`;
                await client.query(comando);

                return `Disciplina ID=${id} teve seu nome alterado para: ${nome}`
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async consultar(id) {
        console.log(`- consultar(${id}) -- facades/Disciplina.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                if (id == 'todas' || id == 'todos') {
                    const comando = `SELECT * FROM disciplinas`;
                    const resultado = await client.query(comando);

                    return resultado.rows;
                } else {
                    const comando = `SELECT * FROM disciplinas where id = ${id}`;
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

    async deletar(id) {
        console.log(`- deletar(${id}) -- facades/Disciplina.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `DELETE FROM disciplinas WHERE id = ${id}`;
                await client.query(comando);

                return `Disciplina ID=${id} excluída com sucesso.`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async importarCSV(filePath) {
        console.log(`- importarCSV(${filePath}) -- facades/Disciplina.mjs`)

        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            const client = await this.pool.connect();

            try {
                for (const row of data) {
                    const comando = `INSERT INTO disciplinas(nome) VALUES ('${row.nome}')`;
                    await client.query(comando);
                    console.log(`- importado: '${row.nome}' -- facades/Disciplina.mjs`)
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