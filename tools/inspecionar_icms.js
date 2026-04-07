const XLSX = require('xlsx');
const path = require('path');

const icmsPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.6 Finanças Públicas     OK/Tab 2.6.1 Repasse de ICMS dos Municípios do Pará - 2020 a 2024.xlsx');

console.log('📖 Inspecionando planilha de Repasse ICMS...');
const wb = XLSX.readFile(icmsPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('\nCabeçalho (linhas 1-8):');
for (let i = 0; i < 8; i++) {
  console.log(`Linha ${i+1}:`, data[i]);
}

console.log('\nAmostra (linhas 9-18):');
for (let i = 8; i < 18; i++) {
  console.log(`Linha ${i+1}:`, data[i]);
}
