const XLSX = require('xlsx');
const path = require('path');

const baseDir = 'Tabelas 2025/4. Meio Ambiente';
const files = [
  'Tab 4.3 Área de Floresta (km²) e Hidrografia (km²) - 2020 a 2024(ATUALIZADA).xlsx',
  'Tab 4.1 Desflorestamento Acumulado (km²) - 2020 a 2024 (ATUALIZADA).xlsx',
  'Tab 4.4 Focos de Calor - 2020 a 2024(ATUALIZADA).xlsx',
  'Tab 4.2 Incremento (Desflorestamento km²)  - 2020 a 2024 (ATUALIZADA).xlsx'
];

// Para a primeira tabela, examina melhor
const filePath1 = path.join(baseDir, files[0]);
const wb1 = XLSX.readFile(filePath1);
const ws1 = wb1.Sheets[wb1.SheetNames[0]];
const data1 = XLSX.utils.sheet_to_json(ws1, { header: 1 });

console.log('\n=== DETALHE Tab 4.3 (Área de Floresta) ===');
console.log('Linhas 4-6 (header + subheader):');
console.log('Linha 4:', data1[3]);
console.log('Linha 5 (header):', data1[4]);
console.log('Linha 6 (subheader):', data1[5]);
console.log('Linha 7 (Pará):', data1[6]);

// Procura 2024 em cada linha
for (let i = 3; i < 6; i++) {
  const idx = data1[i]?.indexOf(2024);
  if (idx !== -1) {
    console.log(`2024 encontrado na linha ${i} índice ${idx}`);
  }
}

// Procura "Floresta" nas linhas de subheader
console.log('\nProcurando "Floresta" ou "km":');
for (let i = 4; i < 7; i++) {
  const florIdx = data1[i]?.findIndex(x => 
    typeof x === 'string' && x.includes('Floresta')
  );
  if (florIdx !== -1) {
    console.log(`"Floresta" encontrado na linha ${i} índice ${florIdx}`);
  }
}
