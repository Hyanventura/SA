import Pool from "pg-pool";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();


export default class CursoFacade {

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE,
        });
    }

    async cadastrar(nome, cod, disciplinas, qtd_aulas_semana) {
        console.log(`- cadastrar(${nome}, ${cod}, ${disciplinas}, ${qtd_aulas_semana}) -- facades/Curso.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `INSERT INTO cursos(nome, cod) VALUES ('${nome}', ${cod})`;
                await client.query(comando);

                if (disciplinas == undefined || qtd_aulas_semana == undefined) {
                    return 'Disciplina ou Quantidade de aulas por semana não informados, cadastrando apenas NOME e CÓDIGO';

                } else if (disciplinas.length != qtd_aulas_semana.length){
                    return 'Quantidade de disciplinas informada difere do número de quantidades de aulas por semana informado, cadastrando apenas NOME e CÓDIGO';
                } else {
                    this.cadastrarDisciplinas(cod, disciplinas, qtd_aulas_semana);
                    return `Curso '${nome}' cadastrado com código '${cod}' com sucesso!`
                }

            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async cadastrarDisciplinas(cod_curso, disciplinas, qtd_aulas_semana) {
        console.log(`- cadastrarDisciplina(${cod_curso}, [${disciplinas}]) -- facades/Curso.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comandoDeletarDisciplina = `DELETE FROM disciplina_cursos WHERE id_curso = (select id from cursos where cod = ${cod_curso})`;
                await client.query(comandoDeletarDisciplina);

                for (let i = 0; i < disciplinas.length; i++) {
                    const comando = `INSERT INTO disciplina_cursos (id_curso, id_disciplina, qtd_aulas_semana) VALUES ((select id from cursos where cod = ${cod_curso}), ${disciplinas[i]}, ${qtd_aulas_semana[i]})`;
                    await client.query(comando);

                    console.log(`- inserida disciplina ID=${disciplinas[i]} com ${qtd_aulas_semana[i]} aula(s) por semana para o curso COD=${cod_curso} -- facades/Curso.mjs`)
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async editar(id, nome, cod, disciplinas, qtd_aulas_semana) {
        console.log(`- editar(${id}, ${nome}, ${cod}, ${disciplinas}, ${qtd_aulas_semana}) -- facades/Curso.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `UPDATE cursos set nome = '${nome}', cod = ${cod} where id = ${id}`
                await client.query(comando);

                if (disciplinas == undefined || qtd_aulas_semana == undefined) {
                    return 'Disciplina ou Quantidade de aulas por semana não informados, editando apenas NOME e CÓDIGO';

                } else if (disciplinas.length != qtd_aulas_semana.length){
                    return 'Quantidade de disciplinas informada difere do número de quantidades de aulas por semana informado, editando apenas NOME e CÓDIGO';
                } else {
                    this.cadastrarDisciplinas(cod, disciplinas, qtd_aulas_semana);
                    return `Curso ID=${id} alterado com sucesso!\nNOME=${nome}\nCOD=${cod}`
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async consultar(id) {
        console.log(`- consultar(${id}) -- facades/Curso.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                if (id == 'todas' || id == 'todos') {
                    const comando = `SELECT * FROM cursos`;
                    const resultado = await client.query(comando);


                    return resultado.rows;
                } else {
                    const comando = `SELECT * FROM cursos where id = ${id}`;
                    const resultado = await client.query(comando);

                    console.log(`- consultar(${id}) -- facades/Curso.mjs`)
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
        console.log(`- deletar(${id}) -- facades/Curso.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comandoDeletarDisciplina = `DELETE FROM disciplina_cursos WHERE id_curso = ${id}`;
                await client.query(comandoDeletarDisciplina);

                const comando = `DELETE FROM cursos WHERE id = ${id}`;
                await client.query(comando);

                return `Curso ID=${id} excluído com sucesso.`;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async importarCSV(filePath) {
        console.log(`- importarCSV(${filePath}) -- facades/Curso.mjs`)

        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            const client = await this.pool.connect();

            try {
                for (const row of data) {
                    const comando = `INSERT INTO cursos(nome) VALUES ('${row.nome}')`;
                    await client.query(comando);

                    console.log(`- importado: '${row.nome}' -- facades/Curso.mjs`)
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