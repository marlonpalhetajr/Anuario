const XLSX = require('xlsx');
const path = require('path');

// Verificar qual é a planilha de agropecuária
const agropecPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.4 PIB/Tab 2.4.3 VA Bruto a Preços Correntes da Agropecuária (Mil Reais) - 2017 a 2021.xlsx');

console.log('📖 Inspecionando planilha de VA Agropecuária...');
const wb = XLSX.readFile(agropecPath);
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
