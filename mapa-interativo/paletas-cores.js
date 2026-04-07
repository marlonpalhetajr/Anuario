// Paletas de cores para cada categoria baseadas nos mapas existentes
// Extraídas e harmonizadas com as cores oficiais dos mapas do Anuário

const PALETAS_POR_CATEGORIA = {
  // DEMOGRAFIA - Azul (População, Envelhecimento, Razão de Dependência)
  // Baseado em: Demografia_Estimativa_Populacional2025.jpg
  'demografia': {
    colors: ['#E8F4F8', '#A5D8E8', '#5BA5D0', '#2E5F8A', '#0D2F5C'],
    description: 'Tons de Azul',
    label: 'Demografia'
  },
  
  // ECONOMIA - Verde Escuro (Balança Comercial, PIB, Receitas)
  // Baseado em cores de prosperidade econômica
  'economia': {
    colors: ['#E8F5E9', '#A5D88B', '#5FA85F', '#3B7F3F', '#1A4D2E'],
    description: 'Tons de Verde',
    label: 'Economia'
  },
  
  // INFRAESTRUTURA - Laranja/Marrom (Energia, Transporte, Comunicação)
  // Baseado em: cores quentes representando desenvolvimento
  'infraestrutura': {
    colors: ['#FFE8CC', '#FFD9A3', '#FFC070', '#FF9B3D', '#E67E22'],
    description: 'Tons de Laranja',
    label: 'Infraestrutura'
  },
  
  // MEIO AMBIENTE - Verde Florestal (Floresta, Desflorestamento, Focos)
  // Baseado em: cores naturais e ecológicas
  'meio-ambiente': {
    colors: ['#C8E6C9', '#81C784', '#4CAF50', '#2E7D32', '#1B5E20'],
    description: 'Tons de Verde Florestal',
    label: 'Meio Ambiente'
  },
  
  // SOCIAL - Vermelho/Magenta (Saúde, Educação, Segurança)
  // Baseado em cores de urgência e importância social
  'social': {
    colors: ['#F8E8E8', '#E8A5A5', '#D05B5B', '#8A2E2E', '#5C0D0D'],
    description: 'Tons de Vermelho',
    label: 'Social'
  },
  
  // TERRITÓRIO - Amarelo/Marrom (Cartografia, Zoneamento, Geologia)
  // Baseado em cores cartográficas tradicionais
  'territorio': {
    colors: ['#FFF8DC', '#FFE4B5', '#F0D574', '#D4A574', '#8B7355'],
    description: 'Tons de Terra/Marrom',
    label: 'Território'
  }
};

// Função para obter paleta baseada na categoria
function getColorPaletteByCategory(category) {
  const paleta = PALETAS_POR_CATEGORIA[category];
  return paleta ? paleta.colors : PALETAS_POR_CATEGORIA['demografia'].colors;
}

// Função para obter descrição da paleta
function getPaletteDescription(category) {
  const paleta = PALETAS_POR_CATEGORIA[category];
  return paleta ? paleta.description : 'Paleta Padrão';
}

console.log('🎨 Paletas de cores carregadas:', Object.keys(PALETAS_POR_CATEGORIA).length, 'categorias');

