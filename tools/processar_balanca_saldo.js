const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const saldoPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.5 Balança Comercial     OK/Tab 2.5.3 Saldo da Balança Comercial - 2019 a 2024.xlsx');

console.log('📖 Lendo planilha: Saldo da Balança Comercial 2019-2024');
const wb = XLSX.readFile(saldoPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Linha 5 (índice 4) contém cabeçalhos: Município, 2019..2024
const headers = data[4];
const col2024 = headers.indexOf(2024);
if (col2024 === -1) throw new Error('Coluna 2024 não encontrada');

const saldo2024 = {};

for (let i = 5; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[0]) break; // fim
  const municipio = row[0];
  const raw = row[col2024];
  if (municipio && typeof municipio === 'string') {
    let valor = 0;
    if (typeof raw === 'number') {
      valor = raw;
    } else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
      const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
      if (!Number.isNaN(parsed)) valor = parsed;
    }
    saldo2024[municipio.trim()] = valor;
  }
}

console.log(`✓ Municípios processados: ${Object.keys(saldo2024).length}`);
const outputPath = path.join(__dirname, '../data/balanca_comercial_2024.json');
fs.writeFileSync(outputPath, JSON.stringify(saldo2024, null, 2));
console.log(`✅ Salvo em ${outputPath}`);

console.log('Amostra:');
Object.entries(saldo2024).slice(0, 5).forEach(([m,v]) => console.log(` - ${m}: ${v}`));
