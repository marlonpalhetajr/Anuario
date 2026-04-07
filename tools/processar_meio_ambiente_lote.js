const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const baseDir = 'Tabelas 2025/4. Meio Ambiente';

// Configuração dos indicadores
const indicadores = [
  {
    name: 'Área de Floresta 2024',
    file: 'Tab 4.3 Área de Floresta (km²) e Hidrografia (km²) - 2020 a 2024(ATUALIZADA).xlsx',
    headerRow: 5,
    dataStartRow: 6,
    year: 2024,
    subColumn: 'floresta', // Floresta é a primeira coluna de dados (índice 1)
    output: 'data/area_floresta_2024.json'
  },
  {
    name: 'Desflorestamento Acumulado 2024',
    file: 'Tab 4.1 Desflorestamento Acumulado (km²) - 2020 a 2024 (ATUALIZADA).xlsx',
    headerRow: 5,
    dataStartRow: 6,
    year: 2024,
    output: 'data/desflorestamento_acumulado_2024.json'
  },
  {
    name: 'Focos de Calor 2024',
    file: 'Tab 4.4 Focos de Calor - 2020 a 2024(ATUALIZADA).xlsx',
    headerRow: 5,
    dataStartRow: 6,
    year: 2024,
    output: 'data/focos_calor_2024.json'
  },
  {
    name: 'Incremento (Desflorestamento) 2024',
    file: 'Tab 4.2 Incremento (Desflorestamento km²)  - 2020 a 2024 (ATUALIZADA).xlsx',
    headerRow: 5,
    dataStartRow: 6,
    year: 2024,
    output: 'data/incremento_desflorestamento_2024.json'
  }
];

function loadColumnByYear(filePath, year) {
  try {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    const headerLine = data[4]; // Linha 5 (0-indexed = 4)
    const colIdx = headerLine.indexOf(year);
    
    if (colIdx === -1) {
      throw new Error(`Ano ${year} não encontrado`);
    }
    
    const out = {};
    for (let i = 5; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) break;
      
      const muni = row[0];
      const raw = row[colIdx];
      
      if (typeof muni === 'string' && muni.trim()) {
        let val = 0;
        if (typeof raw === 'number') {
          val = raw;
        } else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
          const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
          if (!Number.isNaN(parsed)) val = parsed;
        }
        out[muni.trim()] = val;
      }
    }
    return out;
  } catch (e) {
    console.error(`  ❌ Erro: ${e.message}`);
    return {};
  }
}

function loadColumnForFlorestOnly(filePath, year) {
  // Tab 4.3 tem estrutura especial: primeira coluna de dados é Floresta
  try {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Procura qual coluna tem o ano 2024
    const subheaderLine = data[5]; // Linha 6 (0-indexed = 5)
    let colIdx = -1;
    
    // Tab 4.3: subheader tem [vazio, 2020, 2021, 2022, 2023, 2024, '2023*']
    for (let i = 0; i < subheaderLine.length; i++) {
      if (subheaderLine[i] === year) {
        colIdx = i;
        break;
      }
    }
    
    if (colIdx === -1) {
      throw new Error(`Ano ${year} não encontrado em Tab 4.3`);
    }
    
    const out = {};
    for (let i = 6; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) break;
      
      const muni = row[0];
      const raw = row[colIdx];
      
      if (typeof muni === 'string' && muni.trim()) {
        let val = 0;
        if (typeof raw === 'number') {
          val = raw;
        } else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
          const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
          if (!Number.isNaN(parsed)) val = parsed;
        }
        out[muni.trim()] = val;
      }
    }
    return out;
  } catch (e) {
    console.error(`  ❌ Erro: ${e.message}`);
    return {};
  }
}

console.log('🌍 Processando Meio Ambiente...\n');

indicadores.forEach((ind, idx) => {
  console.log(`${idx + 1}️⃣ ${ind.name}`);
  
  const filePath = path.join(baseDir, ind.file);
  
  let result;
  if (ind.subColumn === 'floresta') {
    result = loadColumnForFlorestOnly(filePath, ind.year);
  } else {
    result = loadColumnByYear(filePath, ind.year);
  }
  
  const count = Object.keys(result).length;
  console.log(`   ✓ ${count} municípios`);
  
  // Salva o arquivo
  fs.writeFileSync(ind.output, JSON.stringify(result, null, 2));
});

console.log('\n📁 Salvando arquivos...');
indicadores.forEach(ind => {
  console.log(`✅ ${path.basename(ind.output)}`);
});

console.log('\n✨ Processamento de Meio Ambiente completo!');
