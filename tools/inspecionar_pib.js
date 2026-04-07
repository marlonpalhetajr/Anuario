const XLSX = require('xlsx');
const path = require('path');

const pibPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.4 PIB/Tab 2.4.1 Produto Interno Bruto a Preços Correntes (Mil Reais) - 2017 a 2021.xlsx');

console.log('📖 Inspecionando Tab 2.4.1 PIB total (mil R$) 2017-2021');
const wb = XLSX.readFile(pibPath);
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
