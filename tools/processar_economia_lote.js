const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function loadColumn(filePath, year) {
  try {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const headers = data[4];
    const colIdx = headers.indexOf(year);
    if (colIdx === -1) throw new Error(`Ano ${year} não encontrado`);
    const out = {};
    for (let i = 5; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) break;
      const muni = row[0];
      const raw = row[colIdx];
      if (typeof muni === 'string' && muni.trim()) {
        let val = 0;
        if (typeof raw === 'number') val = raw;
        else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
          const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
          if (!Number.isNaN(parsed)) val = parsed;
        }
        out[muni.trim()] = val;
      }
    }
    return out;
  } catch (e) {
    console.error(`Erro em ${filePath}:`, e.message);
    return {};
  }
}

async function processAll() {
  const basePath = path.join(__dirname, '../Tabelas 2025/2. Economia');
  const results = {};

  // 1. VA Indústria 2021
  console.log('1️⃣ VA Indústria 2021...');
  results.va_industria = loadColumn(path.join(basePath, '2.4 PIB/Tab 2.4.4 VA Bruto a Preços Correntes da Indústria (Mil Reais) - 2017 a 2021.xlsx'), 2021);
  console.log(`✓ ${Object.keys(results.va_industria).length} municípios`);

  // 2. VA Serviços 2021
  console.log('2️⃣ VA Serviços 2021...');
  results.va_servicos = loadColumn(path.join(basePath, '2.4 PIB/Tab 2.4.5 VA Bruto a Preços Correntes dos Serv, Exclus Admin, Saúde e Educ Púb e Segur Soc (Mil Reais) - 2017 a 2021.xlsx'), 2021);
  console.log(`✓ ${Object.keys(results.va_servicos).length} municípios`);

  // 3. VA Total 2021
  console.log('3️⃣ VA Total 2021...');
  results.va_total = loadColumn(path.join(basePath, '2.4 PIB/Tab 2.4.2 VA Bruto a Preços Correntes Total (Mil Reais) - 2017 a 2021.xlsx'), 2021);
  console.log(`✓ ${Object.keys(results.va_total).length} municípios`);

  // 4. PIB Total 2021 (já temos, mas vamos regenerar)
  console.log('4️⃣ PIB Total 2021...');
  results.pib_total = loadColumn(path.join(basePath, '2.4 PIB/Tab 2.4.1 Produto Interno Bruto a Preços Correntes (Mil Reais) - 2017 a 2021.xlsx'), 2021);
  console.log(`✓ ${Object.keys(results.pib_total).length} municípios`);

  // 5. Rebanho Bovino 2024
  console.log('5️⃣ Rebanho Bovino 2024...');
  results.rebanho_bovino = loadColumn(path.join(basePath, '2.2 Pecuária - ok/Tab 2.2.1 Efetivo de Rebanho Bovino - 2020 a 2024.xlsx'), 2024);
  console.log(`✓ ${Object.keys(results.rebanho_bovino).length} municípios`);

  // 6. Receita Corrente 2024
  console.log('6️⃣ Receita Corrente 2024...');
  results.receita_corrente = loadColumn(path.join(basePath, '2.6 Finanças Públicas     OK/Tab 2.6.6 Receitas Correntes, Pará e municípios - 2020 a 2024.xlsx'), 2024);
  console.log(`✓ ${Object.keys(results.receita_corrente).length} municípios`);

  // 7. Receita Orçamentária 2024
  console.log('7️⃣ Receita Orçamentária 2024...');
  results.receita_orcamentaria = loadColumn(path.join(basePath, '2.6 Finanças Públicas     OK/Tab 2.6.5 Receita Orçamentária, Pará e municípios - 2020 a 2024.xlsx'), 2024);
  console.log(`✓ ${Object.keys(results.receita_orcamentaria).length} municípios`);

  // 8. Receita Transferências Correntes 2024
  console.log('8️⃣ Receita Transferências 2024...');
  results.receita_transf_correntes = loadColumn(path.join(basePath, '2.6 Finanças Públicas     OK/Tab 2.6.8 Receita de Transferências Correntes, Pará e municípios - 2020 a 2024.xlsx'), 2024);
  console.log(`✓ ${Object.keys(results.receita_transf_correntes).length} municípios`);

  // Salvar todos
  const dataPath = path.join(__dirname, '../data');
  const mapping = [
    ['va_industria', 'va_industria_2021.json'],
    ['va_servicos', 'va_servicos_2021.json'],
    ['va_total', 'va_total_2021.json'],
    ['pib_total', 'pib_total_2021.json'],
    ['rebanho_bovino', 'rebanho_bovino_2024.json'],
    ['receita_corrente', 'receita_corrente_2024.json'],
    ['receita_orcamentaria', 'receita_orcamentaria_2024.json'],
    ['receita_transf_correntes', 'receita_transf_correntes_2024.json']
  ];

  console.log('\n📁 Salvando arquivos...');
  mapping.forEach(([key, filename]) => {
    const filePath = path.join(dataPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(results[key], null, 2));
    console.log(`✅ ${filename}`);
  });

  console.log('\n✨ Todos os indicadores processados com sucesso!');
}

processAll();
