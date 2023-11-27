import Pool from "pg-pool";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

export default class ProfessorFacade {

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE,
        });
    }

    async cadastrar(cpf, nome, status, disciplinas, seg, ter, qua, qui, sex, qtd) {
        console.log(`- cadastrar(${cpf}, ${nome}, ${status}) -- facades/Professor.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const consulta = await this.consultar(cpf)

                if (consulta.length > 0) {
                    return `Professor de CPF = ${cpf} já existe, não foi possível cadastrá-lo`
                } else {
                    const comando = `INSERT INTO professores(cpf, nome,  status) VALUES (${cpf}, '${nome}', ${status});`;
                    await client.query(comando);
                }

                if ((seg == undefined && ter == undefined && qua == undefined && qui == undefined && sex == undefined && qtd == undefined)) {
                    if (disciplinas == undefined) {
                        return `Nenhuma disponibilidade nem disciplina selecionada, cadastrando apenas CPF e NOME`;
                    } else {
                        this.cadastrarDisciplinas(cpf, disciplinas);
                        return `Nenhuma disponibilidade selecionada, cadastrando apenas CPF, NOME e DISCIPLINAS`;
                    }
                } else if (disciplinas == undefined) {
                    this.cadastrarDisponibilidade(cpf, seg, ter, qua, qui, sex, qtd);
                    return `Nenhuma disciplina selecionada, cadastrando apenas CPF, NOME e DISPONIBILIDADE`;
                } else {
                    this.cadastrarDisciplinas(cpf, disciplinas);
                    this.cadastrarDisponibilidade(cpf, seg, ter, qua, qui, sex, qtd);

                    return `Professor '${nome}' cadastrado com sucesso!`
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async editar(cpf, nome, status, disciplinas, seg, ter, qua, qui, sex, qtd) {
        console.log(`- editar(${cpf}, ${nome}, ${status}) -- facades/Professor.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `UPDATE professores SET nome = '${nome}', status = ${status} where cpf = ${cpf}`;
                await client.query(comando);

                if ((seg == undefined && ter == undefined && qua == undefined && qui == undefined && sex == undefined && qtd == undefined)) {
                    if (disciplinas == undefined) {
                        return `Nenhuma disponibilidade nem disciplina selecionada, editando apenas CPF e NOME`;
                    } else {
                        this.cadastrarDisciplinas(cpf, disciplinas);
                        return `Nenhuma disponibilidade selecionada, editando apenas CPF, NOME e DISCIPLINAS`;
                    }
                } else if (disciplinas == undefined) {
                    this.cadastrarDisponibilidade(cpf, seg, ter, qua, qui, sex, qtd);
                    return `Nenhuma disciplina selecionada, editando apenas CPF, NOME e DISPONIBILIDADE`;
                } else {
                    this.cadastrarDisciplinas(cpf, disciplinas);
                    this.cadastrarDisponibilidade(cpf, seg, ter, qua, qui, sex, qtd);

                    return `Professor '${nome}' editado com sucesso!`
                }

            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async consultar(cpf) {
        console.log(`- consultar(${cpf}) -- facades/Professor.mjs`)

        try {
            const client = await this.pool.connect();

            try {

                if (cpf == 'todos') {
                    const comando = `SELECT * FROM professores`;
                    const resultado = await client.query(comando);

                    return resultado.rows;
                } else {
                    const comando = `SELECT * FROM professores where cpf = ${cpf}`;
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

    async consultarDisponibilidade(cpf) {
        console.log(`- consultarDisponibilidade(${cpf}) -- facades/Professor.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                const comando = `select dias_semana.nome as DIA_SEMANA, professores.nome as PROFESSOR, disponibilidade.qtd_dias_disponiveis as QUANTIDADE from disponibilidade left join dias_semana on dias_semana.id = disponibilidade.id_dia_semana left join professores on professores.cpf = disponibilidade.cpf_professor where disponibilidade.cpf_professor = ${cpf}`;
                const resultado = (await client.query(comando)).rows;
                const diasDisponiveis = resultado.map(row => row.dia_semana);
                const qtdDiasDisponiveis = resultado.map(row => row.quantidade);

                for (let i = 0; i < resultado.length; i++) {
                    if ((qtdDiasDisponiveis[i] > 0) && (qtdDiasDisponiveis[i] < 6)) {
                        return qtdDiasDisponiveis;
                    } else if (diasDisponiveis[i] > 1) {
                        return diasDisponiveis;
                    }

                }

                return (diasDisponiveis);
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async cadastrarDisponibilidade(cpf, seg, ter, qua, qui, sex, qtd) {
        console.log(`- cadastrarDisponibilidade(${cpf}, ${seg}, ${ter}, ${qua}, ${qui}, ${sex}, ${qtd}) -- facades/Professor.mjs`)

        try {
            const client = await this.pool.connect();

            try {
                let diasSemana = [seg, ter, qua, qui, sex, qtd];
                let id_dia_semana = 2;

                const comandoDeletarDisponibilidade = `DELETE FROM disponibilidade where cpf_professor = (${cpf})`;
                await client.query(comandoDeletarDisponibilidade);

                for (let i = 0; i < diasSemana.length; i++) {

                    if ((diasSemana[i] == 1) && (diasSemana[5] == undefined)) {
                        const comando = `INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES (${cpf}, ${id_dia_semana})`;
                        await client.query(comando);

                        console.log(`- cadastrada disponibilidade - ${cpf}, ${id_dia_semana}`)

                    } else if ((diasSemana[5] > 0) && (diasSemana[5] < 6) && (i == 5)) {
                        const comando = `INSERT INTO disponibilidade(cpf_professor, qtd_dias_disponiveis) VALUES (${cpf}, ${qtd})`;
                        await client.query(comando);

                        console.log(`- cadastrada disponibilidade - ${cpf}, ${qtd} dias por semana`)
                    }
                    id_dia_semana++;
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async consultarDisciplinasDoProfessor(cpf) {
        console.log(`- consultarDisciplinasDoProfessor(${cpf}) -- facades/Professor.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comando = `select disciplina_professores.cpf_professor, professores.nome as PROFESSOR, disciplinas.nome as DISCIPLINA from disciplina_professores left join professores on professores.cpf = disciplina_professores.cpf_professor left join disciplinas on disciplinas.id = disciplina_professores.id_disciplina where disciplina_professores.cpf_professor = ${cpf}`;
                const resultado = await client.query(comando);
                const disciplinas = resultado.rows.map(row => row.disciplina);

                return disciplinas;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async cadastrarDisciplinas(cpf, disciplinas) {
        console.log(`- cadastrarDisciplina(${cpf}, [${disciplinas}]) -- facades/Professor.mjs`);

        try {
            const client = await this.pool.connect();

            try {
                const comandoDeletarDisciplina = `DELETE FROM disciplina_professores WHERE cpf_professor = ${cpf}`;
                await client.query(comandoDeletarDisciplina);

                for (let i = 0; i < disciplinas.length; i++) {
                    const comando = `INSERT INTO disciplina_professores (cpf_professor, id_disciplina) VALUES (${cpf}, ${disciplinas[i]})`;
                    await client.query(comando);
                }
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async importarCSV(filePath) {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            const client = await this.pool.connect();

            try {
                //for row of data vai percorrer todos os objetos armazenados no array data, onde ele consegue inserir as informações de acordo com os atributos de cada objeto
                for (const row of data) {
                    const comando = `INSERT INTO professores (cpf, nome, status) VALUES (${row.cpf}, '${row.nome}', ${row.status})`;
                    await client.query(comando)

                    console.log(`- importarCSV(${filePath}) -- facades/Professor.mjs`)
                    console.log(`- importado: ${row.cpf}, ${row.nome}, ${row.status} -- facades/Professor.mjs`)

                    let id_dia_semana = 2;
                    let diasSemana = [row.seg, row.ter, row.qua, row.qui, row.sex]

                    for (let i = 0; i < diasSemana.length; i++) {

                        if (diasSemana[i] == 1) {
                            const comandoDisponibilidade = `INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES (${row.cpf}, ${id_dia_semana})`
                            await client.query(comandoDisponibilidade)

                            console.log(`- importada disponibilidade: '${row.cpf}', '${id_dia_semana}' -- facades/Professor.mjs`)
                        }
                        id_dia_semana++;
                    }
                }
                return data;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}