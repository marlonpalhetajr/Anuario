const XLSX = require('xlsx');
const path = require('path');

const saldoPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.5 Balança Comercial     OK/Tab 2.5.3 Saldo da Balança Comercial - 2019 a 2024.xlsx');

console.log('📖 Inspecionando planilha de Saldo da Balança Comercial...');
const wb = XLSX.readFile(saldoPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

console.log('\nCabeçalho bruto (linhas 1-8):');
for (let i = 0; i < 8; i++) {
  console.log(`Linha ${i+1}:`, data[i]);
}

console.log('\nAmostra de registros (linhas 9-18):');
for (let i = 8; i < 18; i++) {
  console.log(`Linha ${i+1}:`, data[i]);
}
