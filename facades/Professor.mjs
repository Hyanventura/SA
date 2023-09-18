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

    async disponibilidade(cpf, seg, ter, qua, qui, sex) {
        try {
            let diasSemana = [seg, ter, qua, qui, sex]
            let id_dia_semana = 1;

            for (let i = 0; i < diasSemana.length; i++) {
                id_dia_semana++;
                console.log(id_dia_semana)
        
                if (diasSemana[i] == 1) {
                    let comando = `INSERT INTO disponibilidade(cpf_professor, id_dia_semana) VALUES (${cpf}, ${id_dia_semana})`
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

const disciplinaProfessor = (req, res) => {
    const query = "INSERT INTO disciplina_professores (cpf_professor, id_disciplina) VALUES ($1,$2)"
    const values = [req.body.cpf, req.body.disciplina]
    database.query(query, values)
}