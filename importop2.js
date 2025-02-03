const axios = require("axios").default;
const xlsx = require("xlsx");
const fs = require("fs");

const filePath = "./importdados.xlsx"; // Caminho do arquivo

// Verifica se o arquivo existe
if (!fs.existsSync(filePath)) {
    console.error("Erro: O arquivo não foi encontrado! Verifique o caminho:", filePath);
    process.exit(1);
}

// Função para ler os dados da planilha
function readExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Obtém o nome da primeira aba
    const sheet = workbook.Sheets[sheetName]; // Obtém os dados dessa aba
    return xlsx.utils.sheet_to_json(sheet); // Converte a aba em um array de objetos
}

// Função para obter as oportunidades já cadastradas no CRM
async function getExistingOpportunities() {
    try {
        const response = await axios.get("https://kentrosistemas.atenderbem.com/int/getOpportunity", {
            params: { apiKey: "23ebcf36cf9d47f593aa7f9ea7d01ac5" }
        });

        // Criando dois Sets para armazenar titles e descriptions existentes
        const existingTitles = new Set();
        const existingDescriptions = new Set();

        response.data.forEach(op => {
            if (op.title) {
                existingTitles.add(op.title.trim().toLowerCase());
            }
            if (op.description) {
                existingDescriptions.add(op.description.trim().toLowerCase());
            }
        });

        return { existingTitles, existingDescriptions };
    } catch (error) {
        console.error("Erro ao obter oportunidades existentes:", error);
        return { existingTitles: new Set(), existingDescriptions: new Set() }; // Retorna Sets vazios em caso de erro
    }
}

// Função para importar oportunidades sem duplicação
async function importOpportunities(filePath) {
    const data = readExcel(filePath); // Lê os dados da planilha
    const { existingTitles, existingDescriptions } = await getExistingOpportunities(); // Obtém os títulos e descrições já cadastradas

    for (let i = 0; i < data.length; i++) {
        const title = data[i].title?.trim().toLowerCase();
        const description = data[i].description?.trim().toLowerCase();

        // Se o title ou a description já existirem, ignora a importação
        if (existingTitles.has(title) || existingDescriptions.has(description)) {
            console.log(`Oportunidade ignorada (Título ou Descrição já cadastrados): ${title}`);
            continue;
        }

        // Envia a requisição para a API
        try {
            const response = await axios.post(
                "https://kentrosistemas.atenderbem.com/int/createOpportunity",
                {
                    queueId: 357, 
                    apiKey: "23ebcf36cf9d47f593aa7f9ea7d01ac5", 
                    fkPipeline: 101,
                    fkStage: 438,
                    title: data[i].title, 
                    mainphone: data[i].mainphone.toString(), 
                    responsableid: data[i].responsableid,
                    description: data[i].description,
                    mainmail: data[i].mainmail
                }
            );

            console.log(`Oportunidade "${data[i].title}" importada com sucesso:`, response.data);

            // Após a criação, adicionamos os novos títulos e descrições ao Set para evitar duplicações futuras
            existingTitles.add(title);
            existingDescriptions.add(description);
        } catch (error) {
            console.error(`Erro ao importar a oportunidade "${data[i].title}":`, error);
        }
    }
}

// Chama a função para importar as oportunidades
importOpportunities(filePath);
