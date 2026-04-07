const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function loadColumn(filePath, year) {
  try {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const headers = data[4];
    const colIdx = headers.indexOf(year);
    if (colIdx === -1) throw new Error(`Ano ${year} não encontrado`);
    const out = {};
    for (let i = 5; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) break;
      const muni = row[0];
      const raw = row[colIdx];
      if (typeof muni === 'string' && muni.trim()) {
        let val = 0;
        if (typeof raw === 'number') val = raw;
        else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
          const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
          if (!Number.isNaN(parsed)) val = parsed;
        }
        out[muni.trim()] = val;
      }
    }
    return out;
  } catch (e) {
    console.error(`Erro em ${filePath}:`, e.message);
    return {};
  }
}

function loadColumnByName(filePath, year, subColumn) {
  try {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Linha 5 tem os anos, Linha 6 tem os subheaders
    const yearLine = data[4];
    const subLine = data[5];
    
    let colIdx = -1;
    for (let i = 0; i < yearLine.length; i++) {
      // Procura linha com o ano exato
      if (yearLine[i] === year) {
        // Agora procura o subheader "Frota" partindo desse índice até 3 colunas adiante
        for (let j = i; j < Math.min(i + 4, subLine.length); j++) {
          const sub = subLine[j];
          if (typeof sub === 'string' && sub.trim() === subColumn) {
            colIdx = j;
            break;
          }
        }
        if (colIdx !== -1) break;
      }
    }
    
    if (colIdx === -1) throw new Error(`${subColumn} ${year} não encontrado`);
    
    const out = {};
    for (let i = 6; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) break;
      const muni = row[0];
      const raw = row[colIdx];
      if (typeof muni === 'string' && muni.trim()) {
        let val = 0;
        if (typeof raw === 'number') val = raw;
        else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
          const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
          if (!Number.isNaN(parsed)) val = parsed;
        }
        out[muni.trim()] = val;
      }
    }
    return out;
  } catch (e) {
    console.error(`Erro em ${filePath}:`, e.message);
    return {};
  }
}

async function processAll() {
  const basePath = path.join(__dirname, '../Tabelas 2025/3. Infraestrutura');
  const results = {};

  // 1. Consumidores de Energia Elétrica Total 2023
  console.log('1️⃣ Consumidores de Energia Elétrica 2023...');
  results.consumidores_energia = loadColumn(path.join(basePath, 'Tab 3.2 Consumidores de Energia Elétrica Total - 2019 a 2023.xlsx'), 2023);
  console.log(`✓ ${Object.keys(results.consumidores_energia).length} municípios`);

  // 2. Consumo de Energia Elétrica (kWH) 2023
  console.log('2️⃣ Consumo de Energia Elétrica (kWH) 2023...');
  results.consumo_energia = loadColumn(path.join(basePath, 'Tab 3.4 Consumo de Energia Elétrica (kWH) - 2019 a 2023.xlsx'), 2023);
  console.log(`✓ ${Object.keys(results.consumo_energia).length} municípios`);

  // 3. Frota de Veículos Total 2024 (estrutura complexa)
  console.log('3️⃣ Frota de Veículos Total 2024...');
  results.frota_veiculos = loadColumnByName(path.join(basePath, 'Tab 3.1 Total da Frota de Veículos Subdivididos em Licenciados e Não Licenciados - 2020 a 2024.xlsx'), 2024, 'Frota');
  console.log(`✓ ${Object.keys(results.frota_veiculos).length} municípios`);

  // Salvar todos
  const dataPath = path.join(__dirname, '../data');
  const mapping = [
    ['consumidores_energia', 'consumidores_energia_2023.json'],
    ['consumo_energia', 'consumo_energia_2023.json'],
    ['frota_veiculos', 'frota_veiculos_2024.json']
  ];

  console.log('\n📁 Salvando arquivos...');
  mapping.forEach(([key, filename]) => {
    const filePath = path.join(dataPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(results[key], null, 2));
    console.log(`✅ ${filename}`);
  });

  console.log('\n✨ Todos os indicadores de Infraestrutura processados com sucesso!');
}

processAll();
