const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const vaPath = path.join(__dirname, '../Tabelas 2025/2. Economia/2.4 PIB/Tab 2.4.3 VA Bruto a Preços Correntes da Agropecuária (Mil Reais) - 2017 a 2021.xlsx');

console.log('📖 Lendo: VA Agropecuária 2017-2021');
const wb = XLSX.readFile(vaPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Linha 5 (índice 4) cabeçalho
const headers = data[4];
const col2021 = headers.indexOf(2021);
if (col2021 === -1) throw new Error('Coluna 2021 não encontrada');

const vaAgro2021 = {};

for (let i = 5; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[0]) break;
  const municipio = row[0];
  const raw = row[col2021];
  if (typeof municipio === 'string' && municipio.trim()) {
    let valor = 0;
    if (typeof raw === 'number') {
      valor = raw;
    } else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
      const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
      if (!Number.isNaN(parsed)) valor = parsed;
    }
    vaAgro2021[municipio.trim()] = valor;
  }
}

console.log(`✓ Municípios processados: ${Object.keys(vaAgro2021).length}`);
const outputPath = path.join(__dirname, '../data/va_agropecuaria_2021.json');
fs.writeFileSync(outputPath, JSON.stringify(vaAgro2021, null, 2));
console.log(`✅ Salvo em ${outputPath}`);
console.log('Amostra:');
Object.entries(vaAgro2021).slice(0, 5).forEach(([m,v]) => console.log(` - ${m}: ${v}`));
