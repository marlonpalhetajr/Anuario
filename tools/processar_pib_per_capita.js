const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const pibPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.4 PIB/Tab 2.4.1 Produto Interno Bruto a Preços Correntes (Mil Reais) - 2017 a 2021.xlsx');
const popPath = path.join(__dirname, '../Tabelas 2025/1. Demografia/Tab 1.1 População Total - Estimativas Populacionais e Censo Demográfico - 2021 a 2025.xlsx');

function loadColumn(filePath, year) {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const headers = data[4]; // linha 5
  const colIdx = headers.indexOf(year);
  if (colIdx === -1) throw new Error(`Ano ${year} não encontrado em ${filePath}`);
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
}

console.log('📖 Carregando PIB total 2021 (mil R$)...');
const pibMil = loadColumn(pibPath, 2021); // mil R$
console.log('📖 Carregando População 2021...');
const pop = loadColumn(popPath, 2021);

const perCapita = {};
let missingPop = 0;
Object.entries(pibMil).forEach(([muni, pibMilValor]) => {
  const popVal = pop[muni];
  if (!popVal || popVal === 0) {
    missingPop++;
    perCapita[muni] = 0;
    return;
  }
  const pibReais = pibMilValor * 1000; // mil R$ -> R$
  perCapita[muni] = pibReais / popVal;
});

console.log(`✓ Municípios PIB: ${Object.keys(pibMil).length}`);
console.log(`✓ Municípios População: ${Object.keys(pop).length}`);
console.log(`⚠️ Municípios sem população: ${missingPop}`);

const outputPath = path.join(__dirname, '../data/pib_per_capita_2021.json');
fs.writeFileSync(outputPath, JSON.stringify(perCapita, null, 2));
console.log(`✅ Salvo em ${outputPath}`);
console.log('Amostra:');
Object.entries(perCapita).slice(0, 5).forEach(([m,v]) => console.log(` - ${m}: ${v}`));
