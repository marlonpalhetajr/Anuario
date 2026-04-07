const XLSX = require('xlsx');
const path = require('path');

const files = [
  'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.9 Índice de Desenv da Educ Básica - IDEB - Esc Pública - 5 ano (séries iniciais) - 2015_2017_2019_2021_2023.xlsx',
  'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.1 Taxa de Aprovação no Ensino Fundamental por Dependência Administrativa - 2020 a 2024 ok.xlsx',
  'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.1 Taxa de Mortalidade Infantil - 2020 a 2024.xlsx',
  'Tabelas 2025/5. Social/5.2 INCLUSÃO SOCIAL     OK/Tab 5.2.1 Famílias Atendidas e Valor Total Empregado no Programa Bolsa Família - 2020 a 2025.xlsx'
];

files.forEach(filePath => {
  console.log(`\n📄 ${path.basename(filePath).substring(0, 50)}...`);
  
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
  console.log('Primeiras 8 linhas:');
  for (let i = 0; i < Math.min(8, data.length); i++) {
    const row = data[i];
    if (row && row.filter(x => x).length > 0) {
      console.log(`  L${i}: [${row.slice(0, 8).map(v => {
        if (v === undefined || v === null || v === '') return 'vazio';
        return typeof v === 'number' ? v : `"${String(v).substring(0, 20)}"`;
      }).join(', ')}]`);
    }
  }
});
