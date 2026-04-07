const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const INDICADORES_DIR = path.join(BASE_DIR, 'data', 'indicadores', '2025');
const CATALOGO_PATH = path.join(BASE_DIR, 'data', 'catalogo_2025.json');

// Mapeia prefixos de arquivos para categorias
const CATEGORIA_MAP = {
    'Tab 1': 'demografia',
    'Tab 2': 'economia',
    'Tab 3': 'infraestrutura',
    'Tab 4': 'meio-ambiente',
    'Tab 5': 'social'
};

function extrairCategoria(nomeArquivo) {
    for (const [prefixo, categoria] of Object.entries(CATEGORIA_MAP)) {
        if (nomeArquivo.startsWith(prefixo)) {
            return categoria;
        }
    }
    return null;
}

function gerarLabel(nomeArquivo) {
    return nomeArquivo
        .replace('.json', '')
        .replace(/^Tab \d+\.?\d*\.?\d*\.?\d*\s+/, '') // Remove "Tab 2.1.1.1"
        .replace(/ - \d{4}.*$/, '') // Remove anos no final
        .trim();
}

function gerarSlug(nomeArquivo) {
    return nomeArquivo
        .replace('.json', '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

console.log('Atualizando catálogo...\n');

// Lê todos os arquivos JSON
const arquivos = fs.readdirSync(INDICADORES_DIR)
    .filter(f => f.endsWith('.json') && f.startsWith('Tab'));

console.log(`${arquivos.length} indicadores encontrados\n`);

// Agrupa por categoria
const catalogo = {
    'demografia': [],
    'economia': [],
    'infraestrutura': [],
    'meio-ambiente': [],
    'social': []
};

arquivos.forEach(arquivo => {
    const categoria = extrairCategoria(arquivo);
    if (categoria) {
        catalogo[categoria].push({
            slug: gerarSlug(arquivo),
            label: gerarLabel(arquivo),
            unit: '',
            year: 2025,
            path: `data/indicadores/2025/${arquivo}`
        });
    }
});

// Mostra resumo
console.log('Indicadores por categoria:');
for (const [categoria, indicadores] of Object.entries(catalogo)) {
    console.log(`  ${categoria}: ${indicadores.length}`);
}

// Salva catálogo
fs.writeFileSync(CATALOGO_PATH, JSON.stringify(catalogo, null, 2), 'utf-8');
console.log(`\n✅ Catálogo atualizado: ${CATALOGO_PATH}`);
