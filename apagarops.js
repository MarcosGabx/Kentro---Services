const axios = require('axios');

const API_URL = 'https://kentro.atenderbem.com/int/getPipeOpportunities';
const apiKey = '123'; // Substitua com a chave correta
const queueId = 46;
const pipelineId = 2;
const stageId = 6;

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
            for (let i = 0; i < response.data.length; i++) {
                console.log(`Oportunidade ${i + 1}: ${JSON.stringify(response.data[i])}`);
            }
        } else {
            console.log("A resposta da API não é um array de oportunidades.");
        }

    } catch (error) {
        console.error('Erro ao buscar oportunidades:', error.response ? error.response.data : error.message);
    }
}

// Chamar a função para buscar oportunidades
buscarOportunidades();
