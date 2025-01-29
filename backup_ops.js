const axios = require("axios");
const xlsx = require("xlsx");
const data = lerExcel(filePath);
const fs = require("fs");

//Parâmetros necessários para a API
const params = {
    queueId: 46,
    apiKey: "123",
    pipelineId: 32
}

//Configuração do EndPoint da API
const endPoint = "https://kentro.atenderbem.com/int/getPipeOpportunities";

//Importando dados para a planilha do Excel
function importdados_excel(dados, filePath) {
    const worksheet = xlsx.utils.json_to_sheet(dados); // Converte os dados para uma planilha
    const workbook = xlsx.utils.book_new(); // Cria um novo arquivo Excel
    xlsx.utils.book_append_sheet(workbook, worksheet, "Dados"); // Adiciona a planilha
    xlsx.writeFile(workbook, filePath); // Salva o arquivo Excel
    console.log(`Dados salvos em: ${filePath}`);
  }

//Subindo os dados para a planilha
    const workbook = xlsx.utils.book_new();    
    xlsx.utils.book_append_sheet(workbook, worksheet, "Dados");

//Salvando o arquivo excel no caminho informado
xlsx.writeFile(workbook, filePath);
console.log('Dados salvos em: ${filePath}');
}

//Fazendo requisição para receber os dados do Kentro - API
axios
.get(endPoint, {params})
    .then((response) => {
        console.log("Dados Recebidos:", response.data);
    if (Array.isArray(response.data) && response.data.length > 0) {
        //Salvando os dados na planilha
        const outputFilePath = "dadosimportados.xlsx"; //caminho da planilha Excel
        salvarParaExcel(response.data, outputFilePath);
    } else {
        console.log("Nenhum dado recebido ou o retorno está vazio.");

    }    
})
    .catch(error => {
        console.log("Erro na Requisição", error);
    });


