import Pool from "pg-pool";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class TurmaFacade {

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE,
        });
    }

    async cadastrar(nome, id_curso) {
        console.log(`- cadastrar(${nome}, ${id_curso}) -- facades/Turma.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `INSERT INTO turmas(nome, id_curso) VALUES ('${nome}', ${id_curso})`;
                await client.query(comando);

                return `Turma '${nome}' cadastrada com sucesso!`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async editar(id, nome, id_curso) {
        console.log(`- editar(${id}, ${nome}, ${id_curso}) -- facades/Turma.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `UPDATE turmas set nome = '${nome}', id_curso = ${id_curso} where id = ${id}`;
                await client.query(comando);

                return `Turma ID=${id} alterada com sucesso!\nNOME=${nome}\nID_CURSO=${id_curso}`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async consultar(id) {
        console.log(`- consultar(${id}) -- facades/Turma.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                if (id == 'todas' || id == 'todos') {
                    const comando = `SELECT * FROM turmas`;
                    const resultado = await client.query(comando);

                    return resultado.rows;
                } else {
                    const comando = `SELECT * FROM turmas where id = ${id}`
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
        console.log(`- deletar(${id}) -- facades/Turma.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `DELETE FROM turmas WHERE id = ${id}`
                await client.query(comando);

                return `Turma ID=${id} excluída com sucesso.`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async importarCSV(filePath) {
        console.log(`- importarCSV(${filePath}) -- facades/Turma.mjs`)

        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            const client = await this.pool.connect();

            try {
                for (const row of data) {
                    const comando = `INSERT INTO turmas(nome, id_curso) VALUES ('${row.nome}', ${row.id_curso})`;
                    await client.query(comando);

                    console.log(`- importado: '${row.nome}', '${row.id_curso}' -- facades/Turma.mjs`)
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