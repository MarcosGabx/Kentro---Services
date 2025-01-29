const axios = require("axios").default;
const xlsx = require("xlsx");
const filePath = "./planilhaopkentro.xlsx"; // Caminho para o arquivo .xlsx

// Função para ler os dados da planilha
function readExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Obtém o nome da primeira aba
    const sheet = workbook.Sheets[sheetName]; // Obtém os dados dessa aba
    return xlsx.utils.sheet_to_json(sheet); // Converte a aba em um array de objetos
}

// Configuração da requisição com os parâmetros
async function importOpportunities(filePath) {
    const data = readExcel(filePath); // Lê os dados da planilha

    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);

        // Envia a requisição para a API
        try {
            const response = await axios.post(
                "https://kentrosistemas.atenderbem.com/int/createOpportunity",
                {
                    queueId: 357, // ID fixo ou personalizado
                    apiKey: "23ebcf36cf9d47f593aa7f9ea7d01ac5", // Substitua pela sua chave de API real
                    fkPipeline: 100,
                    fkStage: 437,
                    title: data[i].title, // Campo "title" da planilha
                    mainphone: data[i].mainphone.toString(), // Campo "mainphone" da planilha
                    responsableid: data[i].responsableid,
                    description: data[i].description,
                    mainmail: data[i].mainmail
                }
            );

            console.log(`Oportunidade "${data[i].title}" importada com sucesso:`, response.data);
        } catch (error) {
            console.error(`Erro ao importar a oportunidade "${data[i].title}":`, error);
        }
    }
}

console.log("Dados lidos da planilha:", readExcel(filePath));
// Chama a função para importar as oportunidades
importOpportunities(filePath);
