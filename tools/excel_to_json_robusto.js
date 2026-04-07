/**
 * Conversor robusto de Excel para JSON - Tabelas FAPESPA
 * Lida com estruturas não-padronizadas dos arquivos Excel
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const TABELAS_DIR = path.join(BASE_DIR, 'Tabelas 2025');
const OUTPUT_DIR = path.join(BASE_DIR, 'data', 'indicadores', '2025');

const CATEGORIAS = {
    '1. Demografia': 'demografia',
    '2. Economia': 'economia',
    '3. Infraestrutura': 'infraestrutura',
    '4. Meio Ambiente': 'meio-ambiente',
    '5. Social': 'social'
};

// Nomes de municípios para validação
const MUNICIPIOS_CONHECIDOS = new Set([
    'Abaetetuba', 'Abel Figueiredo', 'Acará', 'Afuá', 'Água Azul do Norte',
    'Alenquer', 'Almeirim', 'Altamira', 'Anajás', 'Ananindeua', 'Anapu',
    'Augusto Corrêa', 'Aurora do Pará', 'Aveiro', 'Bagre', 'Baião', 'Bannach',
    'Barcarena', 'Belém', 'Belterra', 'Benevides', 'Bom Jesus do Tocantins',
    'Bonito', 'Bragança', 'Brasil Novo', 'Brejo Grande do Araguaia', 'Breu Branco',
    'Breves', 'Bujaru', 'Cachoeira do Arari', 'Cachoeira do Piriá', 'Cametá',
    'Canaã dos Carajás', 'Capanema', 'Capitão Poço', 'Castanhal', 'Chaves',
    'Colares', 'Conceição do Araguaia', 'Concórdia do Pará', 'Cumaru do Norte',
    'Curionópolis', 'Curralinho', 'Curuá', 'Curuçá', 'Dom Eliseu', 'Eldorado dos Carajás',
    'Faro', 'Floresta do Araguaia', 'Garrafão do Norte', 'Goianésia do Pará',
    'Gurupá', 'Igarapé-Açu', 'Igarapé-Miri', 'Inhangapi', 'Ipixuna do Pará',
    'Irituia', 'Itaituba', 'Itupiranga', 'Jacareacanga', 'Jacundá', 'Juruti',
    'Limoeiro do Ajuru', 'Mãe do Rio', 'Magalhães Barata', 'Marabá', 'Maracanã',
    'Marapanim', 'Marituba', 'Medicilândia', 'Melgaço', 'Mocajuba', 'Moju',
    'Mojuí dos Campos', 'Monte Alegre', 'Muaná', 'Nova Esperança do Piriá',
    'Nova Ipixuna', 'Nova Timboteua', 'Novo Progresso', 'Novo Repartimento',
    'Óbidos', 'Oeiras do Pará', 'Oriximiná', 'Ourém', 'Ourilândia do Norte',
    'Pacajá', 'Palestina do Pará', 'Paragominas', 'Parauapebas', 'Pau D\'Arco',
    'Peixe-Boi', 'Piçarra', 'Placas', 'Ponta de Pedras', 'Portel', 'Porto de Moz',
    'Prainha', 'Primavera', 'Quatipuru', 'Redenção', 'Rio Maria', 'Rondon do Pará',
    'Rurópolis', 'Salinópolis', 'Salvaterra', 'Santa Bárbara do Pará',
    'Santa Cruz do Arari', 'Santa Isabel do Pará', 'Santa Luzia do Pará',
    'Santa Maria das Barreiras', 'Santa Maria do Pará', 'Santana do Araguaia',
    'Santarém', 'Santarém Novo', 'Santo Antônio do Tauá', 'São Caetano de Odivelas',
    'São Domingos do Araguaia', 'São Domingos do Capim', 'São Félix do Xingu',
    'São Francisco do Pará', 'São Geraldo do Araguaia', 'São João da Ponta',
    'São João de Pirabas', 'São João do Araguaia', 'São Miguel do Guamá',
    'São Sebastião da Boa Vista', 'Sapucaia', 'Senador José Porfírio', 'Soure',
    'Tailândia', 'Terra Alta', 'Terra Santa', 'Tomé-Açu', 'Tracuateua', 'Trairão',
    'Tucumã', 'Tucuruí', 'Ulianópolis', 'Uruará', 'Vigia', 'Viseu', 'Vitória do Xingu',
    'Xinguara'
]);

function processarPlanilha(caminhoExcel, categoria) {
    try {
        const workbook = XLSX.readFile(caminhoExcel);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Lê como array

        if (!data || data.length < 3) return {};

        // Encontra linha com headers (procura por "2021", "2022", etc ou "2023", "2024")
        let headerRowIdx = -1;
        let dataStartIdx = -1;

        for (let i = 0; i < Math.min(10, data.length); i++) {
            const row = data[i];
            if (!row) continue;
            
            // Procura por anos ou valores numéricos em múltiplas colunas
            const temNumeros = row.filter(cell => {
                if (!cell) return false;
                const val = String(cell).trim();
                return /^\d{4}$/.test(val) || /^\d+[\.\,]\d+$/.test(val);
            }).length >= 3;

            if (temNumeros) {
                headerRowIdx = i;
                dataStartIdx = i + 1;
                break;
            }
        }

        if (headerRowIdx === -1) return {};

        // Extrai nome da coluna de municípios (geralmente primeira coluna)
        const headerRow = data[headerRowIdx];
        const colMunicipioIdx = 0; // Sempre primeira coluna

        // Encontra coluna de valor (última coluna com número ou segunda se houver múltiplas)
        let colValorIdx = -1;
        for (let i = headerRow.length - 1; i >= 1; i--) {
            const cell = headerRow[i];
            if (cell && String(cell).trim()) {
                colValorIdx = i;
                break;
            }
        }

        if (colValorIdx === -1) colValorIdx = headerRow.length - 1;

        // Extrai dados
        const dados = {};
        let municipiosProcessados = 0;

        for (let i = dataStartIdx; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length < 2) continue;

            const nomeMunicipio = String(row[colMunicipioIdx] || '').trim();
            
            // Valida se é um município conhecido
            if (!nomeMunicipio || !MUNICIPIOS_CONHECIDOS.has(nomeMunicipio)) {
                continue;
            }

            const valor = row[colValorIdx];
            
            if (valor !== undefined && valor !== null && valor !== '') {
                let numVal = null;

                if (typeof valor === 'number') {
                    numVal = valor;
                } else if (typeof valor === 'string') {
                    // Tenta limpar e converter
                    const cleaned = String(valor)
                        .replace(/\./g, '')      // Remove milhares
                        .replace(',', '.')       // Converte vírgula em ponto
                        .trim();
                    numVal = parseFloat(cleaned);
                }

                if (!isNaN(numVal) && numVal !== null) {
                    dados[nomeMunicipio] = numVal;
                    municipiosProcessados++;
                }
            }
        }

        return dados;

    } catch (error) {
        console.error(`Erro ao processar ${path.basename(caminhoExcel)}:`, error.message);
        return {};
    }
}

// Função recursiva para processar arquivos
function processarPastaRecursiva(pastaPath, slugCategoria, totalProcessados, arquivosGerados) {
    const itens = fs.readdirSync(pastaPath, { withFileTypes: true });
    
    for (const item of itens) {
        const caminhoCompleto = path.join(pastaPath, item.name);
        
        if (item.isDirectory()) {
            // Processar subpasta recursivamente
            processarPastaRecursiva(caminhoCompleto, slugCategoria, totalProcessados, arquivosGerados);
        } else if (item.name.endsWith('.xlsx') && !item.name.startsWith('~$')) {
            // Processar arquivo Excel
            process.stdout.write(`   ${item.name}... `);
            
            const dados = processarPlanilha(caminhoCompleto, slugCategoria);

            if (Object.keys(dados).length > 0) {
                const jsonFilename = item.name.replace('.xlsx', '.json');
                const jsonPath = path.join(OUTPUT_DIR, jsonFilename);

                const output = {
                    metadata: {
                        source: item.name,
                        categoria: slugCategoria,
                        municipios: Object.keys(dados).length,
                        data_processamento: new Date().toISOString()
                    },
                    data: dados
                };

                fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf-8');
                console.log(`✅ ${Object.keys(dados).length} municípios`);
                
                arquivosGerados.push({
                    arquivo: jsonFilename,
                    categoria: slugCategoria,
                    municipios: Object.keys(dados).length
                });
                
                totalProcessados.count++;
            } else {
                console.log('⚠️  Sem dados válidos');
            }
        }
    }
}

function main() {
    console.log('='.repeat(80));
    console.log('CONVERSOR EXCEL → JSON (VERSÃO ROBUSTA)');
    console.log('='.repeat(80));

    // Cria diretório de saída
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    let totalProcessados = { count: 0 };
    const arquivosGerados = [];

    // Processa cada categoria
    for (const [pastaCategoria, slugCategoria] of Object.entries(CATEGORIAS)) {
        const pastaPath = path.join(TABELAS_DIR, pastaCategoria);
        if (!fs.existsSync(pastaPath)) continue;

        console.log(`\n📁 Categoria: ${pastaCategoria}`);
        console.log('-'.repeat(80));

        processarPastaRecursiva(pastaPath, slugCategoria, totalProcessados, arquivosGerados);
        processarPastaRecursiva(pastaPath, slugCategoria, totalProcessados, arquivosGerados);
    }

    // Gera catálogo
    console.log('\n' + '='.repeat(80));
    console.log('📋 Atualizando catálogo...');
    
    const catalogoPath = path.join(BASE_DIR, 'data', 'catalogo_2025.json');
    let catalogo = {};
    
    if (fs.existsSync(catalogoPath)) {
        const content = fs.readFileSync(catalogoPath, 'utf-8');
        catalogo = JSON.parse(content);
    }

    // Adiciona novos indicadores ao catálogo
    for (const info of arquivosGerados) {
        const categoria = info.categoria;
        if (!catalogo[categoria]) {
            catalogo[categoria] = [];
        }

        // Procura indicador existente para atualizar
        const nomeBase = info.arquivo.replace('.json', '');
        const idx = catalogo[categoria].findIndex(ind => 
            ind.path && ind.path.includes(info.arquivo)
        );

        if (idx === -1) {
            // Adiciona novo
            const label = nomeBase
                .replace(/^Tab \d+\.?\d*\s+/, '') // Remove "Tab 1.1"
                .replace(/_/g, ' ')
                .replace(/\(.*?\)/g, match => {
                    // Mantém parênteses
                    return match.replace(/_/g, ' ');
                });

            catalogo[categoria].push({
                slug: nomeBase.toLowerCase().replace(/\s+/g, '-'),
                label: label,
                unit: '',
                year: 2025,
                path: `data/indicadores/2025/${info.arquivo}`
            });
        }
    }

    fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2), 'utf-8');
    console.log(`✅ Catálogo atualizado com ${Object.values(catalogo).reduce((a, b) => a + b.length, 0)} indicadores`);

    // Resumo
    console.log('\n' + '='.repeat(80));
    console.log('RESUMO');
    console.log('='.repeat(80));
    console.log(`✅ Arquivos processados com sucesso: ${totalProcessados.count}`);
    console.log(`📊 JSONs salvos em: ${OUTPUT_DIR}`);
    console.log('');
    
    if (arquivosGerados.length > 0) {
        console.log('Arquivos gerados:');
        arquivosGerados.forEach(info => {
            console.log(`  • ${info.arquivo} (${info.municipios} municípios)`);
        });
    }

    console.log('\n' + '='.repeat(80));
}

main();
