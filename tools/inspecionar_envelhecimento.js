const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../Tabelas 2025/1. Demografia/Tab 1.6 Índice de Envelhecimento - 2021 a 2025.xlsx');

console.log('📖 Inspecionando arquivo Excel...');
const workbook = XLSX.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

console.log('\n📋 Primeiras 10 linhas do arquivo (sem filtro):');
const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
allData.slice(0, 10).forEach((row, i) => {
  console.log(`Linha ${i + 1}:`, row);
});

console.log('\n📊 Cabeçalhos (linhas 1-5):');
allData.slice(0, 5).forEach((row, i) => {
  console.log(`Linha ${i + 1}:`, row);
});
