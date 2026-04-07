const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(BASE_DIR, 'data');
const TABELAS_DIR = path.join(BASE_DIR, 'Tabelas 2025');

// Configuração dos indicadores por categoria
const INDICADORES = {
    'economia': [
        {
            arquivo: '2.4 PIB/Tab 2.4.1 Produto Interno Bruto a Preços Correntes (Mil Reais) - 2017 a 2021.xlsx',
            nome: 'PIB Total 2021',
            slug: 'pib_total_2021',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2021',
            unidade: 'R$ mil',
            skipRows: 4
        },
        {
            arquivo: '2.4 PIB/Tab 2.4.8 Evolução do Produto Interno Bruto per Capita dos Municípios Paraenses - 2017 a 2021.xlsx',
            nome: 'PIB Per Capita 2021',
            slug: 'pib_per_capita_2021',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2021',
            unidade: 'R$',
            skipRows: 4
        }
    ],
    'infraestrutura': [
        {
            arquivo: 'Tab 3.1 Total da Frota de Veículos Subdivididos em Licenciados e Não Licenciados - 2020 a 2024.xlsx',
            nome: 'Frota de Veículos 2024',
            slug: 'frota_veiculos_2024',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2024',
            unidade: 'veículos',
            skipRows: 4
        },
        {
            arquivo: 'Tab 3.2 Consumidores de Energia Elétrica Total - 2019 a 2023.xlsx',
            nome: 'Consumidores de Energia 2023',
            slug: 'consumidores_energia_2023',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2023',
            unidade: 'consumidores',
            skipRows: 4
        }
    ],
    'meio-ambiente': [
        {
            arquivo: 'Tab 4.1 Desflorestamento Acumulado (km²) - 2020 a 2024 (ATUALIZADA).xlsx',
            nome: 'Desflorestamento Acumulado 2024',
            slug: 'desflorestamento_2024',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2024',
            unidade: 'km²',
            skipRows: 4
        },
        {
            arquivo: 'Tab 4.4 Focos de Calor - 2020 a 2024(ATUALIZADA).xlsx',
            nome: 'Focos de Calor 2024',
            slug: 'focos_calor_2024',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2024',
            unidade: 'focos',
            skipRows: 4
        }
    ],
    'social': [
        {
            arquivo: '5.5 SAÚDE     OK/Tab 5.5.1 Taxa de Mortalidade Infantil - 2020 a 2024.xlsx',
            nome: 'Taxa de Mortalidade Infantil 2024',
            slug: 'mortalidade_infantil_2024',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2024',
            unidade: 'por mil nascidos vivos',
            skipRows: 4
        },
        {
            arquivo: '5.5 SAÚDE     OK/Tab 5.5.7 Número de Hospitais - 2021 a 2025.xlsx',
            nome: 'Número de Hospitais 2025',
            slug: 'hospitais_2025',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2025',
            unidade: 'hospitais',
            skipRows: 4
        },
        {
            arquivo: '5.5 SAÚDE     OK/Tab 5.5.9 Médicos por 10 Mil Habitantes - 2021 a 2025.xlsx',
            nome: 'Médicos por 10 Mil Habitantes 2025',
            slug: 'medicos_10mil_2025',
            colunaMunicipio: 'Estado/Município',
            colunaValor: '2025',
            unidade: 'por 10 mil hab',
            skipRows: 4
        }
    ]
};

console.log('🔄 Processando indicadores de múltiplas categorias...\n');

// Criar estrutura de catálogo
const catalogo = {
    demografia: [
        {
            label: 'População Estimada 2025',
            slug: 'populacao_2025',
            path: 'data/populacao_2025.json',
            unit: 'habitantes',
            year: '2025'
        }
    ],
    economia: [],
    infraestrutura: [],
    'meio-ambiente': [],
    social: []
};

// Processar cada categoria
for (const [categoria, indicadores] of Object.entries(INDICADORES)) {
    console.log(`\n📊 Categoria: ${categoria.toUpperCase()}`);
    
    for (const config of indicadores) {
        try {
            const excelPath = path.join(TABELAS_DIR, 
                categoria === 'economia' ? '2. Economia' :
                categoria === 'infraestrutura' ? '3. Infraestrutura' :
                categoria === 'meio-ambiente' ? '4. Meio Ambiente' : '5. Social',
                config.arquivo
            );
            
            console.log(`  Processando: ${config.nome}`);
            console.log(`  Arquivo: ${excelPath}`);
            
            if (!fs.existsSync(excelPath)) {
                console.log(`  ⚠️ Arquivo não encontrado, pulando...`);
                continue;
            }
            
            // Ler Excel
            const workbook = XLSX.readFile(excelPath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { range: config.skipRows || 4 });
            
            if (data.length === 0) {
                console.log(`  ⚠️ Nenhum dado encontrado`);
                continue;
            }
            
            // Identificar colunas
            let municipioCol = config.colunaMunicipio;
            let valorCol = config.colunaValor;
            
            const firstRow = data[0];
            const keys = Object.keys(firstRow);
            
            // Tentar encontrar colunas se não especificadas
            if (!municipioCol) {
                municipioCol = keys.find(k => 
                    k.toLowerCase().includes('município') || 
                    k.toLowerCase().includes('municipio') ||
                    k === 'Estado/Município'
                ) || keys[0];
            }
            
            if (!valorCol) {
                valorCol = keys[keys.length - 1]; // Última coluna geralmente é o ano mais recente
            }
            
            console.log(`  Coluna município: ${municipioCol}`);
            console.log(`  Coluna valor: ${valorCol}`);
            
            // Extrair dados
            const dados = {};
            let count = 0;
            
            data.forEach(row => {
                const municipio = String(row[municipioCol] || '').trim();
                let valor = row[valorCol];
                
                // Tentar converter para número
                if (typeof valor === 'string') {
                    valor = parseFloat(valor.replace(/[^\d.,]/g, '').replace(',', '.'));
                }
                
                valor = parseFloat(valor);
                
                if (municipio && municipio !== 'Pará' && !isNaN(valor)) {
                    dados[municipio] = valor;
                    count++;
                }
            });
            
            console.log(`  ✓ ${count} municípios processados`);
            
            // Salvar JSON
            const outputPath = path.join(DATA_DIR, `${config.slug}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(dados, null, 2), 'utf8');
            console.log(`  ✓ Salvo em: ${outputPath}`);
            
            // Adicionar ao catálogo
            catalogo[categoria].push({
                label: config.nome,
                slug: config.slug,
                path: `data/${config.slug}.json`,
                unit: config.unidade || '',
                year: config.colunaValor || ''
            });
            
        } catch (error) {
            console.error(`  ❌ Erro: ${error.message}`);
        }
    }
}

// Salvar catálogo atualizado
const catalogoPath = path.join(DATA_DIR, 'catalogo_categorias.json');
fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2), 'utf8');
console.log(`\n✅ Catálogo salvo em: ${catalogoPath}`);
console.log(`\n📋 Resumo:`);
console.log(`  Demografia: ${catalogo.demografia.length} indicadores`);
console.log(`  Economia: ${catalogo.economia.length} indicadores`);
console.log(`  Infraestrutura: ${catalogo.infraestrutura.length} indicadores`);
console.log(`  Meio Ambiente: ${catalogo['meio-ambiente'].length} indicadores`);
console.log(`  Social: ${catalogo.social.length} indicadores`);
console.log('\n✅ Processamento concluído!');
