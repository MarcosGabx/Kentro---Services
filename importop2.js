const xlsx = require('xlsx');
const axios = require('axios');

// Configurações da API 
const apiKey = '5efc7050fed94ece99c0a717664f998c'; // ← Defina sua API key
const apiUrl = 'https://aquilamarketing.atenderbem.com/int/createOpportunity'; // ← Defina a URL da API

// Função para ler o arquivo Excel
function readExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
}

// Função para importar oportunidades
async function importOpportunities(filePath) {
    const data = readExcel(filePath);

    for (let i = 0; i < data.length; i++) {
        const opportunity = {
            queueId: 10,
            apiKey,
            fkPipeline: 5,
            fkStage: 37,
            title: data[i].title,
            responsableid: data[i].responsableid,
            description: data[i].description,
            origin: data[i].origin,
            mainphone: data[i].mainphone,
            value: data[i].value,
            mainmail: data[i].mainmail
        };

        try {
            const response = await axios.post(apiUrl, opportunity);
            console.log(`✅ Oportunidade "${data[i].title}" importada com sucesso!`, response.data);
        } catch (error) {
            console.error(`❌ Erro ao importar a oportunidade "${data[i].title}":`);
            if (error.response) {
                console.error(`   - Código HTTP: ${error.response.status}`);
                console.error(`   - Resposta da API:`, error.response.data);
            } else {
                console.error(`   - Erro de requisição: ${error.message}`);
            }
        }
    }
}

// Defina o caminho do arquivo Excel (substitua pelo seu caminho)
const filePath = './importdados2.xlsx'; // Exemplo: caminho relativo

// Chama a função para importar as oportunidades
importOpportunities(filePath).catch(err => console.error("Erro no processo:", err));