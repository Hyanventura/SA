import xlsx from "xlsx"

const filePath = 'c:/users/hyan_ventura/desktop/salas.csv'

const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

exports.insertData = async (req, res) => {
try{
    for (const row of data){
        const query = "INSERT INTO salas (nome) VALUES ($1)";
        const values = [row.nome]

        // await database.query(query, values)
    }
    res.status(201).send ({mensagem:'Dados inseridos com Sucesso!'})
}catch (error){
    console.error('Erro ao inserir dados : ', error);
}

}