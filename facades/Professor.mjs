import pg from "pg"
import dotenv from "dotenv"
dotenv.config()

export default class ProfessorFacade {

    constructor() {
        this.conectarDatabase()
    }

    async conectarDatabase() {
        this.client = new pg.Client(process.env.DATABASE)
        await this.client.connect()
    }

    async cadastrar(cpf, nome, status) {
        try {
            const comando = `INSERT INTO professores(cpf, nome,  status) VALUES (${cpf}, '${nome}', ${status});`
            const resultado = await this.client.query(comando)
            return resultado.rows
        } catch (erro) {
            console.error(erro)
            return erro
        }
    }

    async editar(cpf, nome, status) {
        try {
            const comando = `UPDATE professores SET nome = '${nome}', status = ${status} where cpf = ${cpf}`;
            await this.client.query(comando);
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async consultar(cpf) {
        try {
            if (cpf == 'todos') {
                const comando = `SELECT * FROM professores`;
                const resultado = await this.client.query(comando);
                return resultado.rows;
            } else {
                const comando = `SELECT * FROM professores where cpf = ${cpf}`;
                const resultado = await this.client.query(comando);
                return resultado.rows;
            }
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async consultarDisponibilidade(cpf) {
        try {
            const comando = `select dias_semana.nome as DIA_SEMANA, professores.nome as PROFESSOR from disponibilidade left join dias_semana on dias_semana.id = disponibilidade.id_dia_semana left join professores on professores.cpf = disponibilidade.cpf_professor where disponibilidade.cpf_professor = ${cpf}`;
            const resultado = await this.client.query(comando);
            const diasDisponiveis = resultado.rows.map(row => row.dia_semana);
            const professor = resultado.rows.map(row => row.professor);

            let mensagem = `O professor ${professor[0]}, CPF=${cpf} está disponível nos dias: `

            for (let i = 0; i < diasDisponiveis.length; i++) {
                mensagem = `${mensagem}\n${diasDisponiveis[i]}`
            }

            return mensagem;
        } catch (erro) {
            console.error(erro);
            return erro;
        }
    }

    async disponibilidade(cpf, seg, ter, qua, qui, sex) {
        try {
            let diasSemana = [seg, ter, qua, qui, sex]
            let id_dia_semana = 1;

            const comandoDeletarDisponibilidade = `DELETE FROM disponibilidade where cpf_professor = (${cpf})`
            await this.client.query(comandoDeletarDisponibilidade)

            for (let i = 0; i < diasSemana.length; i++) {
                id_dia_semana++;
                console.log(id_dia_semana)

                if (diasSemana[i] == 1) {
                    const comando = `INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES (${cpf}, ${id_dia_semana})`
                    await this.client.query(comando)
                }
            }
        } catch (erro) {
            console.error(erro)
            return erro
        }
    }

    async disciplina(cpf, disciplina) {
        try {
            comando = `INSERT INTO disciplina_professores (cpf_professor, id_disciplina) VALUES (${cpf}, ${disciplina})`
            await this.client.query(comando)
        } catch (erro) {
            console.error(erro)
            return erro
        }
    }


    async closeDatabase() {
        await this.client.close()
    }
}