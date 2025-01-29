const axios = require('axios');

// Função para buscar as oportunidades
async function fetchOpportunities() {
    const endPoint = "https://kentrosistemas.atenderbem.com/int/getPipeOpportunities";

    const params = {
        queueId: "357", 
        apiKey: "23ebcf36cf9d47f593aa7f9ea7d01ac5",
        stageId: "437",
        pipelineId: "100"
    };

    try {
        console.log("Enviando requisição para buscar oportunidades...");
        const response = await axios.get(endPoint, {
            params,
            timeout: 10000 // Timeout de 10 segundos para evitar travamento
        });

        console.log("Resposta da API:", response.data);

        // Verificar se a resposta contém o array 'opportunities'
        if (!response.data || !Array.isArray(response.data.opportunities)) {
            console.error("Formato inesperado da resposta:", response.data);
            return [];
        }

        return response.data.opportunities.filter(opportunity => opportunity.id > 0);
    } catch (error) {
        console.error("Erro ao buscar oportunidades:", error.message);
        return [];
    }
}

// Função para deletar uma oportunidade
async function deleteOpportunity(opportunityId) {
    const endPointdelop = `https://kentrosistemas.atenderbem.com/int/removeOpportunity/${opportunityId}`;

    const params = {
        apiKey: "23ebcf36cf9d47f593aa7f9ea7d01ac5"
    };

    try {
        console.log(`Deletando oportunidade ID: ${opportunityId}...`);
        await axios.delete(endPointdelop, { params, timeout: 10000 });
        console.log(`Oportunidade ${opportunityId} deletada com sucesso.`);
    } catch (error) {
        console.error(`Erro ao deletar oportunidade ${opportunityId}:`, error.message);
    }
}

// Função principal para buscar e deletar oportunidades
async function verifOps() {
    console.log("Iniciando verificação de oportunidades...");

    const opportunities = await fetchOpportunities();

    if (opportunities.length > 0) {
        console.log(`Encontradas ${opportunities.length} oportunidades para deletar.`);

        // Executa todas as deleções em paralelo para evitar travamento
        await Promise.all(opportunities.map(opportunity => deleteOpportunity(opportunity.id)));

        console.log("Processo de deleção concluído.");
    } else {
        console.log("Nenhuma oportunidade com ID maior que 0 encontrada.");
    }
}

// Chamar a função principal
verifOps();
