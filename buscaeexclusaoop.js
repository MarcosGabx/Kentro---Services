const axios = require('axios');

const API_URL = 'https://kentrosistemas.atenderbem.com/int/getPipeOpportunities';
const API_URL2 = 'https://kentrosistemas.atenderbem.com/int/removeOpportunity';

const apiKey = '23ebcf36cf9d47f593aa7f9ea7d01ac5'; // Substitua com a chave correta
const queueId = 357;
const pipelineId = 100;
const stageId = 437;

async function buscarOportunidades() {
    try {
        // Requisição para obter as oportunidades
        const response = await axios.post(API_URL, {
            "queueId": queueId,
            "apiKey": apiKey,
            "pipelineId": pipelineId
        });

        // Verificando se a resposta contém dados
        if (Array.isArray(response.data)) {
            // Iterando sobre as oportunidades
            console.log("Oportunidades encontradas:");
            for (let i = 0; i < response.data.length; i++) {
                const oportunidade = response.data[i];
                if (oportunidade.id > 0) { // Verifica se o ID é maior que 0
                    console.log(`Oportunidade ${i + 1}: ${JSON.stringify(oportunidade)}`);
                    // Aqui você pode adicionar o código para excluir a oportunidade
                    await excluirOportunidades(oportunidade.id);
                } else {
                    console.log(`Oportunidade ${i + 1} não possui ID válido.`);
                }
            }
        } else {
            console.log("A resposta da API não é um array de oportunidades.");
        }

    } catch (error) {
        console.error('Erro ao buscar oportunidades:', error.response ? error.response.data : error.message);
    }
}

// Função para excluir uma oportunidade pelo ID
async function excluirOportunidades(opportunityId) {
    try {
        const response = await axios.post(API_URL2, {
            "queueId": queueId,
            "apiKey": apiKey,
            "id": opportunityId
        });

        // Verificando se a resposta da exclusão é bem-sucedida
        if (response.data && response.data.status === 'success') {
            console.log(`Oportunidade ${opportunityId} excluída com sucesso.`);
        } else {
            console.log(`Erro ao excluir oportunidade ${opportunityId}:`, response.data || 'Resposta inesperada');
        }

    } catch (error) {
        console.error('Erro ao excluir oportunidade:', error.response ? error.response.data : error.message);
    }
}

// Chamar a função para buscar oportunidades
buscarOportunidades();
