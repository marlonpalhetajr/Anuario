const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Caminho do arquivo Excel
const excelPath = path.join(__dirname, '../Tabelas 2025/1. Demografia/Tab 1.6 Índice de Envelhecimento - 2021 a 2025.xlsx');

// Lê o arquivo Excel
console.log('📖 Lendo arquivo Excel: Tab 1.6 Índice de Envelhecimento...');
const workbook = XLSX.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Converte para array (sem cabeçalho, para ler as linhas brutas)
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Pula para linha 5 (índice 4) que contém os cabeçalhos
// [Estado/Município, 2021, 2022, 2023, 2024, 2025]
const headers = data[4];
const col2024 = headers.indexOf(2024); // Encontra coluna de 2024

console.log(`✓ Coluna de 2024 encontrada: índice ${col2024}`);

// Extrai dados de 2024 começando da linha 6 (índice 5)
const envelhecimento2024 = {};

for (let i = 5; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[0]) break; // Para quando chegar ao fim dos dados
  
  const municipio = row[0];
  const valor2024 = row[col2024];
  
  if (municipio && typeof municipio === 'string' && municipio.trim() && !isNaN(valor2024)) {
    const valor = parseFloat(valor2024);
    envelhecimento2024[municipio.trim()] = valor;
    console.log(`  ${municipio.trim()}: ${valor}`);
  }
}

console.log(`\n✓ Total de municípios processados: ${Object.keys(envelhecimento2024).length}`);

// Salva em JSON
const outputPath = path.join(__dirname, '../data/indice_envelhecimento_2024.json');
fs.writeFileSync(outputPath, JSON.stringify(envelhecimento2024, null, 2), 'utf-8');

console.log(`\n✅ Arquivo salvo em: ${outputPath}`);
console.log(`   Amostra de dados:`);
const amostra = Object.entries(envelhecimento2024).slice(0, 3);
amostra.forEach(([municipio, valor]) => {
  console.log(`   - ${municipio}: ${valor}`);
});
