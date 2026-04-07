const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const searchDir = 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK';
const files = fs.readdirSync(searchDir);

const ideFile = files.find(f => f.includes('Tab 5.1.9'));
if (ideFile) {
  const filePath = path.join(searchDir, ideFile);
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
  console.log(`Total rows: ${data.length}`);
  console.log('\n=== Primeiras 10 linhas ===');
  for (let r = 0; r < Math.min(10, data.length); r++) {
    console.log(`Row ${r}: ${JSON.stringify(data[r])}`);
  }
  
  console.log('\n=== Procurando headers ===');
  // Tenta cada linha como possível header
  for (let r = 0; r < 7; r++) {
    if (data[r] && data[r].includes(2023)) {
      console.log(`✓ Linha ${r} tem 2023: ${JSON.stringify(data[r].slice(0, 8))}`);
    }
  }
}
