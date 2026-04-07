/**
 * Script Node.js para converter planilhas Excel em JSON
 * Alternativa ao script Python para ambientes sem Python configurado
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuração
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

function limparNomeMunicipio(nome) {
    if (!nome) return null;
    nome = String(nome).trim();
    // Remove códigos numéricos
    nome = nome.replace(/^\d+\s+/, '');
    return nome;
}

function extrairAnoDoTitulo(titulo) {
    const anos = titulo.match(/\d{4}/g);
    return anos ? parseInt(anos[anos.length - 1]) : 2025;
}

function processarPlanilha(caminhoExcel, categoria) {
    try {
        const workbook = XLSX.readFile(caminhoExcel);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        
        if (data.length === 0) return {};
        
        // Identifica coluna de município
        const primeiraLinha = data[0];
        const colunas = Object.keys(primeiraLinha);
        let colunaMunicipio = colunas.find(col => 
            col.toLowerCase().includes('municí') || 
            col.toLowerCase().includes('município')
        ) || colunas[0];
        
        // Identifica coluna de valor (última coluna numérica)
        const colunasNumericas = colunas.filter(col => {
            const valor = primeiraLinha[col];
            return typeof valor === 'number' || !isNaN(parseFloat(valor));
        });
        const colunaValor = colunasNumericas[colunasNumericas.length - 1] || colunas[colunas.length - 1];
        
        // Extrai dados
        const dados = {};
        for (const row of data) {
            const municipio = limparNomeMunicipio(row[colunaMunicipio]);
            if (municipio && !['Pará', 'Total', 'TOTAL', 'Estado'].includes(municipio)) {
                let valor = row[colunaValor];
                if (valor !== undefined && valor !== null && valor !== '') {
                    if (typeof valor === 'string') {
                        valor = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                    }
                    if (!isNaN(valor)) {
                        dados[municipio] = valor;
                    }
                }
            }
        }
        
        return dados;
    } catch (error) {
        console.error(`Erro ao processar ${caminhoExcel}:`, error.message);
        return {};
    }
}

function gerarCatalogo() {
    const catalogo = {};
    for (const slug of Object.values(CATEGORIAS)) {
        catalogo[slug] = [];
    }
    
    for (const [pastaCategoria, slugCategoria] of Object.entries(CATEGORIAS)) {
        const pastaPath = path.join(TABELAS_DIR, pastaCategoria);
        if (!fs.existsSync(pastaPath)) continue;
        
        const arquivos = fs.readdirSync(pastaPath)
            .filter(f => f.startsWith('Tab ') && f.endsWith('.xlsx') && !f.startsWith('~$'))
            .sort();
        
        for (const arquivo of arquivos) {
            const nomeArquivo = arquivo.replace('.xlsx', '');
            const match = nomeArquivo.match(/Tab\s+([\d\.]+)\s+(.+)/);
            
            let numTab = '';
            let titulo = nomeArquivo;
            if (match) {
                numTab = match[1];
                titulo = match[2];
            }
            
            const ano = extrairAnoDoTitulo(titulo);
            const slug = `${slugCategoria}-${numTab.replace(/\./g, '-')}`;
            
            // Determina unidade
            let unit = '';
            const tituloLower = titulo.toLowerCase();
            if (tituloLower.includes('população') || tituloLower.includes('habitantes')) {
                unit = 'hab';
            } else if (tituloLower.includes('pib')) {
                unit = 'R$';
            } else if (tituloLower.includes('área')) {
                unit = 'km²';
            } else if (tituloLower.includes('densidade')) {
                unit = 'hab/km²';
            }
            
            catalogo[slugCategoria].push({
                slug,
                label: titulo,
                unit,
                year: ano,
                path: `data/indicadores/2025/${arquivo.replace('.xlsx', '.json')}`
            });
        }
    }
    
    return catalogo;
}

function main() {
    console.log('='.repeat(80));
    console.log('CONVERSOR EXCEL → JSON PARA MAPA INTERATIVO');
    console.log('='.repeat(80));
    
    // Verifica se xlsx está instalado
    try {
        require.resolve('xlsx');
    } catch (e) {
        console.error('\n❌ Pacote "xlsx" não encontrado!');
        console.error('📦 Execute: npm install xlsx');
        process.exit(1);
    }
    
    // Cria diretório de saída
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    let totalProcessados = 0;
    let totalErros = 0;
    
    // Processa cada categoria
    for (const [pastaCategoria, slugCategoria] of Object.entries(CATEGORIAS)) {
        const pastaPath = path.join(TABELAS_DIR, pastaCategoria);
        if (!fs.existsSync(pastaPath)) {
            console.log(`\n⚠️  Pasta não encontrada: ${pastaCategoria}`);
            continue;
        }
        
        console.log(`\n📁 Processando categoria: ${pastaCategoria}`);
        console.log('-'.repeat(80));
        
        const arquivos = fs.readdirSync(pastaPath)
            .filter(f => f.startsWith('Tab ') && f.endsWith('.xlsx') && !f.startsWith('~$'))
            .sort();
        
        for (const arquivo of arquivos) {
            try {
                process.stdout.write(`   Processando: ${arquivo}... `);
                
                const caminhoArquivo = path.join(pastaPath, arquivo);
                const dados = processarPlanilha(caminhoArquivo, slugCategoria);
                
                if (Object.keys(dados).length > 0) {
                    const jsonFilename = arquivo.replace('.xlsx', '.json');
                    const jsonPath = path.join(OUTPUT_DIR, jsonFilename);
                    
                    const output = {
                        metadata: {
                            source: arquivo,
                            categoria: slugCategoria,
                            municipios: Object.keys(dados).length
                        },
                        data: dados
                    };
                    
                    fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf-8');
                    console.log(`✅ ${Object.keys(dados).length} municípios`);
                    totalProcessados++;
                } else {
                    console.log('⚠️  Nenhum dado extraído');
                    totalErros++;
                }
            } catch (error) {
                console.log(`❌ ERRO: ${error.message}`);
                totalErros++;
            }
        }
    }
    
    // Gera catálogo
    console.log('\n' + '='.repeat(80));
    console.log('📋 Gerando catálogo de indicadores...');
    const catalogo = gerarCatalogo();
    
    const catalogoPath = path.join(BASE_DIR, 'data', 'catalogo_2025.json');
    fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2), 'utf-8');
    
    const totalIndicadores = Object.values(catalogo).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`✅ Catálogo gerado com ${totalIndicadores} indicadores`);
    
    // Resumo
    console.log('\n' + '='.repeat(80));
    console.log('RESUMO DA CONVERSÃO');
    console.log('='.repeat(80));
    console.log(`✅ Arquivos processados com sucesso: ${totalProcessados}`);
    console.log(`❌ Arquivos com erro: ${totalErros}`);
    console.log(`📊 Total de indicadores no catálogo: ${totalIndicadores}`);
    console.log(`\n🎯 Arquivos JSON salvos em: ${OUTPUT_DIR}`);
    console.log(`📋 Catálogo salvo em: ${catalogoPath}`);
    console.log('='.repeat(80));
}

main();
