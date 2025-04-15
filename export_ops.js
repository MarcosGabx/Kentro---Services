const axios = require('axios');
const ExcelJS = require('exceljs');

const API_URL = 'https://dermalaser.atenderbem.com/int/getPipeOpportunities';
const apiKey = '123456';
const queueId = 10;
const pipelineId = 1;
const stageId = 7;
const OUTPUT_FILE = 'Oportunidades_Completas.xlsx';

async function exportarOportunidades() {
    try {
        console.log("⏳ Buscando oportunidades na API...");
        
        const response = await axios.post(API_URL, {
            queueId,
            apiKey,
            pipelineId,
            stageId
        });

        console.log(`✅ ${response.data.length} oportunidades encontradas`);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Oportunidades');
        
        // Configurar todas as colunas solicitadas
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'ID Cliente', key: 'clientid', width: 12 },
            { header: 'Título', key: 'title', width: 30 },
            { header: 'Valor', key: 'value', width: 15, style: { numFmt: 'R$#,##0.00' } },
            { header: 'Valor Recorrente', key: 'recurrentvalue', width: 18, style: { numFmt: 'R$#,##0.00' } },
            { header: 'Valor Fechamento', key: 'closevalue', width: 18, style: { numFmt: 'R$#,##0.00' } },
            { header: 'Valor Rec. Fechamento', key: 'closerecurrentvalue', width: 20, style: { numFmt: 'R$#,##0.00' } },
            { header: 'Ordem', key: 'order', width: 8 },
            { header: 'Origem', key: 'origin', width: 10 },
            { header: 'Estagnada', key: 'stagnated', width: 10 },
            { header: 'Localização', key: 'formattedlocation', width: 25 },
            { header: 'Cidade', key: 'city', width: 20 },
            { header: 'Estado', key: 'state', width: 10 },
            { header: 'País', key: 'country', width: 15 },
            { header: 'Cód. País', key: 'countrycode', width: 10 },
            { header: 'CEP', key: 'postalcode', width: 10 },
            { header: 'Tipo Local', key: 'locationtype', width: 15 },
            { header: 'Latitude', key: 'lat', width: 12 },
            { header: 'Longitude', key: 'lon', width: 12 },
            { header: 'Endereço 1', key: 'address1', width: 30 },
            { header: 'Endereço 2', key: 'address2', width: 30 },
            { header: 'Probabilidade', key: 'probability', width: 14 },
            { header: 'Descrição', key: 'description', width: 40 },
            { header: 'ID Pipeline', key: 'fkPipeline', width: 12 },
            { header: 'ID Estágio', key: 'fkStage', width: 12 },
            { header: 'Telefone', key: 'mainphone', width: 15 },
            { header: 'E-mail', key: 'mainmail', width: 25 },
            { header: 'Previsão Fechamento', key: 'expectedclosedate', width: 20 },
            { header: 'Status', key: 'status', width: 10 },
            { header: 'Tempo no Estágio', key: 'stagebegintime', width: 16 },
            { header: 'ID Responsável', key: 'responsableid', width: 14 },
            { header: 'Seguidores', key: 'followers', width: 15 },
            { header: 'Criado por', key: 'createdby', width: 12 },
            { header: 'Fechado por', key: 'closedby', width: 12 },
            { header: 'Data Fechamento', key: 'closedat', width: 18 },
            { header: 'Dados Formulários', key: 'formsdata', width: 25 },
            { header: 'Qtde Arquivos', key: 'filesCount', width: 12 },
            { header: 'Qtde Contatos', key: 'contactsCount', width: 12 },
            { header: 'Qtde Tarefas', key: 'tasksCount', width: 12 },
            { header: 'Arquivos', key: 'files', width: 15 },
            { header: 'Contatos', key: 'contacts', width: 15 },
            { header: 'Tags', key: 'tags', width: 15 },
            { header: 'Data Criação', key: 'createdAt', width: 18 }
        ];

        // Preencher dados
        response.data.forEach(oportunidade => {
            const rowData = {
                id: oportunidade.id,
                clientid: oportunidade.clientid || '',
                title: oportunidade.title || '',
                value: oportunidade.value || 0,
                recurrentvalue: oportunidade.recurrentvalue || 0,
                closevalue: oportunidade.closevalue || 0,
                closerecurrentvalue: oportunidade.closerecurrentvalue || 0,
                order: oportunidade.order || 0,
                origin: oportunidade.origin || '',
                stagnated: oportunidade.stagnated ? 'Sim' : 'Não',
                formattedlocation: oportunidade.formattedlocation || '',
                city: oportunidade.city || '',
                state: oportunidade.state || '',
                country: oportunidade.country || '',
                countrycode: oportunidade.countrycode || '',
                postalcode: oportunidade.postalcode || '',
                locationtype: oportunidade.locationtype || '',
                lat: oportunidade.lat || '',
                lon: oportunidade.lon || '',
                address1: oportunidade.address1 || '',
                address2: oportunidade.address2 || '',
                probability: oportunidade.probability || 0,
                description: oportunidade.description || '',
                fkPipeline: oportunidade.fkPipeline || '',
                fkStage: oportunidade.fkStage || '',
                mainphone: oportunidade.mainphone || '',
                mainmail: oportunidade.mainmail || '',
                expectedclosedate: formatDate(oportunidade.expectedclosedate),
                status: oportunidade.status || '',
                stagebegintime: oportunidade.stagebegintime || '',
                responsableid: oportunidade.responsableid || '',
                followers: arrayToString(oportunidade.followers),
                createdby: oportunidade.createdby || '',
                closedby: oportunidade.closedby || '',
                closedat: formatDate(oportunidade.closedat),
                formsdata: JSON.stringify(oportunidade.formsdata || {}),
                filesCount: oportunidade.filesCount || 0,
                contactsCount: oportunidade.contactsCount || 0,
                tasksCount: oportunidade.tasksCount || 0,
                files: arrayToString(oportunidade.files),
                contacts: arrayToString(oportunidade.contacts),
                tags: arrayToString(oportunidade.tags),
                createdAt: formatDate(oportunidade.createdAt)
            };
            
            worksheet.addRow(rowData);
        });

        // Ajustar formatação
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Pular cabeçalho
                // Formatar probabilidade como porcentagem
                const probCell = row.getCell('probability');
                probCell.value = probCell.value / 100;
                probCell.style.numFmt = '0.00%';
            }
        });

        await workbook.xlsx.writeFile(OUTPUT_FILE);
        console.log(`📊 Planilha exportada: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ Erro:', error.message);
        console.error('Detalhes:', error.response?.data || 'Sem detalhes adicionais');
    }
}

// Funções auxiliares
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    } catch {
        return dateString;
    }
}

function arrayToString(arr) {
    return Array.isArray(arr) ? arr.join(', ') : '';
}

// Executar
(async () => {
    await exportarOportunidades();
})();