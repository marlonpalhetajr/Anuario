const XLSX = require('xlsx');
const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const EXCEL_FILE = path.join(BASE_DIR, 'Tabelas 2025', '1. Demografia', 'Tab 1.1 População Total - Estimativas Populacionais e Censo Demográfico - 2021 a 2025.xlsx');
const OUTPUT_JSON = path.join(BASE_DIR, 'data', 'populacao_2025.json');
const GEOJSON_OUTPUT = path.join(BASE_DIR, 'data', 'para_municipios.geojson');

console.log('🔄 Processando dados de população...');

// Ler Excel
try {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Tentar diferentes ranges para pular cabeçalhos
    const data = XLSX.utils.sheet_to_json(worksheet, { range: 4 }); // Pula primeiras 4 linhas
    
    console.log(`✓ Arquivo Excel lido: ${data.length} linhas`);
    
    if (data.length > 0) {
        console.log('Primeiras colunas:', Object.keys(data[0]));
        console.log('Primeira linha de dados:', data[0]);
        console.log('\nSegunda linha:', data[1]);
    }
    
    // Identificar colunas
    const firstRow = data[0];
    let municipioCol = null;
    let pop2025Col = null;
    
    for (const key of Object.keys(firstRow)) {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('município') || keyLower.includes('municipio') || key === 'Município' || keyLower === 'municÍpio') {
            municipioCol = key;
        }
        if (key.includes('2025') || keyLower.includes('2025')) {
            pop2025Col = key;
        }
    }
    
    // Se não encontrou, tentar por posição
    if (!municipioCol && !pop2025Col) {
        console.log('\n⚠️ Tentando identificar por posição das colunas...');
        const keys = Object.keys(firstRow);
        console.log('Todas as colunas:', keys);
        
        // Primeira coluna geralmente é município
        municipioCol = keys[0];
        // Última coluna geralmente é o ano mais recente (2025)
        pop2025Col = keys[keys.length - 1];
    }
    
    console.log(`\n📍 Coluna município: ${municipioCol}`);
    console.log(`📊 Coluna população 2025: ${pop2025Col}`);
    
    if (!municipioCol || !pop2025Col) {
        console.log('\n⚠️ Colunas não identificadas');
        console.log('Colunas disponíveis:');
        console.log(Object.keys(firstRow));
        process.exit(1);
    }
    
    // Extrair dados
    const dados = {};
    data.forEach(row => {
        const municipio = String(row[municipioCol] || '').trim();
        const pop = parseInt(row[pop2025Col]);
        
        if (municipio && !isNaN(pop) && pop > 0) {
            dados[municipio] = pop;
            console.log(`  ${municipio}: ${pop.toLocaleString('pt-BR')}`);
        }
    });
    
    console.log(`\n✓ ${Object.keys(dados).length} municípios processados`);
    
    // Salvar JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(dados, null, 2), 'utf8');
    console.log(`✓ Dados salvos em: ${OUTPUT_JSON}`);
    
} catch (error) {
    console.error('❌ Erro ao processar Excel:', error.message);
    process.exit(1);
}

// Buscar GeoJSON
console.log('\n🌐 Buscando GeoJSON dos municípios do Pará...');
const url = 'https://servicodados.ibge.gov.br/api/v3/malhas/estados/15?formato=application/vnd.geo+json&qualidade=minima';

https.get(url, (res) => {
    let data = '';
    
    res.on('data', chunk => data += chunk);
    
    res.on('end', () => {
        try {
            const geojson = JSON.parse(data);
            fs.writeFileSync(GEOJSON_OUTPUT, JSON.stringify(geojson, null, 2), 'utf8');
            console.log(`✓ GeoJSON salvo em: ${GEOJSON_OUTPUT}`);
            console.log(`✓ ${geojson.features?.length || 0} features encontradas`);
            console.log('\n✅ Processamento concluído!');
        } catch (error) {
            console.error('❌ Erro ao processar GeoJSON:', error.message);
        }
    });
}).on('error', (error) => {
    console.error('⚠️ Erro ao buscar GeoJSON:', error.message);
    console.log('Você pode baixar manualmente de:');
    console.log('https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/');
});
