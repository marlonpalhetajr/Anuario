// O JQuery ready function garante que todo o DOM foi carregado antes de executar o script
$(document).ready(function() {
  const demFilter = $("li[data-filter='.demografia']");
  if (demFilter.length) demFilter.click();
});

// IIFE principal do jQuery para carregar o template
(function ($) {
  'use strict';

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs (somente se a lib estiver carregada para evitar quebra)
  if (typeof WOW === 'function') {
    new WOW().init();
  }

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.sticky-top').addClass('shadow-sm').css('top', '0px');
    } else {
      $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
    }
  });

  // Facts counter (só se o plugin estiver disponível)
  if ($.fn.counterUp) {
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 2000,
    });
  }

  // Portfolio isotope and filter (protege quando a lib não está carregada)
  var portfolioIsotope = null;
  if ($.fn.isotope && $('.portfolio-container').length) {
    portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows',
    });

    var $filterItems = $('#portfolio-flters').find('[data-filter]');

    function setActiveFilter($el) {
      $filterItems.removeClass('active btn-success').addClass('btn-outline-success');
      $el.addClass('active btn-success').removeClass('btn-outline-success');
    }

    // Clique dos filtros (suporta buttons ou li)
    $filterItems.on('click', function () {
      var $this = $(this);
      setActiveFilter($this);
      portfolioIsotope.isotope({ filter: $this.data('filter') });
    });

    // Aplica filtro inicial baseado no ativo (default: primeiro se nenhum ativo)
    var $default = $filterItems.filter('.active').first();
    if (!$default.length) {
      $default = $filterItems.first();
      setActiveFilter($default);
    }
    portfolioIsotope.isotope({ filter: $default.data('filter') });
  } else {
    // Fallback simples: mostra/esconde manualmente se Isotope não carregar
    var filterItems = document.querySelectorAll('#portfolio-flters [data-filter]');
    var cards = document.querySelectorAll('.portfolio-item');
    function applyFilter(filter) {
      cards.forEach(function (card) {
        var match = filter === '*' || card.classList.contains(filter.slice(1));
        card.style.display = match ? '' : 'none';
      });
    }
    function setActive(btn) {
      filterItems.forEach(function (b) {
        b.classList.remove('active', 'btn-success');
        b.classList.add('btn-outline-success');
      });
      btn.classList.add('active', 'btn-success');
      btn.classList.remove('btn-outline-success');
    }
    filterItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        setActive(btn);
        applyFilter(filter);
      });
    });
    var defaultBtn = document.querySelector('#portfolio-flters .active') || filterItems[0];
    if (defaultBtn) {
      setActive(defaultBtn);
      applyFilter(defaultBtn.getAttribute('data-filter'));
    }
  }

  // Testimonials carousel (só se Owl Carousel estiver presente)
  if ($.fn.owlCarousel) {
    $('.testimonial-carousel').owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      items: 1,
      dots: false,
      loop: true,
      nav: true,
      navText: [
        '<i class="bi bi-chevron-left"></i>',
        '<i class="bi bi-chevron-right"></i>',
      ],
      
    });
  }

})(jQuery); // Fim da IIFE do JQuery


// --- BLOCOS DE CÓDIGO FORA DO JQUERY ---

// Modal grande para visualizar mapas (DESABILITADO - usar links normais com target="_blank" e download)
(function() {
  'use strict';
  // Função desabilitada - links nos mapas funcionam normalmente
  // O botão olho abre em nova aba e o botão download faz download direto
})();


// Safe pagination helpers (only run if .pagina elements exist)
try {
  let paginaAtual = 0;
  const paginas = document.querySelectorAll('.pagina');
  if (paginas && paginas.length) {
    function mostrarPagina(index) {
      paginas.forEach((pagina, i) => {
        pagina.classList.toggle('pagina-ativa', i === index);
      });
      const contador = document.getElementById('contador-pagina');
      if (contador) contador.innerText = `Página ${index + 1}`;
    }
    function mudarPagina(direcao) {
      paginaAtual += direcao;
      if (paginaAtual < 0) paginaAtual = 0;
      else if (paginaAtual >= paginas.length) paginaAtual = paginas.length - 1;
      mostrarPagina(paginaAtual);
    }
    mostrarPagina(paginaAtual);
    window.mudarPagina = mudarPagina;
  }
} catch(e) {
  console.warn('Pagination helper skipped:', e);
}

// === BOTÃO VOLTAR AO TOPO (DO ZERO) ===
// === BOTÃO VOLTAR AO TOPO ===
(function() {
  'use strict';

  function initBackToTop() {
    var btn = document.getElementById('btnTop');
    if (!btn) return;

    function toggle() {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;
      if (scrolled > 200) btn.classList.add('show');
      else btn.classList.remove('show');
    }

    window.addEventListener('scroll', toggle, { passive: true });

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop);
  } else {
    initBackToTop();
  }
})();

// --- LÓGICA DE TRADUÇÃO (I18N) ---

const translations = {
  pt: {
    nav_fapespa: "FAPESPA",
    menu_home: "Home",
    menu_anuario: "Anuário",
    menu_sobre: "Sobre",
    menu_contato: "Contato",
    menu_idioma: "Idioma",
    btn_apresentacao: "Apresentação",
    btn_sumario: "Sumário",
   btn_sumario_text: "Veja o sumário do Anuário Estatístico do Pará.",
    btn_glossario: "Glossário",
    btn_glossario_text: "Consulte os principais conceitos e definições.",
    btn_expediente: "Expediente",
    btn_expediente_text: "Informações sobre a equipe e produção do anuário.",
    main_title: "Principais Temas",
    tema_demografia_titulo: "Demografia",
    tema_demografia_texto: "Os dados demográficos trazem o total da população, por sexo e faixa etária, além de outros indicadores populacionais.",
    tema_economia_titulo: "Economia",
    tema_economia_texto: "A temática econômica abrange seis grandes subtemas: Agricultura (Lavouras permanente e temporária), Pecuária, Extração Vegetal, PIB, Balança Comercial e Finanças Públicas.",
    tema_infraestrutura_titulo: "Infraestrutura",
    tema_infraestrutura_texto: "A temática de infraestrutura compõe-se de informações sobre frota de veículos, consumidores e consumo de energia elétrica, abastecimento de água e outros serviços.",
    tema_meio_ambiente_titulo: "Meio Ambiente",
    tema_meio_ambiente_texto: "A temática ambiental reúne informações sobre desflorestamento, área de floresta, hidrografia, focos de calor, áreas protegidas e unidades de conservação.",
    tema_social_titulo: "Social",
    tema_social_texto: "A temática social aborda informações e indicadores de seis grandes subtemas: Educação, Inclusão Social, Mercado de Trabalho, Previdência Social, Saúde e Segurança.",
    tema_mapas_titulo: "Mapas",
  tema_mapas_texto: "O Anuário Estatístico do Pará disponibiliza aos seus usuários um conjunto de mapas temáticos com os principais indicadores sociais, econômicos e ambientais do estado.",
    btn_ver_dados: "Ver dados",
    sobre_titulo: "Sobre a FAPESPA e a DETGI",
    sobre_texto: "A FAPESPA tem participação estratégica no modelo de planejamento e governança de políticas públicas do Estado do Pará, promovendo ciência, tecnologia e inovação. A DETGI elabora estudos e análises técnicas que subsidiam a gestão pública e a sociedade, acompanhando indicadores socioeconômicos e ambientais.",
    btn_leia_mais: "Leia Mais",
    downloads_titulo: "Downloads",
  downloads_texto: "Baixe todos os indicadores, tabelas e mapas do Anuário Estatístico do Pará.",
    btn_tabelas: "Tabelas",
    btn_mapas: "Mapas",
    footer_contato_titulo: "Contato",
    footer_endereco: "Av. Presidente Vargas, 670. Belém - PA",
    footer_telefone: "(91) 3323-2550",
    footer_horario: "8h às 14h",
  footer_direitos: "© FAPESPA - Fundação Amazônia de Amparo a Estudos e Pesquisas",
    satisfacao_rating_5: "Muito satisfeito",
    // bloco de feedback removido
    // satisfacao_rating_5 removido
    darkmode_btn_ativar_short: "Tema Escuro",
    darkmode_btn_desativar_short: "Tema Claro",
    darkmode_modal_info: "Você pode ativar ou desativar o Tema Escuro usando o ícone de Lua/Sol na barra de navegação principal.",
    // APRESENTAÇÃO
    apresentacao_titulo: "Apresentação",
    apresentacao_p1: "A Fundação Amazônia de Amparo a Estudos e Pesquisas – FAPESPA disponibiliza em formato digital a 9ª edição do produto Anuário Estatístico do Pará, que proporciona aos seus usuários diversas informações e indicadores para os 144 municípios do estado.",
    apresentacao_p2: "Essa plataforma, estruturada em cinco temáticas (Demografia, Economia, Meio Ambiente, Infraestrutura e Social) insere-se num esforço mais amplo que a Fundação vem buscando de socializar dados, informações e registros administrativos, sobre características do estado do Pará, suas regiões e seus municípios, oferecendo, portanto, uma importante ferramenta auxiliar ao processo decisório para os gestores públicos, o setor privado, a comunidade acadêmica e a sociedade em geral, cumprindo com a missão institucional da FAPESPA de \"Produzir, articular e disseminar conhecimento e informação para subsidiar o planejamento de políticas públicas e do desenvolvimento econômico, social e ambiental do Pará\".",
    apresentacao_p3: "O Anuário Estatístico do Pará 2024 apresenta para todos os municípios do Estado uma série histórica, dos últimos cinco anos, em formato de tabelas, com todas as informações sistematizadas, como também mapas das temáticas trabalhadas e sobre o território paraense. Destaca-se que os dados trabalhados são provenientes de órgãos federais e estaduais, e de algumas empresas privadas, os quais a Fundação agradece pela contribuição que tornou possível a concretização deste projeto.",
    apresentacao_p4: "As informações estatísticas disponibilizadas no Anuário Estatístico do Pará são fundamentais ao processo de tomada de decisão, em especial, o planejamento de políticas públicas. Ao disponibilizar esse produto, a FAPESPA, mais uma vez, atende à constante demanda de informações advindas dos vários segmentos da sociedade e de Governo como um todo.",
    apresentacao_assinatura: "Marcel do Nascimento Botelho",
    apresentacao_cargo: "Diretor-Presidente",
    // DETGI
    detgi_titulo: "Sobre a DETGI - FAPESPA",
    detgi_p1: "A FAPESPA tem participação estratégica no modelo de planejamento e governança de políticas públicas do Estado do Pará, por meio de estudos nas áreas social, ambiental e econômica. Além disso, promove o progresso da ciência e tecnologia com o fomento e amparo à pesquisa, a formação de capital humano qualificado, executando parte da política estadual de Ciência, Tecnologia e Inovação (CT&I).",
    detgi_p2: "A Diretoria de Estatística e de Tecnologia e Gestão da Informação (DETGI) elabora seus produtos em atenção ao Programa Temático Governança Pública, na Ação \"Elaboração e Divulgação de Estudos e Pesquisa\" do PPA 2020-2023. Esses estudos consideram a importância da geração de informações estatísticas consistentes e análises técnicas que subsidiam a gestão pública e a sociedade, realizando o acompanhamento da evolução de diversos indicadores socioeconômicos e ambientais em níveis municipal e regional, o que oriente a decisão e avaliação das políticas públicas e contribui com a macroestratégia e diretrizes da gestão governamental para atingir o objetivo de \"Assegurar a Transparência das Ações de Governo\".",
    detgi_p3: "A produção da DETGI é diversa, ampla e multidisciplinar, o que permite diferentes formas de apropriação de seus produtos e informações. Os produtos finalísticos, em formatos de relatório padronizado e de sistema web, possuem conhecimento explícito, são públicos e seus consumidores são órgãos públicos, acadêmicos, agentes da sociedade civil, imprensa formal e informal e a iniciativa privada. Além dos estudos divulgados, são elaborados produtos ou serviços exclusivos, dedicados ao atendimento específico de demandas internas e externas que geram relatórios, que não são, a priori, disponibilizados ao público, porém servem para consolidar a FAPESPA como órgão de referência em Estatística e Informação.",
    detgi_p4: "O Anuário Estatístico do Pará 2024 apresenta para todos os municípios do Estado uma série histórica, dos últimos cinco anos, em formato de tabelas, com todas as informações sistematizadas, como também mapas das temáticas trabalhadas e sobre o território paraense. Destaca-se que os dados trabalhados são provenientes de órgãos federais e estaduais, e de algumas empresas privadas, aos quais a Fundação agradece pela contribuição que tornou possível a concretização deste projeto.",
    detgi_p5: "A DETGI possui a Coordenadoria de Estatística Econômica e Contas Regionais (CEECR), que é responsável pelo cálculo do PIB do estado do Pará e de seus municípios, além de outros trabalhos relevantes na área econômica; a Coordenadoria de Estatística e Disseminação da Informação (CEDI), que é responsável por este anuário e por outros sistemas web.",
    detgi_p6: "Com isso a DETGI cumpre uma das missões da Fundação, que é \"produzir, articular e disseminar conhecimento e informação para subsidiar o planejamento de políticas públicas e o desenvolvimento econômico, social e ambiental do Pará\".",
    detgi_assinatura: "Atyliana do Socorro Leão Dias",
    detgi_cargo: "Diretora da DETGI",
    // SUMÁRIO e GLOSSÁRIO
    sumario_titulo: "Sumário",
    glossario_titulo: "Glossário",
    expediente_titulo: "Expediente",
    // GLOSSÁRIO
    glossario_intro: "Nesta seção você encontrará definições dos termos técnicos utilizados no Anuário Estatístico do Pará.",
    
    // EXPEDIENTE
    expediente_intro: "Informações sobre a equipe responsável pela produção do Anuário Estatístico do Pará.",
    
    // POLÍTICA DE PRIVACIDADE
    privacidade_titulo: "Política de Privacidade",
    privacidade_atualizacao: "Última atualização: Dezembro de 2024",
    privacidade_intro: "A FAPESPA (Fundação Amazônia de Amparo a Estudos e Pesquisas) está comprometida em proteger a privacidade dos usuários do Anuário Estatístico do Pará. Esta Política de Privacidade descreve como coletamos, usamos e protegemos as informações dos visitantes deste portal.",
  
  },
  en: {
    nav_fapespa: "FAPESPA",
    menu_home: "Home",
    menu_anuario: "Yearbook",
    menu_sobre: "About",
    menu_contato: "Contact",
    menu_idioma: "Language",
    btn_apresentacao: "Presentation",
    btn_sumario: "Summary",
  btn_sumario_text: "See the summary of the Pará Statistical Yearbook.",
    btn_glossario: "Glossary",
    btn_glossario_text: "Consult the main concepts and definitions.",
    btn_expediente: "Staff",
    btn_expediente_text: "Information about the team and yearbook production.",
    main_title: "Main Topics",
    tema_demografia_titulo: "Demography",
    tema_demografia_texto: "Demographic data includes total population, by sex and age group, in addition to other population indicators.",
    tema_economia_titulo: "Economy",
    tema_economia_texto: "The economic theme covers six major sub-themes: Agriculture (permanent and temporary crops), Livestock, Forest/Vegetal Extraction, GDP, Trade Balance, and Public Finances.",
    tema_infraestrutura_titulo: "Infrastructure",
    tema_infraestrutura_texto: "The infrastructure theme includes information on vehicle fleet, energy consumers and consumption, water supply, and related services.",
    tema_meio_ambiente_titulo: "Environment",
    tema_meio_ambiente_texto: "The environmental theme brings information on deforestation, forest area, hydrography, hotspots, protected areas, and conservation units.",
    tema_social_titulo: "Social",
    tema_social_texto: "The social theme addresses information and indicators of six major sub-themes: Education, Social Inclusion, Labor Market, Social Security, Health, and Safety.",
    tema_mapas_titulo: "Maps",
  tema_mapas_texto: "The Pará Statistical Yearbook provides its users with a set of thematic maps with the main social, economic and environmental indicators of the state.",
    btn_ver_dados: "View Data",
    sobre_titulo: "About FAPESPA and DETGI",
    sobre_texto: "FAPESPA plays a strategic role in the state's planning and governance model for public policies, promoting science, technology, and innovation. DETGI prepares technical studies and analyses that support public management and society, monitoring socioeconomic and environmental indicators.",
    btn_leia_mais: "Read More",
    downloads_titulo: "Downloads",
  downloads_texto: "Download all indicators, tables and maps from the Pará Statistical Yearbook.",
    btn_tabelas: "Tables",
    btn_mapas: "Maps",
    footer_contato_titulo: "Contact",
    footer_endereco: "Av. Presidente Vargas, 670. Belém - PA",
    footer_telefone: "+55 (91) 3323-2550",
    footer_horario: "8am to 2pm",
  footer_direitos: "© FAPESPA - Amazon Foundation for Support of Studies and Research",
    // feedback/survey block removed (EN)
    satisfacao_rating_5: "Very satisfied",
    darkmode_btn_ativar_short: "Dark Theme",
    darkmode_btn_desativar_short: "Light Theme",
    darkmode_modal_info: "You can enable or disable the Dark Theme using the Moon/Sun icon in the main navigation bar.",
    // APRESENTAÇÃO → PRESENTATION
    apresentacao_titulo: "Presentation",
    apresentacao_p1: "The Amazon Foundation for Support of Studies and Research - FAPESPA provides in digital format the 9th edition of the Statistical Yearbook of Pará product, which provides its users with various information and indicators for the 144 municipalities in the state.",
    apresentacao_p2: "This platform, structured around five themes (Demography, Economy, Environment, Infrastructure and Social), is part of a broader effort by the Foundation to socialize data, information and administrative records about the characteristics of the state of Pará, its regions and its municipalities, thus offering an important auxiliary tool for decision-making for public managers, the private sector, the academic community and society in general, fulfilling FAPESPA's institutional mission of \"Producing, articulating and disseminating knowledge and information to support the planning of public policies and economic, social and environmental development of Pará\".",
    apresentacao_p3: "The 2024 Pará Statistical Yearbook presents for all municipalities in the State a historical series of the last five years, in table format, with all systematized information, as well as maps of the themes worked on and about Pará territory. It is worth noting that the data worked on come from federal and state agencies, and some private companies, which the Foundation thanks for the contribution that made the completion of this project possible.",
    apresentacao_p4: "The statistical information made available in the Pará Statistical Yearbook is fundamental to the decision-making process, especially for the planning of public policies. By making this product available, FAPESPA once again meets the constant demand for information from various segments of society and Government as a whole.",
    apresentacao_assinatura: "Marcel do Nascimento Botelho",
    apresentacao_cargo: "Executive Director",
    // DETGI
    detgi_titulo: "About DETGI - FAPESPA",
    detgi_p1: "FAPESPA plays a strategic role in the planning and governance model for public policies in the State of Pará, through studies in the social, environmental and economic areas. Furthermore, it promotes progress in science and technology by promoting and supporting research, the formation of qualified human capital, executing part of the state's Science, Technology and Innovation (ST&I) policy.",
    detgi_p2: "The Directorate of Statistics and Technology and Information Management (DETGI) develops its products in accordance with the Public Governance Thematic Program, in the Action \"Preparation and Dissemination of Studies and Research\" of the PPA 2020-2023. These studies consider the importance of generating consistent statistical information and technical analyses that support public management and society, monitoring the evolution of various socioeconomic and environmental indicators at municipal and regional levels, which guide the decision and evaluation of public policies and contributes to the macrostrategy and guidelines of government management to achieve the objective of \"Ensuring Transparency of Government Actions\".",
    detgi_p3: "DETGI's production is diverse, broad and multidisciplinary, which allows different forms of appropriation of its products and information. Finalistic products, in standardized report and web system formats, have explicit knowledge, are public and their consumers are public agencies, academics, civil society agents, formal and informal press and private initiative. In addition to disseminated studies, exclusive products or services are developed, dedicated to meeting specific demands from internal and external sources that generate reports, which are not, a priori, made public, but serve to consolidate FAPESPA as a reference body in Statistics and Information.",
    detgi_p4: "The 2024 Pará Statistical Yearbook presents for all municipalities in the State a historical series of the last five years, in table format, with all systematized information, as well as maps of the themes worked on and about Pará territory. It is worth noting that the data worked on come from federal and state agencies, and some private companies, which the Foundation thanks for the contribution that made the completion of this project possible.",
    detgi_p5: "DETGI has the Directorate of Economic Statistics and Regional Accounts (CEECR), which is responsible for calculating the GDP of the state of Pará and its municipalities, in addition to other relevant work in the economic area; the Directorate of Statistics and Information Dissemination (CEDI), which is responsible for this yearbook and other web systems.",
    detgi_p6: "With this, DETGI fulfills one of the Foundation's missions, which is to \"produce, articulate and disseminate knowledge and information to support the planning of public policies and the economic, social and environmental development of Pará\".",
    detgi_assinatura: "Atyliana do Socorro Leão Dias",
    detgi_cargo: "Director of DETGI",
    // SUMÁRIO e GLOSSÁRIO
    sumario_titulo: "Summary",
    glossario_titulo: "Glossary",
    glossario_intro: "In this section you will find definitions of technical terms used in the Pará Statistical Yearbook.",
    expediente_titulo: "Staff",
    expediente_intro: "Information about the team responsible for producing the Pará Statistical Yearbook.",
    // POLÍTICA DE PRIVACIDADE
    privacidade_titulo: "Privacy Policy",
    privacidade_atualizacao: "Last update: December 2024",
    privacidade_intro: "FAPESPA (Amazon Foundation for Support of Studies and Research) is committed to protecting the privacy of users of the Pará Statistical Yearbook. This Privacy Policy describes how we collect, use and protect the information of visitors to this portal.",

  },
  es: {
    nav_fapespa: "FAPESPA",
    menu_home: "Inicio",
    menu_anuario: "Anuario",
    menu_sobre: "Acerca de",
    menu_contato: "Contacto",
    menu_idioma: "Idioma",
    btn_apresentacao: "Presentación",
    btn_sumario: "Sumario",
  btn_sumario_text: "Vea el sumario del Anuario Estadístico de Pará.",
    btn_glossario: "Glosario",
    btn_glossario_text: "Consulte los principales conceptos y definiciones.",
    btn_expediente: "Expediente",
    btn_expediente_text: "Información sobre el equipo y la producción del anuario.",
    main_title: "Temas Principales",
    tema_demografia_titulo: "Demografía",
    tema_demografia_texto: "Los datos demográficos incluyen la población total, por sexo y grupo de edad, además de otros indicadores poblacionales.",
    tema_economia_titulo: "Economía",
    tema_economia_texto: "La temática económica abarca seis grandes subtemas: Agricultura (cultivos permanentes y temporales), Ganadería, Extracción Forestal/Vegetal, PIB, Balanza Comercial y Finanzas Públicas.",
    tema_infraestrutura_titulo: "Infraestructura",
    tema_infraestrutura_texto: "La temática de infraestructura incluye información sobre flota de vehículos, consumidores y consumo de energía eléctrica, abastecimiento de agua y servicios relacionados.",
    tema_meio_ambiente_titulo: "Medio Ambiente",
    tema_meio_ambiente_texto: "La temática ambiental reúne información sobre deforestación, área forestal, hidrografía, focos de calor, áreas protegidas y unidades de conservación.",
    tema_social_titulo: "Social",
    tema_social_texto: "La temática social aborda información e indicadores de seis grandes subtemas: Educación, Inclusión Social, Mercado Laboral, Previsión Social, Salud y Seguridad.",
    tema_mapas_titulo: "Mapas",
  tema_mapas_texto: "El Anuario Estadístico de Pará pone a disposición de sus usuarios un conjunto de mapas temáticos con los principales indicadores sociales, económicos y ambientales del estado.",
    btn_ver_dados: "Ver Datos",
    sobre_titulo: "Sobre la FAPESPA y la DETGI",
    sobre_texto: "FAPESPA tiene una participación estratégica en el modelo de planificación y gobernanza de políticas públicas del Estado de Pará, promoviendo ciencia, tecnología e innovación. La DETGI elabora estudios y análisis técnicos que subsidian la gestión pública y la sociedad, acompañando indicadores socioeconómicos y ambientales.",
    btn_leia_mais: "Leer Más",
    downloads_titulo: "Descargas",
  downloads_texto: "Descargue todos los indicadores, tablas y mapas del Anuario Estadístico de Pará.",
    btn_tabelas: "Tablas",
    btn_mapas: "Mapas",
    footer_contato_titulo: "Contacto",
    footer_endereco: "Av. Presidente Vargas, 670. Belém - PA",
    footer_telefone: "+55 (91) 3323-2550",
    footer_horario: "8h a 14h",
  footer_direitos: "© FAPESPA - Fundación Amazonia de Apoyo a Estudios e Investigaciones",
    satisfacao_rating_5: "Muy satisfecho",
    // bloque de feedback/encuesta removido (ES)
    darkmode_btn_ativar_short: "Tema Oscuro",
    darkmode_btn_desativar_short: "Tema Claro",
    darkmode_modal_info: "Puede activar o desactivar el Tema Oscuro utilizando el icono de Luna/Sol en la barra de navegación principal.",
    // APRESENTACIÓN
    apresentacao_titulo: "Presentación",
    apresentacao_p1: "La Fundación Amazonia de Apoyo a Estudios e Investigaciones - FAPESPA pone a disposición en formato digital la 9ª edición del producto Anuario Estadístico del Pará, que proporciona a sus usuarios diversa información e indicadores para los 144 municipios del estado.",
    apresentacao_p2: "Esta plataforma, estructurada en cinco temáticas (Demografía, Economía, Medio Ambiente, Infraestructura y Social), es parte de un esfuerzo más amplio que la Fundación ha buscado para socializar datos, información y registros administrativos sobre características del estado del Pará, sus regiones y municipios, ofreciendo así una herramienta auxiliar importante para la toma de decisiones de gestores públicos, el sector privado, la comunidad académica y la sociedad en general, cumpliendo con la misión institucional de FAPESPA de \"Producir, articular y difundir conocimiento e información para apoyar la planificación de políticas públicas y el desarrollo económico, social y ambiental del Pará\".",
    apresentacao_p3: "El Anuario Estadístico del Pará 2024 presenta para todos los municipios del Estado una serie histórica de los últimos cinco años, en formato de tablas, con toda la información sistematizada, así como mapas de los temas trabajados y del territorio paraense. Es de destacar que los datos trabajados provienen de organismos federales y estatales, y de algunas empresas privadas, a las cuales la Fundación agradece por la contribución que hizo posible la realización de este proyecto.",
    apresentacao_p4: "La información estadística disponible en el Anuario Estadístico del Pará es fundamental para el proceso de toma de decisiones, especialmente para la planificación de políticas públicas. Al poner este producto a disposición, FAPESPA una vez más responde a la constante demanda de información de varios segmentos de la sociedad y del Gobierno en su conjunto.",
    apresentacao_assinatura: "Marcel do Nascimento Botelho",
    apresentacao_cargo: "Director Ejecutivo",
    // DETGI
    detgi_titulo: "Sobre DETGI - FAPESPA",
    detgi_p1: "FAPESPA juega un papel estratégico en el modelo de planificación y gobernanza de políticas públicas en el Estado del Pará, a través de estudios en las áreas social, ambiental y económica. Además, promueve el progreso en ciencia y tecnología promoviendo y apoyando la investigación, la formación de capital humano calificado, ejecutando parte de la política de Ciencia, Tecnología e Innovación (CT&I) del estado.",
    detgi_p2: "La Dirección de Estadística y Tecnología y Gestión de la Información (DETGI) desarrolla sus productos de acuerdo con el Programa Temático de Gobernanza Pública, en la Acción \"Elaboración y Difusión de Estudios e Investigación\" del PPA 2020-2023. Estos estudios consideran la importancia de generar información estadística consistente y análisis técnicos que apoyen la gestión pública y la sociedad, monitoreando la evolución de varios indicadores socioeconómicos y ambientales a nivel municipal y regional, que guíen la decisión y evaluación de políticas públicas y contribuyan a la macroestructura y directrices de la gestión gubernamental para lograr el objetivo de \"Garantizar la Transparencia de las Acciones del Gobierno\".",
    detgi_p3: "La producción de DETGI es diversa, amplia y multidisciplinaria, lo que permite diferentes formas de apropiación de sus productos e información. Los productos finalísticos, en formatos de informes estandarizados y sistemas web, poseen conocimiento explícito, son públicos y sus consumidores son agencias públicas, académicos, agentes de la sociedad civil, prensa formal e informal e iniciativa privada. Además de estudios divulgados, se desarrollan productos o servicios exclusivos, dedicados a cumplir demandas específicas de fuentes internas y externas que generan informes, que no son, a priori, públicos, pero sirven para consolidar a FAPESPA como organismo de referencia en Estadística e Información.",
    detgi_p4: "El Anuario Estadístico del Pará 2024 presenta para todos los municipios del Estado una serie histórica de los últimos cinco años, en formato de tablas, con toda la información sistematizada, así como mapas de los temas trabajados y del territorio paraense. Es de destacar que los datos trabajados provienen de organismos federales y estatales, y de algunas empresas privadas, a las cuales la Fundación agradece por la contribución que hizo posible la realización de este proyecto.",
    detgi_p5: "DETGI cuenta con la Coordinación de Estadística Económica y Cuentas Regionales (CEECR), responsable de calcular el PIB del estado del Pará y sus municipios, además de otros trabajos relevantes en el área económica; la Coordinación de Estadística y Difusión de Información (CEDI), responsable de este anuario y otros sistemas web.",
    detgi_p6: "Con esto, DETGI cumple una de las misiones de la Fundación, que es \"producir, articular y difundir conocimiento e información para apoyar la planificación de políticas públicas y el desarrollo económico, social y ambiental del Pará\".",
    detgi_assinatura: "Atyliana do Socorro Leão Dias",
    detgi_cargo: "Directora de DETGI",
    // SUMÁRIO e GLOSSÁRIO
    sumario_titulo: "Sumario",
    glossario_titulo: "Glosario",
    glossario_intro: "En esta sección encontrará definiciones de términos técnicos utilizados en el Anuario Estadístico del Pará.",
    expediente_titulo: "Equipo",
    expediente_intro: "Información sobre el equipo responsable de la producción del Anuario Estadístico del Pará.",
    // POLÍTICA DE PRIVACIDADE
    privacidade_titulo: "Política de Privacidad",
    privacidade_atualizacao: "Última actualización: Diciembre 2024",
    privacidade_intro: "FAPESPA (Fundación Amazonia de Apoyo a Estudios e Investigaciones) se compromete a proteger la privacidad de los usuarios del Anuario Estadístico del Pará. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información de los visitantes de este portal.",

  }
};


function changeLanguage(lang) {
  try {
    document.documentElement.setAttribute('lang', lang);
  } catch (e) { /* ignore */ }
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Suporte para placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    localStorage.setItem("lang", lang);
}
// Feedback queue removed
    function openIDB() { return Promise.reject(new Error('Feedback disabled')); }
    function idbAddFeedback() { return Promise.resolve(false); }
    function idbGetAllFeedbacks() { return Promise.resolve([]); }
    function idbClearFeedbacks() { return Promise.resolve(true); }
    function enqueueFeedback() { /* no-op */ }

    async function processFeedbackQueue() { /* no-op */ }

    // attempt to resend queued feedback on load and when coming online
    // Feedback DOM hooks removed

    // Bootstrap-aware toast helper (prefers Bootstrap Toast if available)
    function showToast(message, type = 'success', timeout = 4000) {
      try {
        // If Bootstrap Toast is available, use it for consistent styling
        if (window.bootstrap && bootstrap.Toast) {
          const toastId = `site-toast-${Date.now()}`;
          const wrapper = document.createElement('div');
          wrapper.innerHTML = `\n        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'danger'} border-0" role="alert" aria-live="assertive" aria-atomic="true">\n          <div class="d-flex">\n            <div class="toast-body">${message}</div>\n            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>\n          </div>\n        </div>\n      `;
          let container = document.getElementById('bootstrap-toast-container');
          if (!container) {
            container = document.createElement('div');
            container.id = 'bootstrap-toast-container';
            container.className = 'position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = 200000;
            document.body.appendChild(container);
          }
          container.appendChild(wrapper.firstElementChild);
          const toastEl = container.lastElementChild;
          const t = new bootstrap.Toast(toastEl, { delay: timeout });
          t.show();
          // cleanup after hidden
          toastEl.addEventListener('hidden.bs.toast', () => { try { container.removeChild(toastEl); } catch (e) {} });
          return;
        }

        // Fallback simple toast
        const containerId = 'site-toast-container';
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.style.position = 'fixed';
          container.style.right = '20px';
          container.style.bottom = '20px';
          container.style.zIndex = 200000;
          document.body.appendChild(container);
        }
        const el = document.createElement('div');
        el.className = `toast-msg toast-${type}`;
        el.style.background = (type === 'success') ? '#198754' : (type === 'warning') ? '#ffc107' : '#dc3545';
        el.style.color = '#fff';
        el.style.padding = '10px 14px';
        el.style.marginTop = '8px';
        el.style.borderRadius = '6px';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
        el.textContent = message;
        container.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 300ms'; }, timeout - 300);
        setTimeout(() => { try { container.removeChild(el); } catch (e) {} }, timeout + 200);
      } catch (e) { console.warn('Erro mostrando toast', e); }
    }

function submitFeedbackFromModal() { /* feedback disabled */ }

async function sendFeedback() { return false; }
// (enqueue/process functions replaced above with IndexedDB-aware implementations)

// --- Feedback helpers (ensure functions/vars used elsewhere exist) ---
// current rating (global so other handlers can read it)
var __currentFeedbackRating = 0;

function getFeedbackFormData() {
  try {
    const form = document.getElementById('feedbackForm');
    if (!form) return {};
    return {
      nome: (document.getElementById('feedback_nome') && document.getElementById('feedback_nome').value) ? document.getElementById('feedback_nome').value.trim() : '',
      sobrenome: (document.getElementById('feedback_sobrenome') && document.getElementById('feedback_sobrenome').value) ? document.getElementById('feedback_sobrenome').value.trim() : '',
      contato: (document.getElementById('feedback_contato') && document.getElementById('feedback_contato').value) ? document.getElementById('feedback_contato').value.trim() : '',
      mensagem: (document.getElementById('feedback_mensagem') && document.getElementById('feedback_mensagem').value) ? document.getElementById('feedback_mensagem').value.trim() : ''
    };
  } catch (e) {
    console.warn('getFeedbackFormData error', e);
    return {};
  }
}

function initializeFeedbackAndSatisfaction() { /* feedback disabled */ }

// LÓGICA DE DARK MODE (GLOBAL)
// ===============================================================

// Função única e consolidada para atualizar o ícone/texto do botão Dark Mode
function updateDarkModeIcon(isDark) {
  const toggleLink = document.getElementById('darkModeToggleNav');
  if (!toggleLink) return;
  const icon = toggleLink.querySelector('i');
  const textSpan = toggleLink.querySelector('.d-lg-none');
  const lang = localStorage.getItem("lang") || "pt";

  if (icon) {
    // remove classes possíveis e aplica a desejada
    icon.classList.remove('bi-moon-fill', 'bi-sun-fill', 'bi-moon-stars-fill');
    if (isDark) icon.classList.add('bi-sun-fill');
    else icon.classList.add('bi-moon-fill');
  }

  if (textSpan) {
    const key = isDark ? 'darkmode_btn_desativar_short' : 'darkmode_btn_ativar_short';
    textSpan.textContent = (translations[lang] && translations[lang][key]) ? translations[lang][key] : (isDark ? 'Tema Claro' : 'Tema Escuro');
  }
}


// ===============================================================
// INICIALIZAÇÃO E EVENTOS GLOBAIS (FINAL DO MAIN.JS)
// ===============================================================

// (função de ícone consolidada acima)
   // === DROPDOWN DE ACESSIBILIDADE ===
function toggleAccessibilityMenu(event) {
    event.preventDefault();
    const menu = document.getElementById('acessibilidadeMenu');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'block';
        // Fechar ao clicar fora
        document.addEventListener('click', closeAccessibilityMenuOnClickOutside);
    } else {
        menu.style.display = 'none';
        document.removeEventListener('click', closeAccessibilityMenuOnClickOutside);
    }
}

function closeAccessibilityMenuOnClickOutside(event) {
    const menu = document.getElementById('acessibilidadeMenu');
    const btn = document.getElementById('acess-open-btn');
    
    if (!menu.contains(event.target) && event.target !== btn && !btn.contains(event.target)) {
        menu.style.display = 'none';
        document.removeEventListener('click', closeAccessibilityMenuOnClickOutside);
    }
}

// === MODAL CUSTOMIZADO FLUTUANTE ===
function openCustomModal(event) {
    event.preventDefault();
    const trigger = event.currentTarget;
    
    const modal = document.getElementById("contentModal");
    const backdrop = document.getElementById("modalBackdrop");
    const modalBody = document.getElementById("contentModalBody");
    const modalTitle = document.getElementById("contentModalLabel");
    const modalOpenFull = document.getElementById("modal-open-full");

    if (!modal || !modalBody || !modalTitle || !modalOpenFull) {
        return;
    }

    const url = trigger.getAttribute("data-content-url");
    const title = trigger.getAttribute("data-modal-title");

    if (!url || !title) {
        return;
    }

    modalTitle.textContent = '';
    modalOpenFull.href = url;
    modalBody.innerHTML = `<iframe src="${url}" loading="eager"></iframe>`;

    const iframe = modalBody.querySelector('iframe');
    if (iframe) {
      // Harmoniza aparência do conteúdo carregado no iframe (mesmo domínio)
      iframe.addEventListener('load', function () {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (!doc) return;

          const style = doc.createElement('style');
          style.textContent = `
            html, body { margin:0; padding:0; background:#fff; color:#222; font-family:'Open Sans', Arial, sans-serif; font-size:16px; line-height:1.6; }
            header, nav, footer, .header, .topbar, .rodape, #topo, #menu { display:none !important; }
            main, #corpo, .content, .container, body { max-width: 860px; margin: 0 auto !important; padding: 20px 24px !important; box-sizing: border-box; }
            h1 { font-size: 1.75rem; color:#163b6b; margin: 0 0 1rem; font-weight: 800; }
            h2 { font-size: 1.4rem; color:#163b6b; margin: 1.25rem 0 .75rem; font-weight: 700; }
            h3 { font-size: 1.2rem; color:#163b6b; margin: 1rem 0 .5rem; font-weight: 700; }
            p, li { font-size: 1rem; }
            a { color:#2d6a47; text-decoration: underline; text-underline-offset: 2px; }
            img, iframe, table { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #e5e5e5; padding: 6px 8px; }
          `;
          doc.head.appendChild(style);

          // Ajusta altura do iframe ao conteúdo e dimensiona o modal
          const resizeToContent = () => {
            try {
              const h1 = doc.body ? doc.body.scrollHeight : 0;
              const h2 = doc.documentElement ? doc.documentElement.scrollHeight : 0;
              const contentHeight = Math.max(h1, h2);

              const header = modal.querySelector('.custom-modal-header');
              const footer = modal.querySelector('.custom-modal-footer');
              const headerH = header ? header.offsetHeight : 0;
              const footerH = footer ? footer.offsetHeight : 0;

              const margin = 40; // margem total vertical
              const maxModalH = Math.max(200, window.innerHeight - margin);
              const availableBodyH = Math.max(120, maxModalH - headerH - footerH);

              // altura final do iframe: cabe sem scroll se possível
              const finalIframeH = Math.min(contentHeight + 1, availableBodyH);
              iframe.style.height = finalIframeH + 'px';

              // define max-height do modal e controle de overflow do body
              modal.style.maxHeight = maxModalH + 'px';
              if (contentHeight <= availableBodyH) {
                modalBody.style.overflow = 'hidden';
              } else {
                modalBody.style.overflow = 'auto';
              }
            } catch (_) {}
          };
          resizeToContent();
          setTimeout(resizeToContent, 50);
          setTimeout(resizeToContent, 250);
          window.addEventListener('resize', resizeToContent, { passive: true });
        } catch (e) {
          console.warn('Não foi possível harmonizar o conteúdo do iframe:', e);
        }
      }, { once: true });
    }
    
    // Centralização e exibição — CSS já centraliza via translate(-50%, -50%)
    
    // Mostrar backdrop e modal
    backdrop.style.display = "block";
    modal.style.display = "block";
}

function closeCustomModal() {
    const modal = document.getElementById("contentModal");
    const backdrop = document.getElementById("modalBackdrop");
    
    if (modal) modal.style.display = "none";
    if (backdrop) backdrop.style.display = "none";
}

    // === CORREÇÃO DA PESQUISA DE SATISFAÇÃO (REMOVER {once: true}) === 
    // Garante que o feedback seja inicializado TODAS AS VEZES que o modal for aberto.
    // feedback modal hooks removed
 // Fim do DOMContentLoaded

function updatePlaceholders(lang) {
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}
/* Accessibility modal initializer
   Wires the floating accessibility button to open/close the custom modal (#acess-modal).
   Adds ESC-to-close and a simple focus trap while modal is open. Idempotent attachment.
*/
function initializeAccessibilityModal() {
  try {
    const openBtn = document.getElementById('acess-open-btn');
    const modal = document.getElementById('acess-modal');
    const closeBtn = document.getElementById('acess-close-btn');
    const announcer = document.getElementById('acess-announcer');
    if (!openBtn || !modal) return;

    // store references to avoid duplicate listeners
    if (openBtn._a11yInit) return;
    openBtn._a11yInit = true;

    let previouslyFocused = null;
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let focusable = [];
    let firstFocusable = null;
    let lastFocusable = null;

    function refreshFocusable() {
      focusable = Array.from(modal.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
      firstFocusable = focusable[0] || modal;
      lastFocusable = focusable[focusable.length - 1] || modal;
    }

    function openModal() {
      previouslyFocused = document.activeElement;
      modal.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      modal.style.display = 'block';
      modal.classList.add('a11y-open');
      refreshFocusable();
      // focus the modal panel or first focusable element
      (firstFocusable || modal).focus();
      // announce
      try { if (announcer) announcer.textContent = 'Painel de acessibilidade aberto'; } catch(e){}
      document.addEventListener('keydown', handleKeydown);
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      modal.style.display = 'none';
      modal.classList.remove('a11y-open');
      // restore focus
      try { if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); } catch(e){}
      try { if (announcer) announcer.textContent = 'Painel de acessibilidade fechado'; } catch(e){}
      document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
      if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); closeModal(); return; }

      // simple focus trap
      if (e.key === 'Tab') {
        refreshFocusable();
        if (focusable.length === 0) { e.preventDefault(); return; }
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === firstFocusable || active === modal) {
            e.preventDefault(); lastFocusable.focus();
          }
        } else {
          if (active === lastFocusable) {
            e.preventDefault(); firstFocusable.focus();
          }
        }
      }
    }

    // Attach handlers idempotently
    openBtn.addEventListener('click', (ev) => { ev && ev.preventDefault(); openModal(); });
    if (closeBtn) closeBtn.addEventListener('click', (ev) => { ev && ev.preventDefault(); closeModal(); });

    // Close when clicking outside panel (optional) — ensure click target is the modal backdrop
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) closeModal();
    });

  } catch (e) { console.warn('initializeAccessibilityModal error', e); }
}

document.addEventListener('DOMContentLoaded', initializeAccessibilityModal);
document.addEventListener("DOMContentLoaded", () => {

    const savedLang = localStorage.getItem("lang") || "pt";

    // aplica idioma ao abrir
    changeLanguage(savedLang);
    updatePlaceholders(savedLang);

    // troca idioma ao clicar no menu
    document.querySelectorAll(".lang-option").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;

            changeLanguage(lang);
            updatePlaceholders(lang);

            localStorage.setItem("lang", lang);
        });
    });
});

// ============ A11Y: JavaScript (migrado de index.html) ============
/*
  A11Y Controller v2
  - Integra com ETAPA1 HTML e ETAPA2 CSS
  - Persiste em localStorage (KEY)
  - Implementa: TTS, Zoom, Fonte, Espaçamento, Daltonismo (SVG filters), Dislexia, Reading Guide,
    Reduzir Movimento, Highlight Links/Buttons, Focus, Virtual Keyboard, Reading Mode, Reset.
*/
document.addEventListener('DOMContentLoaded', function() {
(function () {
  'use strict';

  /* -------------------------
     Config / Selectors
     ------------------------- */
  const KEY = 'fapespa_a11y_v2';
  const DEFAULT = {
    contrast: false,
    night: false,
    grayscale: false,
    fontScale: 1,
    zoom: 1,
    spacing: 1,
    dalton: 'off', // 'prot'|'deut'|'trit'|'off'
    dyslexia: false,
    readingMode: false,
    reducedMotion: false,
    highlightLinks: false,
    highlightButtons: false,
    focusVisible: false,
    largeCursor: false
  };

  // Buttons / elements (IDs from ETAPA1)
  const els = {
    announcer: document.getElementById('acess-announcer'),

    // TTS
    ttsRead: document.getElementById('tts-read'),
    ttsSelection: document.getElementById('tts-selection'),
    ttsStop: document.getElementById('tts-stop'),

    // Vision
    contrast: document.getElementById('acess-contrast'),
    night: document.getElementById('acess-night'),
    grayscale: document.getElementById('acess-grayscale'),

    // Font
    fontInc: document.getElementById('font-inc'),
    fontDec: document.getElementById('font-dec'),
    fontReset: document.getElementById('font-reset'),

    // Zoom
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    zoomReset: document.getElementById('zoom-reset'),

    // Spacing
    spaceInc: document.getElementById('space-inc'),
    spaceDec: document.getElementById('space-dec'),
    spaceReset: document.getElementById('space-reset'),

    // Daltonism
    daltonProt: document.getElementById('dalton-prot'),
    daltonDeut: document.getElementById('dalton-deut'),
    daltonTrit: document.getElementById('dalton-trit'),
    daltonOff: document.getElementById('dalton-off'),

    // Reading / Legibility
    dyslexia: document.getElementById('acess-dislexia'),
    readingMode: document.getElementById('acess-reading'),
    highlightLinks: document.getElementById('acess-links'),
    highlightButtons: document.getElementById('acess-buttons'),
    focusToggle: document.getElementById('acess-focus'),

    // Motion
    reduceMotion: document.getElementById('reduce-motion'),

    // Reset all
    resetAll: document.getElementById('acess-reset')
  };

  /* -------------------------
     State handling
     ------------------------- */
  function loadState() {
    // Não carregar configurações salvas - sempre começar com padrão
    return Object.assign({}, DEFAULT);
  }
  function saveState(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }
  let state = loadState();
  // força zoom padrão em 100% ao carregar
  if (!state || typeof state.zoom === 'undefined' || state.zoom < 1) {
    state = Object.assign({}, DEFAULT, { zoom: 1 });
  }

  /* -------------------------
     Apply state to DOM
     ------------------------- */
  function applyState() {
    // classes on <html>
    const root = document.documentElement;
    root.classList.toggle('a11y-contrast', !!state.contrast);
    root.classList.toggle('a11y-night', !!state.night);
    root.classList.toggle('a11y-grayscale', !!state.grayscale);
    root.classList.toggle('a11y-dyslexia', !!state.dyslexia);
    root.classList.toggle('a11y-reading-mode', !!state.readingMode);
    root.classList.toggle('a11y-reduced-motion', !!state.reducedMotion);
    root.classList.toggle('a11y-highlight-links', !!state.highlightLinks);
    root.classList.toggle('a11y-highlight-buttons', !!state.highlightButtons);
    root.classList.toggle('a11y-focus', !!state.focusVisible);
    root.classList.toggle('a11y-large-cursor', !!state.largeCursor);
    // dalton classes
    root.classList.remove('a11y-dalton-prot','a11y-dalton-deut','a11y-dalton-trit');
    if (state.dalton === 'prot') root.classList.add('a11y-dalton-prot');
    if (state.dalton === 'deut') root.classList.add('a11y-dalton-deut');
    if (state.dalton === 'trit') root.classList.add('a11y-dalton-trit');

    // CSS variables for font & zoom & spacing
    const fontScale = Number(state.fontScale) || 1;
    const zoom = Math.max(1, Number(state.zoom) || 1);
    const spacing = Number(state.spacing) || 1;
    root.style.setProperty('--a11y-font-scale', fontScale);
    root.style.setProperty('--a11y-zoom', zoom);
    root.style.setProperty('--a11y-lineheight', spacing * 1.55);
    root.style.setProperty('--a11y-paragraph-space', (spacing * 1.0) + 'rem');

    // Update button aria-pressed where possible
    if (els.contrast) els.contrast.setAttribute('aria-pressed', state.contrast ? 'true':'false');
    if (els.night) els.night.setAttribute('aria-pressed', state.night ? 'true':'false');
    if (els.dyslexia) els.dyslexia.setAttribute('aria-pressed', state.dyslexia ? 'true':'false');
    if (els.readingMode) els.readingMode.setAttribute('aria-pressed', state.readingMode ? 'true':'false');

    // Announce change
    announce('Preferências atualizadas.');
  }

  /* -------------------------
     Announcer (aria-live)
     ------------------------- */
  function announce(msg) {
    try {
      if (els.announcer) {
        els.announcer.textContent = '';
        // small delay to ensure screen-readers see change
        setTimeout(()=> { els.announcer.textContent = msg; }, 50);
      }
    } catch (e) { /* ignore */ }
  }

  // Modal now uses Bootstrap - no custom JS needed

  /* -------------------------
     TTS (Web Speech API)
     ------------------------- */
  const speech = {
    synth: window.speechSynthesis || null,
    utter: null,
    speaking: false
  };

  function speak(text, lang='pt-BR') {
    if (!speech.synth) { announce('Leitura não suportada neste navegador.'); return; }
    stopSpeak();
    try {
      speech.utter = new SpeechSynthesisUtterance(text);
      speech.utter.lang = lang;
      speech.utter.rate = 1;
      speech.utter.pitch = 1;
      speech.utter.onend = () => { speech.speaking = false; announce('Leitura finalizada.'); };
      speech.synth.speak(speech.utter);
      speech.speaking = true;
      announce('Leitura iniciada.');
    } catch (e) {
      console.warn('TTS error', e);
      announce('Erro ao iniciar leitura.');
    }
  }
  function stopSpeak() {
    try {
      if (speech.synth && speech.synth.speaking) {
        speech.synth.cancel();
        speech.speaking = false;
        announce('Leitura interrompida.');
      }
    } catch (e) { /* ignore */ }
  }

  // wire TTS buttons
  if (els.ttsRead) els.ttsRead.addEventListener('click', function(){
    // read meaningful text: prefer main or body text
    const main = document.querySelector('main') || document.body;
    // strip scripts and nav, get visible text
    const text = [...main.querySelectorAll('p, h1, h2, h3, li')].map(n => n.textContent.trim()).filter(Boolean).join('. ');
    speak(text || document.body.textContent.trim().slice(0, 2000));
  });
  if (els.ttsSelection) els.ttsSelection.addEventListener('click', function(){
    const sel = window.getSelection().toString().trim();
    if (sel) speak(sel);
    else announce('Nenhum texto selecionado. Seleciona o texto que quer ler e tente novamente.');
  });
  if (els.ttsStop) els.ttsStop.addEventListener('click', stopSpeak);

  /* -------------------------
     Font scaling / Zoom / Spacing
     ------------------------- */
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function setFontScale(scale) {
    state.fontScale = clamp(Math.round(scale*100)/100, 0.75, 1.6);
    saveState(state); applyState();
  }
  function setZoom(z) {
    state.zoom = clamp(Math.round(z*100)/100, 1, 1.6);
    saveState(state); applyState();
  }
  function setSpacing(s) {
    state.spacing = clamp(Math.round(s*100)/100, 0.8, 2.4);
    saveState(state); applyState();
  }

  // wire font buttons
  els.fontInc && els.fontInc.addEventListener('click', ()=> setFontScale((state.fontScale || 1) + 0.1));
  els.fontDec && els.fontDec.addEventListener('click', ()=> setFontScale((state.fontScale || 1) - 0.1));
  els.fontReset && els.fontReset.addEventListener('click', ()=> setFontScale(1));

  // zoom
  els.zoomIn && els.zoomIn.addEventListener('click', ()=> setZoom((state.zoom || 1) + 0.1));
  els.zoomOut && els.zoomOut.addEventListener('click', ()=> setZoom((state.zoom || 1) - 0.1));
  els.zoomReset && els.zoomReset.addEventListener('click', ()=> setZoom(1));

  // spacing
  els.spaceInc && els.spaceInc.addEventListener('click', ()=> setSpacing((state.spacing || 1) + 0.1));
  els.spaceDec && els.spaceDec.addEventListener('click', ()=> setSpacing((state.spacing || 1) - 0.1));
  els.spaceReset && els.spaceReset.addEventListener('click', ()=> setSpacing(1));

  /* -------------------------
     Vision toggles
     ------------------------- */
  els.contrast && els.contrast.addEventListener('click', function(){
    state.contrast = !state.contrast; saveState(state); applyState();
  });
  els.night && els.night.addEventListener('click', function(){
    state.night = !state.night; saveState(state); applyState();
  });
  els.grayscale && els.grayscale.addEventListener('click', function(){
    state.grayscale = !state.grayscale; saveState(state); applyState();
  });

  /* -------------------------
     Daltonism: inject SVG filters + toggle
     ------------------------- */
  function injectSVGFilters() {
    if (document.getElementById('a11y-dalton-svg')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('id','a11y-dalton-svg');
    svg.setAttribute('style','position:absolute;width:0;height:0;overflow:hidden;');
    svg.innerHTML = `
      <defs>
        <!-- Protanopia approximation -->
        <filter id="protanopia"><feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/></filter>
        <!-- Deuteranopia approximation -->
        <filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/></filter>
        <!-- Tritanopia approximation -->
        <filter id="tritanopia"><feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/></filter>
      </defs>
    `;
    document.body.appendChild(svg);
  }

  injectSVGFilters(); // ensure present

  function setDalton(mode) {
    state.dalton = (mode === 'off') ? 'off' : mode;
    saveState(state); applyState();
    announce(mode === 'off' ? 'Filtro de daltonismo desativado.' : `Filtro de daltonismo ${mode} ativado.`);
  }
  els.daltonProt && els.daltonProt.addEventListener('click', ()=> setDalton('prot'));
  els.daltonDeut && els.daltonDeut.addEventListener('click', ()=> setDalton('deut'));
  els.daltonTrit && els.daltonTrit.addEventListener('click', ()=> setDalton('trit'));
  els.daltonOff && els.daltonOff.addEventListener('click', ()=> setDalton('off'));

  /* -------------------------
     Dyslexia & Reading Guide
     ------------------------- */
  let readingGuide = null;
  function createReadingGuide() {
    if (readingGuide) return;
    readingGuide = document.createElement('div');
    readingGuide.className = 'a11y-reading-guide';
    readingGuide.style.display = 'none';
    document.body.appendChild(readingGuide);
    // Move with mouse / touch when dyslexia mode active
    document.addEventListener('mousemove', (e)=> {
      if (!readingGuide || !document.documentElement.classList.contains('a11y-dyslexia')) return;
      // position guide vertically centered at cursor Y
      const y = e.clientY;
      readingGuide.style.top = (y - (readingGuide.offsetHeight/2)) + 'px';
      readingGuide.style.display = 'block';
    });
    document.addEventListener('touchmove', (e)=> {
      if (!readingGuide || !document.documentElement.classList.contains('a11y-dyslexia')) return;
      const t = e.touches[0];
      readingGuide.style.top = (t.clientY - (readingGuide.offsetHeight/2)) + 'px';
      readingGuide.style.display = 'block';
    });
  }
  createReadingGuide();

  els.dyslexia && els.dyslexia.addEventListener('click', function(){
    state.dyslexia = !state.dyslexia;
    saveState(state); applyState();
    // show/hide reading guide depending on dyslexia state
    if (state.dyslexia) { if (readingGuide) readingGuide.style.display = 'block'; announce('Modo dislexia ativado.');}
    else { if (readingGuide) readingGuide.style.display = 'none'; announce('Modo dislexia desativado.'); }
  });

  /* -------------------------
     Reading Mode (distraction-free)
     ------------------------- */
  els.readingMode && els.readingMode.addEventListener('click', function(){
    state.readingMode = !state.readingMode; saveState(state); applyState();
    announce(state.readingMode ? 'Modo Leitura ativado.' : 'Modo Leitura desativado.');
  });

  /* -------------------------
     Highlight Links/Buttons / Focus / Reduced Motion
     ------------------------- */
  els.highlightLinks && els.highlightLinks.addEventListener('click', function(){
    state.highlightLinks = !state.highlightLinks; saveState(state); applyState();
    announce(state.highlightLinks ? 'Links destacados.' : 'Destaque de links removido.');
  });
  els.highlightButtons && els.highlightButtons.addEventListener('click', function(){
    state.highlightButtons = !state.highlightButtons; saveState(state); applyState();
    announce(state.highlightButtons ? 'Botões destacados.' : 'Destaque de botões removido.');
  });
  els.focusToggle && els.focusToggle.addEventListener('click', function(){
    state.focusVisible = !state.focusVisible; saveState(state); applyState();
    announce(state.focusVisible ? 'Foco visível ativado.' : 'Foco visível desativado.');
  });
  els.reduceMotion && els.reduceMotion.addEventListener('click', function(){
    state.reducedMotion = !state.reducedMotion; saveState(state); applyState();
    announce(state.reducedMotion ? 'Animações reduzidas.' : 'Animações restauradas.');
  });

  /* -------------------------
     Virtual Keyboard (minimal)
     ------------------------- */
  let vk = null;
  function buildVirtualKeyboard() {
    if (vk) return vk;
    vk = document.createElement('div');
    vk.id = 'a11y-virtual-keyboard';
    vk.innerHTML = `
      <div class="vk-row">
        <div class="vk-key">q</div><div class="vk-key">w</div><div class="vk-key">e</div><div class="vk-key">r</div><div class="vk-key">t</div><div class="vk-key">y</div><div class="vk-key">u</div><div class="vk-key">i</div><div class="vk-key">o</div><div class="vk-key">p</div>
      </div>
      <div class="vk-row">
        <div class="vk-key">a</div><div class="vk-key">s</div><div class="vk-key">d</div><div class="vk-key">f</div><div class="vk-key">g</div><div class="vk-key">h</div><div class="vk-key">j</div><div class="vk-key">k</div><div class="vk-key">l</div>
      </div>
      <div class="vk-row">
        <div class="vk-key">z</div><div class="vk-key">x</div><div class="vk-key">c</div><div class="vk-key">v</div><div class="vk-key">b</div><div class="vk-key">n</div><div class="vk-key">m</div>
      </div>
      <div class="vk-row">
        <div class="vk-key">Space</div><div class="vk-key">Back</div><div class="vk-key">Enter</div>
      </div>
    `;
    document.body.appendChild(vk);

    // handler for key clicks
    vk.addEventListener('click', (ev) => {
      const t = ev.target;
      if (!t.classList.contains('vk-key')) return;
      const label = t.textContent.trim();
      const active = document.activeElement;
      // if active element is input or textarea, insert char at caret
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        if (label === 'Space') {
          insertAtCaret(active, ' ');
        } else if (label === 'Back') {
          backspaceAtCaret(active);
        } else if (label === 'Enter') {
          insertAtCaret(active, '\n');
        } else {
          insertAtCaret(active, label);
        }
        active.focus();
      } else {
        announce('Nenhum campo de texto em foco. Clique num campo para usar o teclado virtual.');
      }
    });

    return vk;
  }

  function insertAtCaret(el, text) {
    try {
      if (el.isContentEditable) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (el.selectionStart !== undefined) {
        const start = el.selectionStart, end = el.selectionEnd, val = el.value;
        el.value = val.slice(0,start) + text + val.slice(end);
        el.selectionStart = el.selectionEnd = start + text.length;
      } else {
        el.value += text;
      }
    } catch (e) { console.warn('vk insert error', e); }
  }
  function backspaceAtCaret(el) {
    try {
      if (el.isContentEditable) {
        const sel = window.getSelection(); if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        if (range.startOffset > 0) {
          range.setStart(range.startContainer, range.startOffset - 1);
          range.deleteContents();
        }
      } else if (el.selectionStart !== undefined) {
        const start = el.selectionStart, end = el.selectionEnd, val = el.value;
        if (start === end && start > 0) {
          el.value = val.slice(0,start-1) + val.slice(end);
          el.selectionStart = el.selectionEnd = start-1;
        } else {
          el.value = val.slice(0,start) + val.slice(end);
          el.selectionStart = el.selectionEnd = start;
        }
      }
    } catch(e){ console.warn('vk backspace error', e); }
  }

  // keyboard toggle
  els.keyboardToggle && els.keyboardToggle.addEventListener('click', function(){
    const k = buildVirtualKeyboard();
    if (!k) return;
    if (k.style.display === 'block') { k.style.display = 'none'; announce('Teclado virtual escondido.'); }
    else { k.style.display = 'block'; announce('Teclado virtual mostrado. Clique em um campo e então use o teclado.'); }
  });

  /* -------------------------
     Reset all
     ------------------------- */
  els.resetAll && els.resetAll.addEventListener('click', function(){
    state = Object.assign({}, DEFAULT);
    saveState(state); applyState();
    // hide virtual keyboard & reading guide
    const k = document.getElementById('a11y-virtual-keyboard');
    if (k) k.style.display = 'none';
    if (readingGuide) readingGuide.style.display = 'none';
    announce('Preferências restauradas.');
  });

  /* -------------------------
     Helpers: persist on unload / keyboard shortcuts
     ------------------------- */
  window.addEventListener('beforeunload', ()=> saveState(state));
  // keyboard shortcuts: Alt+Shift+A toggles panel
  document.addEventListener('keydown', function(e){
    if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      els.openBtn && els.openBtn.click();
    }
  });

  /* -------------------------
     Initialize: apply persisted state
     ------------------------- */
  applyState();

  /* -------------------------
     Small compatibility: if some elements missing, announce
     ------------------------- */
  setTimeout(()=> {
    // ensure the CSS variables applied by root are reflected on body for zoom effect
    // Some templates scale body by transform; we ensure body has transform-origin top-left
    document.body.style.transformOrigin = 'top left';
    // If reading guide present but dyslexia off, hide
    if (readingGuide && !state.dyslexia) readingGuide.style.display = 'none';
  }, 120);

})();
}); // Fim do DOMContentLoaded wrapper para A11Y


