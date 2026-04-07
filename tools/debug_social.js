const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Mapeamento de indicadores Social baseado nos mapas disponíveis
const indicadores = [
  {
    name: 'IDEB Séries Iniciais 2023',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.9 Índice de Desenv da Educ Básica - IDEB - Esc Pública - 5 ano (séries iniciais) - 2015_2017_2019_2021_2023.xlsx',
    year: 2023,
    mapa: 'Social_ideb_series_iniciais2024.jpg'
  },
  {
    name: 'IDEB Séries Finais 2023',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.10 Índice de Desenv da Educ Básica - IDEB - Esc Pública - 9 ano (séries finais) - 2015_2017_2019_2021_2023.xlsx',
    year: 2023,
    mapa: 'Social_ideb_series_finais2024.jpg'
  },
  {
    name: 'Taxa de Aprovação Fundamental 2024',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.1 Taxa de Aprovação no Ensino Fundamental por Dependência Administrativa - 2020 a 2024 ok.xlsx',
    year: 2024,
    mapa: 'Social_tx_aprovacao_fundamental2024.jpg'
  },
  {
    name: 'Taxa de Aprovação Médio 2024',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.2 Taxa de Aprovação no Ensino Médio por Dependência Administrativa - 2020 a 2024 ok.xlsx',
    year: 2024,
    mapa: 'Social_tx_aprovacao_medio2024.jpg'
  },
  {
    name: 'Taxa de Reprovação Fundamental 2024',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.3 Taxa de Reprovação no Ensino Fundamental por Dependência Administrativa - 2020 a 2024 ok.xlsx',
    year: 2024,
    mapa: 'Social_txa_reprovacao_fundamental2024.jpg'
  },
  {
    name: 'Taxa de Reprovação Médio 2024',
    file: 'Tabelas 2025/5. Social/5.1 EDUCAÇÃO     OK/Tab 5.1.4 Taxa de Reprovação no Ensino Médio por Dependência Administrativa - 2020 a 2024 ok.xlsx',
    year: 2024,
    mapa: 'Social_txa_reprovacaomedio2024.jpg'
  },
  {
    name: 'Bolsa Família - Famílias 2024',
    file: 'Tabelas 2025/5. Social/5.2 INCLUSÃO SOCIAL     OK/Tab 5.2.1 Famílias Atendidas e Valor Total Empregado no Programa Bolsa Família - 2020 a 2025.xlsx',
    year: 2024,
    mapa: 'Social_bolsafamilia_familias2024.jpg'
  },
  {
    name: 'Bolsa Família - Valores 2024',
    file: 'Tabelas 2025/5. Social/5.2 INCLUSÃO SOCIAL     OK/Tab 5.2.1 Famílias Atendidas e Valor Total Empregado no Programa Bolsa Família - 2020 a 2025.xlsx',
    year: 2024,
    column: 'Valor',
    mapa: 'Social_bolsafamilia_valores2024.jpg'
  },
  {
    name: 'Taxa de Mortalidade Infantil 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.1 Taxa de Mortalidade Infantil - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_tx_mortalidade_infantil2024.jpg'
  },
  {
    name: 'Taxa de Mortalidade na Infância 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.2 Taxa de Mortalidade na Infância - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_tx_mortalidade_na_infância2024.jpg'
  },
  {
    name: 'Taxa de Natalidade 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.4 Taxa de Natalidade - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_tx_natalidade2024.jpg'
  },
  {
    name: 'Taxa de Mortalidade Geral 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.5 Taxa de Mortalidade Geral - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_txmortalidade_geral2024.jpg'
  },
  {
    name: 'Consultas Pré-natal 2024',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.11 Percentual de Nascidos Vivos com 7 ou Mais Consultas Pré-natal - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_nvconsultaprenatal2024.jpg'
  },
  {
    name: 'Leitos Hospitalares 2025',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.10 Leito Hospitalar por Mil Habitantes - 2021 a 2025.xlsx',
    year: 2025,
    mapa: 'Social_Leitos2025.jpg'
  },
  {
    name: 'Médicos por 10k Hab 2025',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.9 Médicos por 10 Mil Habitantes - 2021 a 2025.xlsx',
    year: 2025,
    mapa: 'Social_Medicos2025.jpg'
  },
  {
    name: 'Postos de Saúde 2025',
    file: 'Tabelas 2025/5. Social/5.5 SAÚDE     OK/Tab 5.5.8 Postos e Centros de Saúde por 10.000 Habitantes - 2021 a 2025.xlsx',
    year: 2025,
    mapa: 'Social_Postos_Centros2025.jpg'
  },
  {
    name: 'Taxa de Homicídio Total 2024',
    file: 'Tabelas 2025/5. Social/5.6 SEGURANÇA     OK/Tab 5.6.1 Taxa de Homicídios Total (DATASUS) por 100.000 habitantes - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_txhomicidiototal_2024.jpg'
  },
  {
    name: 'Taxa de Homicídio Jovens 2024',
    file: 'Tabelas 2025/5. Social/5.6 SEGURANÇA     OK/Tab 5.6.2 Taxa de Homicídios de Jovens (DATASUS) por 100.000 habitantes - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_txhomicidio_jovens2024.jpg'
  },
  {
    name: 'Taxa de Mortes no Trânsito 2024',
    file: 'Tabelas 2025/5. Social/5.6 SEGURANÇA     OK/Tab 5.6.3 Taxa de Mortes no Trânsito (DATASUS) por 100.000 habitantes - 2020 a 2024.xlsx',
    year: 2024,
    mapa: 'Social_Tx_mortes_transito2024.jpg'
  },
  {
    name: 'Vínculos de Emprego 2023',
    file: 'Tabelas 2025/5. Social/5.3 MERCADO DE TRABALHO/won_trab1.xlsx',
    year: 2023,
    mapa: 'Social_vinculos_emprego2023.jpg'
  },
  {
    name: 'Vínculos com Remuneração 2023',
    file: 'Tabelas 2025/5. Social/5.3 MERCADO DE TRABALHO/won_trab2.xlsx',
    year: 2023,
    mapa: 'Social_vinculos_remuneracao2023.jpg'
  }
];

console.log('\n📊 Investigando estrutura das tabelas Social...\n');

indicadores.slice(0, 5).forEach((ind, idx) => {
  try {
    const filePath = ind.file;
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    console.log(`${idx + 1}. ${ind.name}`);
    console.log(`   Arquivo: ${path.basename(filePath)}`);
    console.log(`   Ano procurado: ${ind.year}`);
    console.log(`   Linhas 1-6:`);
    for (let i = 0; i < Math.min(6, data.length); i++) {
      console.log(`     L${i+1}: ${data[i]?.slice(0, 6).join(' | ')}`);
    }
    console.log('');
  } catch (e) {
    console.log(`❌ Erro: ${e.message}\n`);
  }
});
