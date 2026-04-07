const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const indicadores = [
  {
    name: 'IDEB Séries Iniciais 2023',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.9 Índice de Desenv da Educ Básica - IDEB - Esc Pública - 5 ano (séries iniciais) - 2015_2017_2019_2021_2023.xlsx',
    headerRow: 5,
    dataStartRow: 6,
    year: 2023,
    useSubheader: false,
    output: 'data/ideb_series_iniciais_2023.json'
  },
  {
    name: 'IDEB Séries Finais 2023',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.10 Índice de Desenv da Educ Básica - IDEB - Esc Pública - 9 ano (séries finais) - 2015_2017_2019_2021_2023.xlsx',
    headerRow: 5,
    dataStartRow: 6,
    year: 2023,
    useSubheader: false,
    output: 'data/ideb_series_finais_2023.json'
  },
  {
    name: 'Taxa de Aprovação Fundamental 2024',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.1 Taxa de Aprovação no Ensino Fundamental por Dependência Administrativa - 2020 a 2024 ok.xlsx',
    headerRow: 4,
    subHeaderRow: 5,
    dataStartRow: 6,
    year: 2024,
    useSubheader: true,
    column: 'Aprovação',
    output: 'data/taxa_aprovacao_fundamental_2024.json'
  },
  {
    name: 'Taxa de Reprovação Fundamental 2024',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.3 Taxa de Reprovação no Ensino Fundamental por Dependência Administrativa - 2020 a 2024 ok.xlsx',
    headerRow: 4,
    subHeaderRow: 5,
    dataStartRow: 6,
    year: 2024,
    useSubheader: true,
    column: 'Reprovação',
    output: 'data/taxa_reprovacao_fundamental_2024.json'
  },
  {
    name: 'Taxa de Abandono Fundamental 2024',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.5 Taxa de Abandono no Ensino Fundamental por Dependência Administrativa - 2020 a 2024 ok.xlsx',
    headerRow: 4,
    subHeaderRow: 5,
    dataStartRow: 6,
    year: 2024,
    useSubheader: true,
    column: 'Abandono',
    output: 'data/taxa_abandono_fundamental_2024.json'
  },
  {
    name: 'Bolsa Família - Famílias 2024',
    file: 'Tabelas 2025/5. Social/5.2 INCLUSÃO SOCIAL     OK/Tab 5.2.1 Famílias Atendidas e Valor Total Empregado no Programa Bolsa Família - 2020 a 2025.xlsx',
    headerRow: 4,
    subHeaderRow: 5,
    dataStartRow: 6,
    year: 2024,
    useSubheader: true,
    column: 'Famílias',
    output: 'data/bolsa_familia_familias_2024.json'
  },
  {
    name: 'Taxa de Mortalidade Infantil 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.1 Taxa de Mortalidade Infantil - 2020 a 2024.xlsx',
    headerRow: 4,
    dataStartRow: 5,
    year: 2024,
    output: 'data/taxa_mortalidade_infantil_2024.json'
  },
  {
    name: 'Taxa de Mortalidade na Infância 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.2 Taxa de Mortalidade na Infância - 2020 a 2024.xlsx',
    headerRow: 4,
    dataStartRow: 5,
    year: 2024,
    output: 'data/taxa_mortalidade_infancia_2024.json'
  },
  {
    name: 'Taxa de Natalidade 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.4 Taxa de Natalidade - 2020 a 2024.xlsx',
    headerRow: 4,
    dataStartRow: 5,
    year: 2024,
    output: 'data/taxa_natalidade_2024.json'
  },
  {
    name: 'Taxa de Mortalidade Geral 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.5 Taxa de Mortalidade Geral - 2020 a 2024.xlsx',
    headerRow: 4,
    dataStartRow: 5,
    year: 2024,
    output: 'data/taxa_mortalidade_geral_2024.json'
  },
  {
    name: 'Consultas Pré-natal 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.11 Percentual de Nascidos Vivos com 7 ou Mais Consultas Pré-natal - 2020 a 2024.xlsx',
    headerRow: 4,
    dataStartRow: 5,
    year: 2024,
    output: 'data/consultas_prenatal_2024.json'
  },
  {
    name: 'Taxa de Homicídio Total 2024',
    file: 'Tabelas 2025/5. Social/5.6 SEGURANÇA     OK/Tab 5.6.1 Taxa de Homicídios Total (DATASUS) por 100.000 habitantes - 2020 a 2024.xlsx',
    headerRow: 4,
    dataStartRow: 5,
    year: 2024,
    output: 'data/taxa_homicidio_total_2024.json'
  },
  {
    name: 'Taxa de Homicídio Jovens 2024',
    file: 'Tabelas 2025/5. Social/5.6 SEGURANÇA     OK/Tab 5.6.2 Taxa de Homicídios de Jovens (DATASUS) por 100.000 habitantes - 2020 a 2024.xlsx',
    headerRow: 4,
    dataStartRow: 5,
    year: 2024,
    output: 'data/taxa_homicidio_jovens_2024.json'
  }
];

function loadColumnByYear(filePath, year, customColumn, useSubheader, subHeaderRow, headerRowIdx) {
  try {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Usa headerRowIdx se fornecido, senão padrão = 4
    headerRowIdx = headerRowIdx !== undefined ? headerRowIdx : 4;
    const headerLine = data[headerRowIdx];
    let colIdx = -1;
    
    if (useSubheader && subHeaderRow) {
      // Para tabelas com dependência administrativa, precisa de 2 linhas
      const subheaderLine = data[subHeaderRow];
      
      // Procura o ano na linha principal
      let yearIdx = headerLine.indexOf(year);
      if (yearIdx === -1) {
        for (let i = 0; i < headerLine.length; i++) {
          const header = headerLine[i];
          if (typeof header === 'string' && header.includes(year.toString())) {
            yearIdx = i;
            break;
          }
        }
      }
      
      if (yearIdx === -1) {
        throw new Error(`Ano ${year} não encontrado`);
      }
      
      // Procura a coluna específica após o ano encontrado
      if (customColumn) {
        for (let i = yearIdx; i < Math.min(yearIdx + 10, subheaderLine.length); i++) {
          const subheader = subheaderLine[i];
          if (typeof subheader === 'string' && subheader.includes(customColumn)) {
            colIdx = i;
            break;
          }
        }
      } else {
        colIdx = yearIdx;
      }
    } else {
      // Procura pelo ano simples
      colIdx = headerLine.indexOf(year);
      if (colIdx === -1) {
        for (let i = 0; i < headerLine.length; i++) {
          const header = headerLine[i];
          if (typeof header === 'string' && header.includes(year.toString())) {
            colIdx = i;
            break;
          }
        }
      }
    }
    
    if (colIdx === -1) {
      throw new Error(`Coluna não encontrada para ${year} ${customColumn || ''}`);
    }
    
    const out = {};
    const startRow = data[6] ? 6 : 5; // Detecta automaticamente
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[0]) break;
      
      const muni = row[0];
      const raw = row[colIdx];
      
      if (typeof muni === 'string' && muni.trim()) {
        let val = 0;
        if (typeof raw === 'number') {
          val = raw;
        } else if (typeof raw === 'string' && raw.trim() !== '-' && raw.trim() !== '') {
          const parsed = Number(raw.replace(/\./g, '').replace(',', '.'));
          if (!Number.isNaN(parsed)) val = parsed;
        }
        out[muni.trim()] = val;
      }
    }
    return out;
  } catch (e) {
    console.error(`  ❌ Erro: ${e.message}`);
    return {};
  }
}

console.log('👥 Processando Social...\n');

indicadores.forEach((ind, idx) => {
  console.log(`${idx + 1}️⃣ ${ind.name}`);
  
  const filePath = ind.file;
  const result = loadColumnByYear(
    filePath, 
    ind.year, 
    ind.column,
    ind.useSubheader,
    ind.subHeaderRow,
    ind.headerRow
  );
  
  const count = Object.keys(result).length;
  console.log(`   ✓ ${count} municípios`);
  
  // Salva o arquivo
  fs.writeFileSync(ind.output, JSON.stringify(result, null, 2));
});

console.log('\n📁 Salvando arquivos...');
indicadores.forEach(ind => {
  console.log(`✅ ${path.basename(ind.output)}`);
});

console.log('\n✨ Processamento de Social completo!');
