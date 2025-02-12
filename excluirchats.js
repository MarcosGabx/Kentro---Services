const axios = require("axios");
const xlsx = require("xlsx");
const filePath = "./dadospexcluir.xlsx"; // Caminho do arquivo de exclusão

// Configurações da API
const API_URL = "https://flowermed.atenderbem.com/int/endChat";
const API_KEY = "1234554321"; // Substitua pela API Key correta
const QUEUE_ID = 10; // ID da fila fixa conforme informado

// Função para ler os dados da planilha
function readExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet); // Converte a coluna em um array de objetos
}

// Função para encerrar um chat
async function endChat(chatId) {
    try {
        const response = await axios.post(API_URL, {
            queueId: QUEUE_ID,
            apiKey: API_KEY,
            chatId: chatId,
            reason: "Automação Encerramento"
        });
        console.log(`Chat ${chatId} encerrado com sucesso:`, response.data);
    } catch (error) {
        console.error(`Erro ao encerrar o chat ${chatId}:`, error.response ? error.response.data : error.message);
    }
}

// Função principal
async function processChats() {
    const data = readExcel(filePath);
    
    if (!data.length) {
        console.log("Nenhum chat encontrado na planilha.");
        return;
    }
    
    for (const row of data) {
        if (row.chatId) {
            await endChat(row.chatId);
        } else {
            console.warn("Linha ignorada, sem chatId válido:", row);
        }
    }
    
    console.log("Processamento concluído.");
}

// Executar o script
processChats();
