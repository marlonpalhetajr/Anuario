/**
 * Carrega configuração de mapas de todos os anos (2017-2024)
 * Este arquivo estende o sistema para suportar visualização de mapas históricos
 */

// Estado global para configuração de mapas
const MAPAS_CONFIG = {
    data: null,
    loaded: false
};

/**
 * Carrega arquivo de configuração de mapas
 */
async function loadMapasConfig() {
    try {
        console.log('📦 Carregando configuração de mapas...');
        const response = await fetch('config-mapas.json', {
            method: 'GET',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }
        
        MAPAS_CONFIG.data = await response.json();
        MAPAS_CONFIG.loaded = true;
        
        console.log(`✅ Configuração carregada: ${MAPAS_CONFIG.data.total} mapas`);
        console.log(`📊 Categorias: ${MAPAS_CONFIG.data.categorias.join(', ')}`);
        console.log(`📅 Anos: ${MAPAS_CONFIG.data.anos.join(', ')}`);
        
        return MAPAS_CONFIG.data;
    } catch (error) {
        console.error('❌ Erro ao carregar configuração de mapas:', error);
        throw error;
    }
}

/**
 * Popula filtro de anos com todos os anos disponíveis
 */
function populateYearsFromConfig() {
    if (!MAPAS_CONFIG.loaded || !MAPAS_CONFIG.data) {
        console.warn('Configuração de mapas não carregada');
        return;
    }
    
    const yearFilter = document.getElementById('yearFilter');
    if (!yearFilter) return;
    
    const anos = MAPAS_CONFIG.data.anos;
    
    // Mantém opção "Todos os anos"
    let html = '<option value="">Todos os anos</option>';
    
    // Adiciona anos em ordem decrescente (mais recente primeiro)
    for (let i = anos.length - 1; i >= 0; i--) {
        html += `<option value="${anos[i]}">${anos[i]}</option>`;
    }
    
    yearFilter.innerHTML = html;
    
    // Seleciona o ano mais recente por padrão
    if (anos.length > 0) {
        yearFilter.value = anos[anos.length - 1];
    }
}

/**
 * Obtém mapas de uma categoria específica e ano
 */
function getMapasByCategoria(categoria, ano = null) {
    if (!MAPAS_CONFIG.loaded || !MAPAS_CONFIG.data) {
        return [];
    }
    
    const mapasCategoria = MAPAS_CONFIG.data.mapas[categoria];
    if (!mapasCategoria) {
        return [];
    }
    
    if (ano) {
        const mapasDoAno = mapasCategoria[ano] || [];
        // Adiciona o campo ano a cada mapa
        return mapasDoAno.map(mapa => ({
            ...mapa,
            ano: ano
        }));
    }
    
    // Retorna todos os mapas de todos os anos
    const todosMapas = [];
    for (const anoKey in mapasCategoria) {
        mapasCategoria[anoKey].forEach(mapa => {
            todosMapas.push({
                ...mapa,
                ano: anoKey
            });
        });
    }
    
    return todosMapas;
}

function normalizeGalleryYear(rawYear) {
    if (rawYear === '2025_mapas') {
        return '2025';
    }
    return rawYear;
}

/**
 * Renderiza galeria de mapas com filtro de ano
 */
function renderTerritoryGalleryFromConfig() {
    if (!MAPAS_CONFIG.loaded || !MAPAS_CONFIG.data) {
        console.warn('Configuração não carregada');
        return;
    }
    
    const gallery = document.getElementById('territory-gallery');
    const mapContainer = document.getElementById('mapContainer');
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    const statsRow = document.getElementById('stats-row');
    const legendContent = document.getElementById('legend-content');
    const yearFilter = document.getElementById('yearFilter');
    const selectedYearRaw = yearFilter?.value || '';
    const selectedYear = normalizeGalleryYear(selectedYearRaw);
    
    if (!gallery) return;
    
    // Esconde elementos não necessários
    if (mapContainer) mapContainer.style.display = 'none';
    if (statsRow) statsRow.style.display = 'none';
    if (legendContent) legendContent.innerHTML = '<p class="text-muted small">Clique em um mapa para visualizar em tela cheia</p>';
    if (infoDetails) infoDetails.style.display = 'none';
    if (infoText) {
        infoText.style.display = 'block';
        infoText.textContent = selectedYear 
            ? `Mapas de Território ${selectedYear} - Clique para visualizar`
            : 'Mapas de Território (Todos os anos) - Clique para visualizar';
    }
    
    // Obtém mapas de território
    let mapas = getMapasByCategoria('Território', selectedYear || null);
    
    if (!mapas.length) {
        gallery.innerHTML = '<p class="text-muted">Nenhum mapa disponível para o filtro selecionado.</p>';
        gallery.style.display = 'flex';
        return;
    }
    
    // Ordena por título
    mapas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    
    // Gera cards
    const cards = mapas.map(mapa => {
        const titulo = mapa.titulo;
        const ano = mapa.ano || selectedYear || '';
        const caminhoMapa = mapa.caminho;
        // Usar 'icon' se disponível, senão usar 'caminho' (para compatibilidade com anos antigos)
        const caminhoIcon = mapa.icon || mapa.caminho;
        
        // Monta textos condicionalmente
        const tituloCompleto = ano ? `${titulo} (${ano})` : titulo;
        const anoTexto = ano ? `<p class="text-white-50 mb-3">Ano: ${ano}</p>` : '';
        const captionTexto = ano ? `${titulo} (${ano})` : titulo;
        
        return `
            <div class="portfolio-item territorio">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="${caminhoIcon}" alt="${titulo}" onerror="this.src='../img/anuario.png'">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-3">${titulo}</h4>
                        ${anoTexto}
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-lg-square rounded-circle" 
                                    type="button" 
                                    data-map-image="${caminhoMapa}" 
                                    data-map-title="${tituloCompleto}" 
                                    onclick="openMapModal(this.dataset.mapImage, this.dataset.mapTitle)" 
                                    title="Visualizar ${titulo}">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="map-caption">${captionTexto}</div>
            </div>
        `;
    }).join('');
    
    gallery.innerHTML = cards;
    gallery.style.display = 'flex';
    gallery.style.flexWrap = 'wrap';
    
    console.log(`✅ Galeria renderizada: ${mapas.length} mapas`);
}

/**
 * Renderiza galeria para qualquer categoria (não só Território)
 */
function renderCategoryGallery(categoria) {
    if (!MAPAS_CONFIG.loaded || !MAPAS_CONFIG.data) {
        console.warn('Configuração não carregada');
        return;
    }
    
    const gallery = document.getElementById('territory-gallery');
    const mapContainer = document.getElementById('mapContainer');
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    const legendContent = document.getElementById('legend-content');
    const yearFilter = document.getElementById('yearFilter');
    const selectedYearRaw = yearFilter?.value || '';
    const selectedYear = normalizeGalleryYear(selectedYearRaw);
    
    if (!gallery) return;
    
    // Obtém mapas da categoria
    let mapas = getMapasByCategoria(categoria, selectedYear || null);
    
    if (!mapas.length) {
        // Se não houver mapas, mostra mensagem na galeria ao invés de voltar ao mapa interativo
        if (mapContainer) mapContainer.style.display = 'none';
        if (gallery) {
            gallery.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center" role="alert">
                        <i class="bi bi-info-circle me-2"></i>
                        Nenhum mapa disponível para <strong>${categoria}</strong> no ano <strong>${selectedYear || 'selecionado'}</strong>.
                        <br><small class="mt-2 d-block">Selecione outro ano ou categoria para visualizar mapas.</small>
                    </div>
                </div>
            `;
            gallery.style.display = 'flex';
        }
        if (legendContent) {
            legendContent.innerHTML = '<p class="text-muted small">Sem dados disponíveis</p>';
        }
        if (infoDetails) infoDetails.style.display = 'none';
        if (infoText) {
            infoText.style.display = 'block';
            infoText.textContent = 'Nenhum mapa disponível para o filtro selecionado';
        }
        return;
    }
    
    // Esconde mapa interativo
    if (mapContainer) mapContainer.style.display = 'none';
    
    // Limpa legenda para anos históricos
    if (legendContent) {
        legendContent.innerHTML = '<p class="text-muted small">Clique em um mapa para visualizar em tela cheia</p>';
    }
    
    // Limpa informações antigas e mostra apenas texto padrão
    if (infoDetails) infoDetails.style.display = 'none';
    if (infoText) {
        infoText.style.display = 'block';
        infoText.textContent = 'Mapas do Pará - Clique para abrir em modal';
    }
    
    // Ordena por título e depois por ano
    mapas.sort((a, b) => {
        const tituloCompare = a.titulo.localeCompare(b.titulo);
        if (tituloCompare !== 0) return tituloCompare;
        return b.ano.localeCompare(a.ano); // Ano mais recente primeiro
    });
    
    // Gera cards
    const cards = mapas.map(mapa => {
        const caminhoMapa = mapa.caminho;
        const caminhoIcon = mapa.icon || mapa.caminho;
        const ano = mapa.ano || selectedYear || '';
        
        // Monta textos condicionalmente
        const tituloCompleto = ano ? `${mapa.titulo} (${ano})` : mapa.titulo;
        const anoTexto = ano ? `<p class="text-white-50 mb-3">Ano: ${ano}</p>` : '';
        const captionTexto = ano ? `${mapa.titulo} (${ano})` : mapa.titulo;
        
        return `
            <div class="portfolio-item">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="${caminhoIcon}" alt="${mapa.titulo}" onerror="this.src='../img/anuario.png'">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-3">${mapa.titulo}</h4>
                        ${anoTexto}
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-lg-square rounded-circle" 
                                    type="button" 
                                    data-map-image="${caminhoMapa}" 
                                    data-map-title="${tituloCompleto}" 
                                    onclick="openMapModal(this.dataset.mapImage, this.dataset.mapTitle)" 
                                    title="Visualizar">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="map-caption">${captionTexto}</div>
            </div>
        `;
    }).join('');
    
    gallery.innerHTML = cards;
    gallery.style.display = 'flex';
    gallery.style.flexWrap = 'wrap';
    
    console.log(`✅ Galeria renderizada: ${mapas.length} mapas de ${categoria}`);
}

// Exporta funções para uso global
window.loadMapasConfig = loadMapasConfig;
window.populateYearsFromConfig = populateYearsFromConfig;
window.getMapasByCategoria = getMapasByCategoria;
window.renderTerritoryGalleryFromConfig = renderTerritoryGalleryFromConfig;
window.renderCategoryGallery = renderCategoryGallery;
window.MAPAS_CONFIG = MAPAS_CONFIG;
