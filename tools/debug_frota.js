const XLSX = require('xlsx');
const path = require('path');

const frotaPath = path.join(__dirname, '../Tabelas 2025/3. Infraestrutura/Tab 3.1 Total da Frota de Veículos Subdivididos em Licenciados e Não Licenciados - 2020 a 2024.xlsx');

const wb = XLSX.readFile(frotaPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('Linha 5 (anos):', data[4]);
console.log('\nLinha 6 (subheaders):', data[5]);
console.log('\nLinha 7 (Pará):', data[6]);

// Procurar coluna 2024
const yearLine = data[4];
const colIdx = yearLine.findIndex(v => v === 2024);
console.log(`\nColuna de 2024: índice ${colIdx}`);
if (colIdx !== -1) {
  console.log(`Subheader nessa coluna: ${data[5][colIdx]}`);
  console.log(`Valor Pará: ${data[6][colIdx]}`);
}
