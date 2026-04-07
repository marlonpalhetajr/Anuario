const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const icmsPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.6 Finanças Públicas     OK/Tab 2.6.1 Repasse de ICMS dos Municípios do Pará - 2020 a 2024.xlsx');

console.log('📖 Lendo planilha: Repasse de ICMS 2020-2024');
const wb = XLSX.readFile(icmsPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Linha 5 (índice 4) cabeçalho
const headers = data[4];
const col2024 = headers.indexOf(2024);
if (col2024 === -1) throw new Error('Coluna 2024 não encontrada');

const icms2024 = {};

for (let i = 5; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[0]) break;
  const municipio = row[0];
  const raw = row[col2024];
  if (typeof municipio === 'string' && municipio.trim()) {
    let valor = 0;
    if (typeof raw === 'number') {
      valor = raw;
    } else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
      const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
      if (!Number.isNaN(parsed)) valor = parsed;
    }
    icms2024[municipio.trim()] = valor;
  }
}

console.log(`✓ Municípios processados: ${Object.keys(icms2024).length}`);
const outputPath = path.join(__dirname, '../data/icms_repasse_2024.json');
fs.writeFileSync(outputPath, JSON.stringify(icms2024, null, 2));
console.log(`✅ Salvo em ${outputPath}`);
console.log('Amostra:');
Object.entries(icms2024).slice(0, 5).forEach(([m,v]) => console.log(` - ${m}: ${v}`));
