const XLSX = require('xlsx');
const path = require('path');

const frotaPath = path.join(__dirname, '../Tabelas 2025/3. Infraestrutura/Tab 3.1 Total da Frota de Veículos Subdivididos em Licenciados e Não Licenciados - 2020 a 2024.xlsx');

console.log('📖 Inspecionando Tab 3.1 Frota de Veículos...');
const wb = XLSX.readFile(frotaPath);
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
