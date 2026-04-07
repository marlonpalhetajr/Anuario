// ========== CONFIGURAÇÃO ==========
const CONFIG = {
    mapCenter: [-52, -3.5],
    mapZoom: 6,
    minZoom: 5,
    maxZoom: 10
};

// ========== ESTADO GLOBAL ==========
const STATE = {
    map: null,
    markers: [],
    geojsonLayer: null,
    modalMap: null,
    imageOverlay: null,
    coordenadas: null,
    populacao: null,
    geojson: null,
    catalogo: null,
    currentData: null,
    currentIndicator: null,
    currentCategory: 'demografia',
    popup: null,
    hoveredFeatureId: null
};

const MAP_IDS = {
    source: 'municipios',
    fill: 'municipios-fill',
    line: 'municipios-line'
};

// Mapeia chaves de categoria da UI para rótulos da configuração
function mapUiCategoryToConfigLabel(uiCategory) {
    const map = {
        'demografia': 'Demografia',
        'economia': 'Economia',
        'infraestrutura': 'Infraestrutura',
        'meio-ambiente': 'Meio Ambiente',
        'social': 'Social',
        'territorio': 'Território'
    };
    return map[uiCategory] || uiCategory;
}

function formatCategoryLabel(uiCategory) {
    return mapUiCategoryToConfigLabel(uiCategory);
}

const TERRITORY_ICONS = {
    'fitoecologia': '../icons/territorio/Territorio_Fitoecologia2024.png',
    'geologico_2024': '../icons/territorio/Territorio_Geologico2024.png',
    'geomorfologico_2024': '../icons/territorio/Territorio_Geomorfologico2024.png',
    'hidrografia': '../icons/territorio/Territorio_Hidrografia_PA2024.png',
    'municipios_2025': '../icons/territorio/Territorio_Municipios2024.png',
    'pedologico_2025': '../icons/territorio/Territorio_Pedologico2023.png',
    'regiao_imediata_2024': '../icons/territorio/Territorio_Regiao_Imediata2024.png',
    'regiao_intermediaria_2024': '../icons/territorio/Territorio_Regiao_Intermediaria2024.png',
    'zoneamento': '../icons/territorio/Territorio_Zoneamento2024.png'
};

// ========== INICIALIZAÇÃO SIMPLES ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando...');
    
    // Aguarda 500ms para garantir DOM pronto
    setTimeout(() => {
        const mapEl = document.getElementById('map');
        const catEl = document.getElementById('category');
        const yearEl = document.getElementById('yearFilter');
        const indEl = document.getElementById('indicator');
        
        if (!mapEl) {
            console.error('❌ Elemento #map não encontrado');
            return;
        }
        
        // Carrega dados básicos
        Promise.all([
            fetch('../data/catalogo_categorias.json').then(r => r.json()),
            fetch('../data/para_municipios.geojson').then(r => r.json()),
            (typeof loadMapasConfig === 'function' ? loadMapasConfig().catch(() => null) : Promise.resolve(null))
        ]).then(([catalogo, geojson]) => {
            STATE.catalogo = catalogo;
            STATE.geojson = geojson;
            
            // Inicializa o mapa PRIMEIRO
            initMap();
            
            // Popula categorias com nomes formatados corretamente
            catEl.innerHTML = Object.keys(catalogo).map(cat => 
                `<option value="${cat}">${formatCategoryLabel(cat)}</option>`
            ).join('');
            
            // Popula anos: 2025 (interativo) + históricos (2024..2017)
            let yearOptions = '';
            yearOptions += '<option value="2025">2025 (Mapa Interativo)</option>';
            yearOptions += '<option value="2025_mapas">2025 (Mapas)</option>';
            if (window.MAPAS_CONFIG?.loaded && Array.isArray(window.MAPAS_CONFIG?.data?.anos)) {
                const historicalYears = [...window.MAPAS_CONFIG.data.anos]
                    .filter(y => String(y) !== '2025')
                    .sort((a, b) => Number(b) - Number(a));
                historicalYears.forEach(year => {
                    yearOptions += `<option value="${year}">${year}</option>`;
                });
            }
            yearEl.innerHTML = yearOptions;
            yearEl.value = '2025';
            
            // Configura listeners
            catEl.addEventListener('change', () => {
                populateIndicators();
                if (indEl.options.length > 0) {
                    indEl.dispatchEvent(new Event('change'));
                }
            });
            
            yearEl.addEventListener('change', () => {
                populateIndicators();
                if (indEl.options.length > 0) {
                    indEl.dispatchEvent(new Event('change'));
                }
            });
            
            indEl.addEventListener('change', loadSelectedIndicator);
            
            // Carrega primeiro indicador
            catEl.value = 'demografia';
            populateIndicators();
            
            // Dispara o event listener do indicador após um pequeno delay
            setTimeout(() => {
                if (indEl.options.length > 0) {
                    indEl.dispatchEvent(new Event('change'));
                }
            }, 100);
            
        }).catch(err => {
            console.error('❌ Erro ao carregar dados:', err);
            alert('Erro ao carregar dados: ' + err.message);
        });
        
    }, 500);
});


// ========== MAPA ==========
function initMap() {
    console.log('📍 Tentando inicializar mapa MapLibre...');
    console.log('   - Procurando elemento #map...');
    const mapElement = document.getElementById('map');
    
    if (!mapElement) {
        console.error('❌ Elemento #map não encontrado no DOM');
        throw new Error('Elemento #map não encontrado no DOM');
    }
    
    console.log('   - Elemento #map encontrado, criando instância...');
    
    STATE.map = new maplibregl.Map({
        container: 'map',
        style: buildRasterStyle(),
        center: CONFIG.mapCenter,
        zoom: CONFIG.mapZoom,
        minZoom: CONFIG.minZoom,
        maxZoom: CONFIG.maxZoom,
        attributionControl: true
    });

    // Inicializar popup imediatamente
    STATE.popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
    console.log('✓ Popup inicializado');

    // Adicionar controles quando o mapa carregar
    if (STATE.map.isStyleLoaded()) {
        STATE.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'topright');
        STATE.map.resize();
        console.log('✓ Mapa já estava carregado, controles adicionados');
    } else {
        STATE.map.on('load', () => {
            console.log('📍 Evento load do mapa disparado');
            STATE.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'topright');
            STATE.map.resize();
            console.log('✓ Evento load disparado, controles adicionados e resize executado');
        });
    }
    
    // Força um resize adicional após 300ms por segurança
    setTimeout(() => {
        if (STATE.map) {
            console.log('🔄 Executando resize de segurança do mapa...');
            STATE.map.resize();
        }
    }, 300);
}

function buildRasterStyle() {
    return {
        version: 8,
        sources: {
            'osm-tiles': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
            }
        },
        layers: [
            {
                id: 'osm-tiles',
                type: 'raster',
                source: 'osm-tiles'
            }
        ]
    };
}

// ========== CARREGAMENTO DE DADOS ==========
async function loadData() {
    try {
        // Carrega catálogo de categorias
        console.log('Carregando catálogo: ../data/catalogo_categorias.json');
        const catalogoResponse = await fetch('../data/catalogo_categorias.json', { 
            method: 'GET',
            cache: 'no-cache'
        });
        
        if (!catalogoResponse.ok) {
            throw new Error(`Erro HTTP ${catalogoResponse.status}`);
        }
        
        STATE.catalogo = await catalogoResponse.json();
        console.log('✓ Catálogo carregado');
        
        // Carrega GeoJSON dos municípios
        console.log('Carregando GeoJSON: ../data/para_municipios.geojson');
        const geoResponse = await fetch('../data/para_municipios.geojson', { 
            method: 'GET',
            cache: 'no-cache'
        });
        
        if (!geoResponse.ok) {
            throw new Error(`Erro HTTP ${geoResponse.status}`);
        }
        
        STATE.geojson = await geoResponse.json();
        console.log(`✓ GeoJSON carregado: ${STATE.geojson.features.length} municípios`);
        
        // Carrega dados populacionais (padrão inicial)
        console.log('Carregando população: ../data/populacao_2025.json');
        const popResponse = await fetch('../data/populacao_2025.json', {
            method: 'GET',
            cache: 'no-cache'
        });
        
        if (!popResponse.ok) {
            throw new Error(`Erro HTTP ${popResponse.status}`);
        }
        
        STATE.populacao = await popResponse.json();
        STATE.currentData = STATE.populacao;
        console.log('✓ Dados populacionais carregados:', Object.keys(STATE.populacao).length, 'municípios');
        
        // Carrega coordenadas (para futuras features)
        const coordResponse = await fetch('../data/coordenadas_municipios_pa.json', { 
            method: 'GET',
            cache: 'no-cache'
        });
        if (coordResponse.ok) {
            const coordData = await coordResponse.json();
            STATE.coordenadas = coordData.municipios || coordData;
            console.log(`✓ Coordenadas carregadas`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        console.error('Detalhes:', error.message);
        throw new Error(`Falha ao carregar dados: ${error.message}`);
    }
}

async function loadIndicatorData(path) {
    try {
        showLoading(true);
        console.log(`Carregando indicador: ${path}`);
        const response = await fetch(`../${path}`, {
            method: 'GET',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✓ Indicador carregado: ${Object.keys(data).length} municípios`);
        showLoading(false);
        return data;
    } catch (error) {
        console.error('❌ Erro ao carregar indicador:', error);
        showLoading(false);
        throw error;
    }
}

// ========== POPULAÇÃO DE CONTROLES ==========
function populateCategories() {
    if (!STATE.catalogo) return;
    
    const categorySelect = document.getElementById('category');
    const categoriaLabels = {
        'demografia': 'Demografia',
        'economia': 'Economia',
        'infraestrutura': 'Infraestrutura',
        'meio-ambiente': 'Meio Ambiente',
        'social': 'Social',
        'territorio': 'Território'
    };
    
    let html = '';
    for (const [key, label] of Object.entries(categoriaLabels)) {
        const indicadores = STATE.catalogo[key];
        if (indicadores && indicadores.length > 0) {
            html += `<option value="${key}">${label}</option>`;
        }
    }
    
    categorySelect.innerHTML = html;
    categorySelect.value = 'demografia';
    populateIndicators();
}

function populateIndicators() {
    const indicatorSelect = document.getElementById('indicator');
    const indicatorCol = document.getElementById('indicatorCol');
    const category = document.getElementById('category').value;
    const yearFilter = document.getElementById('yearFilter');
    const selectedYear = yearFilter?.value;
    
    console.log(`🔄 populateIndicators - Ano: ${selectedYear}, Categoria: ${category}, MAPAS_CONFIG.loaded: ${window.MAPAS_CONFIG?.loaded}`);
    
    // Controla visibilidade do painel de informações e legenda
    toggleInfoLegendPanel(selectedYear);
    
    // Atualiza categoria no estado para usar paleta correta
    STATE.currentCategory = category;
    
    // Atualiza o badge da categoria IMEDIATAMENTE
    updateCategoryBadge(category);

    // Para 2025_mapas e anos históricos (2024..2017), renderiza galeria por categoria
    if (selectedYear && selectedYear !== '2025') {
        indicatorSelect.innerHTML = '<option value="">Selecione um mapa</option>';
        if (indicatorCol) indicatorCol.style.display = 'none';

        // Verifica se a configuração de mapas históricos está disponível
        if (typeof renderCategoryGallery === 'function' && window.MAPAS_CONFIG?.loaded) {
            const configCategory = mapUiCategoryToConfigLabel(category);
            console.log(`📂 Renderizando galeria para ${configCategory} - Ano ${selectedYear}`);
            renderCategoryGallery(configCategory);
        } else {
            // Se a configuração não está carregada, mostra mensagem de erro
            console.warn('⚠️ Configuração de mapas não carregada');
            const gallery = document.getElementById('territory-gallery');
            const mapContainer = document.getElementById('mapContainer');
            
            if (gallery) {
                gallery.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning text-center" role="alert">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Configuração de mapas não carregada.</strong>
                            <br><small class="mt-2 d-block">Por favor, recarregue a página para visualizar os mapas.</small>
                        </div>
                    </div>
                `;
                gallery.style.display = 'flex';
            }
            if (mapContainer) mapContainer.style.display = 'none';
        }
        return;
    }

    // Se for Território em 2025 (mapa interativo), renderiza galeria de mapas interativos
    if (category === 'territorio' && selectedYear === '2025') {
        if (indicatorCol) indicatorCol.style.display = 'none';
        indicatorSelect.innerHTML = '<option value="">Selecione um mapa</option>';
        renderTerritoryGallery();
        return;
    }

    // Para outras categorias em 2025 (mapa interativo)
    if (selectedYear === '2025') {
        // Mostra menu indicador
        if (indicatorCol) indicatorCol.style.display = 'block';
        
        if (!STATE.catalogo || !category) {
            indicatorSelect.innerHTML = '<option value="">Selecione uma categoria primeiro</option>';
            return;
        }
        
        let indicadores = STATE.catalogo[category];
        if (!indicadores || indicadores.length === 0) {
            indicatorSelect.innerHTML = '<option value="">Nenhum indicador disponível</option>';
            return;
        }
        
        // Filtra por ano selecionado
        indicadores = indicadores.filter(ind => String(ind.year) === selectedYear);
        
        if (indicadores.length === 0) {
            indicatorSelect.innerHTML = '<option value="">Nenhum indicador disponível para o ano selecionado</option>';
            return;
        }
        
        let html = '';
        indicadores.forEach(ind => {
            const dataPath = ind.path || '';
            const dataUnit = ind.unit || '';
            const dataYear = ind.year || '';
            const dataType = ind.type || 'choropleth';
            const dataImage = ind.image || '';
            
            html += `<option value="${ind.slug}" data-path="${dataPath}" data-unit="${dataUnit}" data-year="${dataYear}" data-type="${dataType}" data-image="${dataImage}">${ind.label}</option>`;
        });
        
        indicatorSelect.innerHTML = html;
        indicatorSelect.selectedIndex = 0;
        
        // Carrega automaticamente o primeiro indicador ao trocar de categoria
        hideTerritoryGallery();
        // NÃO aguardar loadSelectedIndicator aqui, deixa que o event listener faça isso
    }
}


// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Controla se a mudança vem do event listener (evita loops infinitos)
    let isSettingCategory = false;

    const categorySelect = document.getElementById('category');
    const yearFilter = document.getElementById('yearFilter');
    const indicatorSelect = document.getElementById('indicator');

    categorySelect.addEventListener('change', (e) => {
        if (isSettingCategory) {
            isSettingCategory = false;
            return;
        }

        const category = e.target.value;
        // populateIndicators() vai chamar loadSelectedIndicator() ou renderTerritoryGallery()
        populateIndicators();
    });

    yearFilter.addEventListener('change', (e) => {
        const selectedYear = e.target.value;

        // Para 2025 interativo, força Demografia como entrada padrão.
        // Para 2025_mapas e anos históricos, mantém a categoria atual para exibir galeria por categoria.
        const targetCategory = (selectedYear === '2025') ? 'demografia' : categorySelect.value;
        
        if (categorySelect.value !== targetCategory) {
            isSettingCategory = true;
            categorySelect.value = targetCategory;
            // O event listener de categoria vai chamar populateIndicators()
        }

        const category = categorySelect.value;
        
        console.log(`📅 Ano alterado para: ${selectedYear}, Categoria: ${category}`);
        
        // Se o ano foi alterado sem trocar categoria, chama populateIndicators()
        if (categorySelect.value === targetCategory) {
            populateIndicators();
        }
    });

    indicatorSelect.addEventListener('change', () => {
        loadSelectedIndicator();
    });
}

async function loadSelectedIndicator() {
    const indicatorSelect = document.getElementById('indicator');
    const option = indicatorSelect.options[indicatorSelect.selectedIndex];

    if (!option || !option.value) return;
    
    // Garante que o painel de informações e legenda está visível
    showInfoLegendPanel();
    
    const indicatorData = {
        slug: option.value,
        label: option.textContent,
        path: option.dataset.path,
        unit: option.dataset.unit || '',
        year: option.dataset.year || '',
        type: option.dataset.type || 'choropleth',
        image: option.dataset.image || ''
    };
    
    STATE.currentIndicator = indicatorData;
    
    try {
        // Se for mapa de imagem (Territorio), exibe a imagem ao invés de choropleth
        if (indicatorData.type === 'map_image') {
            loadMapImage(indicatorData);
        } else if (indicatorData.type === 'choropleth_region') {
            // Carrega dados de regiões (Territorio interativo)
            STATE.currentData = await loadIndicatorData(indicatorData.path);
            loadRegionChoroplethMap();
        } else {
            // Carrega dados do indicador para choropleth normal
            STATE.currentData = await loadIndicatorData(indicatorData.path);
            
            // Atualiza mapa
            loadChoroplethMap();
        }
    } catch (error) {
        console.error('Erro ao carregar indicador:', error);
        showError('Erro ao carregar indicador: ' + error.message);
    }
}

// ========== MAPA COROPLÉTICO GENERALIZADO ==========
function loadChoroplethMap() {
    // Remove fullscreen se estava ativo
    const mapElement = document.getElementById('map');
    const mapContainer = document.getElementById('mapContainer');
    
    if (mapElement) {
        mapElement.classList.remove('fullscreen-territorio');
    }
    if (mapContainer) {
        mapContainer.classList.remove('fullscreen-territorio');
        mapContainer.style.display = 'block';
    }
    
    enableMapControls();
    clearMap();
    
    if (!STATE.geojson || !STATE.currentData || !STATE.currentIndicator) {
        console.error('Dados não carregados');
        showError('Dados não disponíveis');
        return;
    }
    
    console.log(`🗺️ Criando mapa: ${STATE.currentIndicator.label}`);
    
    // Re-habilita controles do mapa
    enableMapControls();
    
    // Verifica se o mapa existe
    if (!STATE.map) {
        console.error('❌ Mapa não foi inicializado');
        showError('Erro: Mapa não foi inicializado');
        return;
    }
    
    // Ajusta o tamanho do mapa
    setTimeout(() => {
        if (STATE.map) {
            STATE.map.resize();
        }
    }, 100);

    // Se o mapa ainda não carregou o estilo, aguarda
    if (!STATE.map.isStyleLoaded()) {
        STATE.map.once('load', () => loadChoroplethMap());
        return;
    }
    
    // Coleta valores para estatísticas e calcular quebras
    const values = Object.values(STATE.currentData).filter(v => Number.isFinite(v) && v > 0);
    
    if (values.length === 0) {
        showError('Nenhum dado disponível para este indicador');
        return;
    }
    
    // Calcula quebras (quantis)
    const breaks = calculateBreaks(values, 5);
    const colorPalette = getColorPaletteByCategory(STATE.currentCategory);
    
    const enrichedGeojson = buildGeojsonWithValues(STATE.geojson, STATE.currentData);

    if (!STATE.map.getSource(MAP_IDS.source)) {
        STATE.map.addSource(MAP_IDS.source, {
            type: 'geojson',
            data: enrichedGeojson
        });
    } else {
        STATE.map.getSource(MAP_IDS.source).setData(enrichedGeojson);
    }

    const fillColorExpression = buildFillColorExpression(breaks, colorPalette);

    if (!STATE.map.getLayer(MAP_IDS.fill)) {
        STATE.map.addLayer({
            id: MAP_IDS.fill,
            type: 'fill',
            source: MAP_IDS.source,
            paint: {
                'fill-color': fillColorExpression,
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.9,
                    0.7
                ]
            }
        });
        console.log('Layer criado:', MAP_IDS.fill);
    } else {
        STATE.map.setPaintProperty(MAP_IDS.fill, 'fill-color', fillColorExpression);
        console.log('Layer atualizado:', MAP_IDS.fill);
    }

    if (!STATE.map.getLayer(MAP_IDS.line)) {
        STATE.map.addLayer({
            id: MAP_IDS.line,
            type: 'line',
            source: MAP_IDS.source,
            paint: {
                'line-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    '#666',
                    '#ffffff'
                ],
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    2,
                    1
                ]
            }
        });
    }

    console.log('Chamando bindMapInteractions...');
    bindMapInteractions();
    console.log('bindMapInteractions completado');

    // Ajusta zoom
    const bounds = getGeojsonBounds(enrichedGeojson);
    if (bounds) {
        STATE.map.fitBounds(bounds, { padding: 30, animate: false });
    }
    
    console.log(`✓ Mapa criado com ${STATE.geojson.features.length} municípios`);
    
    // Atualiza UI
    updateLegendDynamic(breaks, colorPalette);
    updateStatistics(values);
}

// ========== CARREGAMENTO DE MAPA DE IMAGEM (TERRITORIO) ==========
function loadMapImage(indicatorData) {
    const mapEl = document.getElementById('map');
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    if (!indicatorData.image) {
        showError('Caminho da imagem não encontrado');
        return;
    }
    
    // Limpa o mapa anterior
    mapEl.innerHTML = '';
    
    // Cria container para a imagem
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
        background: #f5f5f5;
    `;
    
    const img = document.createElement('img');
    img.src = indicatorData.image;
    img.alt = indicatorData.label;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;
    
    img.onerror = () => {
        console.error('❌ Erro ao carregar imagem:', indicatorData.image);
        imgContainer.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar imagem</p>';
    };
    
    imgContainer.appendChild(img);
    mapEl.appendChild(imgContainer);
    
    // Atualiza info panel
    infoText.classList.remove('show');
    infoText.classList.add('hide');
    
    infoDetails.innerHTML = `
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <p><strong>Mapa:</strong> ${indicatorData.label}</p>
            <p><strong>Ano:</strong> ${indicatorData.year}</p>
        </div>
    `;
    
    infoDetails.classList.remove('hide');
    infoDetails.classList.add('show');
    
    // Hide legend para mapas de imagem
    const legendContent = document.getElementById('legend-content');
    if (legendContent) {
        legendContent.parentElement.style.display = 'none';
    }
    
    console.log('✓ Mapa de imagem carregado:', indicatorData.label);
}

// ========== CHOROPLETH POR REGIÕES (TERRITORIO) ==========
function loadRegionChoroplethMap() {
    // Mantido para compatibilidade; caso venha a ser usado
    showError('Mapa de regiões não disponível para Território. Selecione um mapa estático.');
}

function createPopupRegion(municipio, regiao, cor) {
    return `
        <div style="font-size: 12px; width: 200px;">
            <strong>${municipio}</strong><br>
            <strong>Região:</strong> ${regiao}<br>
            <strong>Cor:</strong> <span style="display: inline-block; width: 20px; height: 20px; background-color: ${cor}; border: 1px solid #000; vertical-align: middle;"></span>
        </div>
    `;
}

function updateInfoPanelRegion(municipio, regiao) {
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    infoText.classList.add('hide');
    
    infoDetails.innerHTML = `
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <p><strong>Município:</strong> ${municipio}</p>
            <p><strong>Região de Integração:</strong> ${regiao}</p>
        </div>
    `;
    
    infoDetails.classList.remove('show');
    void infoDetails.offsetWidth;
    infoDetails.classList.add('show');
}

function updateLegendRegions(regioes) {
    const legendContent = document.getElementById('legend-content');
    let html = '<div style="font-size: 0.9rem;">';
    
    for (const [key, regiao] of Object.entries(regioes)) {
        html += `
            <div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${regiao.color}; border: 1px solid #000;"></span>
                <span>${regiao.label}</span>
            </div>
        `;
    }
    
    html += '</div>';
    legendContent.innerHTML = html;
}

function updateStatsRegions(regioes, municipioToColor) {
    // Conta municípios por região
    const counts = {};
    
    for (const [key, regiao] of Object.entries(regioes)) {
        counts[regiao.label] = regiao.municipios ? regiao.municipios.length : 0;
    }
    
    const statsRow = document.getElementById('stats-row');
    statsRow.innerHTML = `
        <div class="col-md-12">
            <div class="stat-card">
                <h5>Regiões de Integração</h5>
                <div style="font-size: 0.9rem; max-height: 200px; overflow-y: auto;">
                    ${Object.entries(counts).map(([nome, count]) => `
                        <p style="margin: 0.3rem 0;"><strong>${nome}:</strong> ${count} municípios</p>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    statsRow.style.display = 'grid';
}

// ========== REABILITAR CONTROLES DO MAPA ==========
function enableMapControls() {
    if (!STATE.map) return;
    STATE.map.dragPan.enable();
    STATE.map.touchZoomRotate.enable();
    STATE.map.doubleClickZoom.enable();
    STATE.map.scrollZoom.enable();
    STATE.map.boxZoom.enable();
    STATE.map.keyboard.enable();
}

function calculateBreaks(values, numClasses) {
    const sorted = [...values].sort((a, b) => a - b);
    const breaks = [];
    
    for (let i = 1; i < numClasses; i++) {
        const pos = (i / numClasses) * (sorted.length - 1);
        const base = Math.floor(pos);
        const rest = pos - base;
        const val = base + 1 < sorted.length 
            ? sorted[base] * (1 - rest) + sorted[base + 1] * rest 
            : sorted[base];
        breaks.push(val);
    }
    
    return breaks;
}

function getColorPalette() {
    return ['#C8E6F5', '#7FC5E8', '#4FA3D1', '#2E5F8A', '#0D2F5C'];
}

function getColorPaletteByCategory(category) {
    const paletas = {
        'demografia': ['#E8F4F8', '#A5D8E8', '#5BA5D0', '#2E5F8A', '#0D2F5C'],
        'economia': ['#E8F5E9', '#A5D88B', '#5FA85F', '#3B7F3F', '#1A4D2E'],
        'infraestrutura': ['#FFE8CC', '#FFD9A3', '#FFC070', '#FF9B3D', '#E67E22'],
        'meio-ambiente': ['#C8E6C9', '#81C784', '#4CAF50', '#2E7D32', '#1B5E20'],
        'social': ['#F8E8E8', '#E8A5A5', '#D05B5B', '#8A2E2E', '#5C0D0D']
    };
    return paletas[category] || paletas['demografia'];
}

function getColorFromBreaks(value, breaks, palette) {
    if (!Number.isFinite(value) || value === 0) return '#ddd';
    let idx = 0;
    while (idx < breaks.length && value > breaks[idx]) idx++;
    return palette[Math.min(idx, palette.length - 1)];
}

function buildFillColorExpression(breaks, palette) {
    const step = ['step', ['get', 'value'], palette[0]];
    breaks.forEach((stop, idx) => {
        step.push(stop, palette[Math.min(idx + 1, palette.length - 1)]);
    });

    return [
        'case',
        ['<=', ['get', 'value'], 0],
        '#ddd',
        step
    ];
}

function buildGeojsonWithValues(geojson, dataByMunicipio) {
    const features = geojson.features.map((feature, index) => {
        const municipio = feature.properties.name || feature.properties.NM_MUN;
        const rawValue = dataByMunicipio[municipio];
        const value = Number.isFinite(rawValue) ? rawValue : Number(rawValue) || 0;

        return {
            ...feature,
            id: feature.id ?? index,
            properties: {
                ...feature.properties,
                municipio,
                value
            }
        };
    });

    return {
        ...geojson,
        features
    };
}

function bindMapInteractions() {
    if (!STATE.map) {
        console.error('❌ Mapa não inicializado');
        return;
    }
    
    console.log('bindMapInteractions chamado, removendo listeners antigos...');

    STATE.map.off('mousemove', MAP_IDS.fill, onMapHover);
    STATE.map.off('mouseleave', MAP_IDS.fill, onMapLeave);
    STATE.map.off('click', MAP_IDS.fill, onMapClick);

    console.log('Anexando novos listeners ao layer:', MAP_IDS.fill);
    STATE.map.on('mousemove', MAP_IDS.fill, onMapHover);
    STATE.map.on('mouseleave', MAP_IDS.fill, onMapLeave);
    STATE.map.on('click', MAP_IDS.fill, onMapClick);
    
    console.log('Listeners anexados com sucesso');
}

function onMapHover(e) {
    console.log('onMapHover disparado:', { features: e.features?.length, lngLat: e.lngLat });
    
    if (!e.features || !e.features.length) {
        console.log('Sem features encontradas');
        return;
    }
    const feature = e.features[0];
    
    // Se já está na mesma região, não atualiza
    if (STATE.hoveredFeatureId === feature.id) return;
    
    const municipio = feature.properties.municipio || feature.properties.name || feature.properties.NM_MUN;
    const valor = feature.properties.value || 0;
    const regiao = STATE.coordenadas?.[municipio]?.regiao || 'N/D';

    if (STATE.hoveredFeatureId !== null) {
        STATE.map.setFeatureState({ source: MAP_IDS.source, id: STATE.hoveredFeatureId }, { hover: false });
    }

    STATE.hoveredFeatureId = feature.id;
    STATE.map.setFeatureState({ source: MAP_IDS.source, id: STATE.hoveredFeatureId }, { hover: true });

    updateInfoPanel(municipio, valor, { regiao });

    // Mostrar popup com informações
    if (STATE.popup && STATE.map) {
        try {
            const popupHTML = createPopupChoropleth(municipio, valor, regiao);
            console.log('Popup HTML:', popupHTML);
            STATE.popup
                .setLngLat(e.lngLat)
                .setHTML(popupHTML)
                .addTo(STATE.map);
            console.log('Popup adicionado ao mapa');
        } catch (err) {
            console.error('Erro ao mostrar popup:', err);
            console.error('Stack:', err.stack);
        }
    } else {
        console.warn('STATE.popup ou STATE.map não disponível', { popup: !!STATE.popup, map: !!STATE.map });
    }
}

function onMapLeave() {
    if (STATE.hoveredFeatureId !== null) {
        STATE.map.setFeatureState({ source: MAP_IDS.source, id: STATE.hoveredFeatureId }, { hover: false });
        STATE.hoveredFeatureId = null;
    }

    // Remover popup
    if (STATE.popup) {
        try {
            STATE.popup.remove();
        } catch (err) {
            console.error('Erro ao remover popup:', err);
        }
    }

    // Animar saída das informações
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    infoDetails.classList.remove('show');
    
    setTimeout(() => {
        infoText.classList.remove('hide');
        infoText.style.display = 'block';
    }, 300);
}

function onMapClick(e) {
    if (!e.features || !e.features.length) return;
    const feature = e.features[0];
    const bounds = getFeatureBounds(feature);
    if (bounds) {
        STATE.map.fitBounds(bounds, { padding: 30 });
    }
}

function getGeojsonBounds(geojson) {
    if (!geojson || !geojson.features || !geojson.features.length) return null;
    const bounds = new maplibregl.LngLatBounds();
    geojson.features.forEach(feature => {
        extendBoundsFromCoordinates(bounds, feature.geometry.coordinates);
    });
    return bounds;
}

function getFeatureBounds(feature) {
    if (!feature?.geometry?.coordinates) return null;
    const bounds = new maplibregl.LngLatBounds();
    extendBoundsFromCoordinates(bounds, feature.geometry.coordinates);
    return bounds;
}

function extendBoundsFromCoordinates(bounds, coordinates) {
    if (!coordinates) return;
    if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
        bounds.extend([coordinates[0], coordinates[1]]);
        return;
    }
    coordinates.forEach(coord => extendBoundsFromCoordinates(bounds, coord));
}

// ========== GALERIA TERRITÓRIO (MAPAS ESTÁTICOS) ==========
function renderTerritoryGallery() {
    const yearFilter = document.getElementById('yearFilter');
    const selectedYear = yearFilter?.value || '';
    const gallery = document.getElementById('territory-gallery');
    const mapContainer = document.getElementById('mapContainer');
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    const statsRow = document.getElementById('stats-row');
    const legendContent = document.getElementById('legend-content');
    const mapas = STATE.catalogo?.territorio || [];

    if (!gallery) return;

    // Esconde mapa interativo
    if (mapContainer) mapContainer.style.display = 'none';
    if (statsRow) statsRow.style.display = 'none';
    if (legendContent) legendContent.innerHTML = '<p class="text-muted small">Clique em um mapa para visualizar em tela cheia</p>';
    if (infoDetails) {
        infoDetails.classList.remove('show');
    }
    if (infoText) {
        infoText.classList.remove('hide');
        infoText.style.display = 'block';
    }

    // Para anos históricos, mostra mensagem e não há mapas disponíveis
    if (selectedYear && selectedYear !== '2025') {
        gallery.innerHTML = '<p class="text-muted">Mapas para anos históricos ainda não estão disponíveis.</p>';
        gallery.style.display = 'flex';
        infoText.textContent = 'Mapas do Pará - Anos históricos em desenvolvimento';
        return;
    }

    // Para 2025, usa galeria de 2025
    console.log('📍 Usando galeria padrão para mapas de 2025');
    
    if (!mapas.length) {
        gallery.innerHTML = '<p class="text-muted">Nenhum mapa disponível.</p>';
        gallery.style.display = 'flex';
        infoText.textContent = 'Mapas do Pará - Clique para abrir em modal';
        return;
    }

    // Filtra mapas apenas para 2025
    const mapasFiltrados = mapas.filter(m => String(m.year) === '2025');

    if (!mapasFiltrados.length) {
        gallery.innerHTML = '<p class="text-muted">Nenhum mapa disponível para 2025.</p>';
        gallery.style.display = 'flex';
        infoText.textContent = 'Mapas do Pará - Clique para abrir em modal';
        return;
    }

    const cards = mapasFiltrados.map(item => {
        const titulo = item.label || 'Mapa';
        const ano = item.year ? ` (${item.year})` : '';
        const icon = TERRITORY_ICONS[item.slug] || '../img/anuario.png';
        const imgPath = item.image || '';
        return `
            <div class="portfolio-item territorio">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="${icon}" alt="${titulo}">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-3">${titulo}${ano}</h4>
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-lg-square rounded-circle" type="button" data-map-image="${imgPath}" data-map-title="${titulo}${ano}" onclick="openMapModal(this.dataset.mapImage, this.dataset.mapTitle)" title="Abrir ${titulo}">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="map-caption">${titulo}${ano}</div>
            </div>
        `;
    }).join('');

    gallery.innerHTML = cards;
    gallery.style.display = 'flex';
    gallery.style.flexWrap = 'wrap';
    infoText.textContent = 'Mapas do Pará - Clique para abrir em modal';
}

function hideTerritoryGallery() {
    const gallery = document.getElementById('territory-gallery');
    const mapContainer = document.getElementById('mapContainer');
    if (gallery) {
        gallery.style.display = 'none';
        gallery.innerHTML = '';
    }
    if (mapContainer) {
        mapContainer.style.display = 'block';
    }
    // Mostra o painel de informações e legenda ao voltar para o modo interativo
    showInfoLegendPanel();
    if (STATE.map) {
        setTimeout(() => STATE.map.resize(), 150);
    }
}

// ========== MODAL PARA VISUALIZAR MAPAS (TERRITÓRIO) ==========
function openMapModal(imagePath, mapTitle) {
    console.log('openMapModal chamado:', imagePath, mapTitle);
    
    if (!imagePath) {
        console.error('Caminho da imagem vazio');
        alert('Caminho da imagem não disponível');
        return;
    }
    
    const modalElement = document.getElementById('mapModal');
    if (!modalElement) {
        console.error('Modal não encontrado');
        return;
    }
    
    document.getElementById('mapModalTitle').textContent = mapTitle;
    
    // Configura botões do modal
    const openFullImageBtn = document.getElementById('openFullImageBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    
    if (openFullImageBtn) {
        openFullImageBtn.onclick = () => {
            window.open(imagePath, '_blank');
        };
    }
    
    if (downloadImageBtn) {
        downloadImageBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = imagePath;
            link.download = imagePath.split('/').pop();
            link.click();
        };
    }
    
    // Limpa o map anterior
    if (STATE.modalMap) {
        STATE.modalMap.remove();
        STATE.modalMap = null;
    }

    // Inicializa novo mapa no modal
    const container = document.getElementById('modalMap');
    container.innerHTML = '';
    
    // Abre o modal
    try {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        console.log('Modal aberto');
    } catch (err) {
        console.error('Erro ao abrir modal:', err);
        return;
    }
    
    // Inicializa mapa após modal estar visível
    setTimeout(() => {
        try {
            console.log('Inicializando mapa MapLibre no modal');

            const bounds = {
                minLng: -58.5,
                maxLng: -44.0,
                minLat: -7.5,
                maxLat: 3.0
            };

            const style = {
                version: 8,
                sources: {
                    'map-image': {
                        type: 'image',
                        url: imagePath,
                        coordinates: [
                            [bounds.minLng, bounds.maxLat],
                            [bounds.maxLng, bounds.maxLat],
                            [bounds.maxLng, bounds.minLat],
                            [bounds.minLng, bounds.minLat]
                        ]
                    }
                },
                layers: [
                    {
                        id: 'map-image-layer',
                        type: 'raster',
                        source: 'map-image',
                        paint: {
                            'raster-opacity': 1
                        }
                    }
                ]
            };

            STATE.modalMap = new maplibregl.Map({
                container,
                style,
                center: CONFIG.mapCenter,
                zoom: CONFIG.mapZoom,
                minZoom: 4,
                maxZoom: 18,
                attributionControl: false
            });

            STATE.modalMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'topright');

            STATE.modalMap.on('load', () => {
                STATE.modalMap.fitBounds([
                    [bounds.minLng, bounds.minLat],
                    [bounds.maxLng, bounds.maxLat]
                ], { padding: 20, animate: false });
            });

            console.log('Mapa MapLibre inicializado com sucesso');
        } catch (err) {
            console.error('Erro ao inicializar mapa no modal:', err);
        }
    }, 300);
}

document.addEventListener('hidden.bs.modal', function(e) {
    if (e.target.id === 'mapModal' && STATE.modalMap) {
        STATE.modalMap.remove();
        STATE.modalMap = null;
    }
});

// ========== FILTRO DE ANO ==========
function populateYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    const category = document.getElementById('category')?.value;
    
    if (!yearFilter) return;
    
    let html = '<option value="">Selecione o ano</option>';

    // Sempre inclui 2025 primeiro para todas as categorias
    html += '<option value="2025">2025 (Mapa Interativo)</option>';
    html += '<option value="2025_mapas">2025 (Mapas)</option>';

    // Se configuração histórica disponível, adiciona anos 2017-2024
    if (window.MAPAS_CONFIG && window.MAPAS_CONFIG.loaded) {
        const anos = MAPAS_CONFIG.data.anos; // [2017..2024]
        for (let i = anos.length - 1; i >= 0; i--) {
            html += `<option value="${anos[i]}">${anos[i]}</option>`;
        }
    }

    yearFilter.innerHTML = html;
}

// ========== LIMPEZA ==========
function clearMap() {
    if (!STATE.map) return;

    if (STATE.map.getLayer(MAP_IDS.fill)) {
        STATE.map.removeLayer(MAP_IDS.fill);
    }
    if (STATE.map.getLayer(MAP_IDS.line)) {
        STATE.map.removeLayer(MAP_IDS.line);
    }
    if (STATE.map.getSource(MAP_IDS.source)) {
        STATE.map.removeSource(MAP_IDS.source);
    }

    STATE.geojsonLayer = null;
    STATE.imageOverlay = null;
    STATE.hoveredFeatureId = null;
    if (STATE.popup) {
        STATE.popup.remove();
    }
}

// ========== UI ==========
function createPopupChoropleth(municipio, valor, regiao) {
    // Agregar dados da região
    const regionData = aggregateRegionData(regiao);
    
    return `
        <h4 style="color: var(--primary-color); margin: 0 0 8px 0; font-size: 0.95rem;">📍 ${regiao}</h4>
        <div class="popup-info" style="background: linear-gradient(135deg, #e8f4f8, #f0f8fa); border: none; border-left: 2px solid var(--primary-color);">
            <strong>Município:</strong> ${municipio}
        </div>
        <div class="popup-info">
            <strong>${STATE.currentIndicator.label}:</strong><br>
            ${formatValue(valor, STATE.currentIndicator.unit)}
        </div>
        ${regionData ? `
        <div class="popup-info" style="background: #f9f9f9; border-left: 2px solid #2ecc71;">
            <strong>📊 Total:</strong><br>
            ${formatValue(regionData.total, STATE.currentIndicator.unit)}
        </div>` : ''}
        ${STATE.currentIndicator.year ? `
        <div class="popup-info" style="font-size: 0.8rem; color: #999;">
            <strong>📅 Ano:</strong> ${STATE.currentIndicator.year}
        </div>` : ''}
    `;
}

function aggregateRegionData(regiao) {
    if (!regiao || !STATE.currentData) return null;
    
    let total = 0;
    let count = 0;
    
    // Percorre todos os municípios e soma os valores daqueles na região
    for (const [municipio, valor] of Object.entries(STATE.currentData)) {
        const municRegiao = STATE.coordenadas?.[municipio]?.regiao;
        if (municRegiao === regiao && typeof valor === 'number') {
            total += valor;
            count++;
        }
    }
    
    return count > 0 ? { total, count, media: total / count } : null;
}

function updateInfoPanel(municipio, valor, coords) {
    console.log('updateInfoPanel chamado:', { municipio, valor, coords, indicador: STATE.currentIndicator });
    
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    console.log('DOM elements:', { infoText: !!infoText, infoDetails: !!infoDetails });
    
    if (!infoText || !infoDetails) return;
    
    infoText.classList.add('hide');
    
    infoDetails.innerHTML = `
        <div class="info-item">
            <label>Município</label>
            <strong>${municipio}</strong>
        </div>
        <div class="info-item">
            <label>Região de Integração</label>
            <strong>${coords.regiao || 'N/D'}</strong>
        </div>
        <div class="info-item">
            <label>${STATE.currentIndicator.label}</label>
            <strong>${formatValue(valor, STATE.currentIndicator.unit)}</strong>
        </div>
        ${STATE.currentIndicator.year ? `
        <div class="info-item">
            <label>Ano de Referência</label>
            <strong>${STATE.currentIndicator.year}</strong>
        </div>` : ''}
    `;
    
    infoDetails.classList.remove('show');
    
    // Trigger reflow para aplicar transição
    void infoDetails.offsetWidth;
    
    infoDetails.classList.add('show');
}

function updateLegendDynamic(breaks, colorPalette) {
    const legendContent = document.getElementById('legend-content');
    
    // Mostra legenda apenas para 2025
    if (STATE.currentIndicator?.year && STATE.currentIndicator.year !== '2025') {
        legendContent.innerHTML = '<p class="text-muted small">Clique em um mapa para visualizar em tela cheia</p>';
        return;
    }
    
    const values = Object.values(STATE.currentData).filter(v => Number.isFinite(v) && v > 0);
    
    if (values.length === 0) {
        legendContent.innerHTML = '<p class="text-muted small">Sem dados disponíveis</p>';
        return;
    }
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const ranges = [min, ...breaks, max];
    
    let html = '';
    for (let i = 0; i < ranges.length - 1; i++) {
        const a = ranges[i];
        const b = ranges[i + 1];
        const color = colorPalette[Math.min(i, colorPalette.length - 1)];
        html += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${color}"></div>
                <span>${formatValue(a, STATE.currentIndicator.unit)} – ${formatValue(b, STATE.currentIndicator.unit)}</span>
            </div>
        `;
    }
    legendContent.innerHTML = html;
}

function updateStatistics(values) {
    // Função desabilitada - cards de estatísticas removidos
    return;
}

// ========== FORMATAÇÃO ==========
function formatValue(value, unit) {
    if (!Number.isFinite(value)) return '-';
    
    unit = unit || '';
    
    // Formatação específica por unidade
    if (unit.includes('R$')) {
        if (unit.includes('mil')) {
            return `R$ ${formatNumber(value)} mil`;
        }
        return `R$ ${formatNumber(value)}`;
    }
    
    if (unit === '%' || unit.includes('por')) {
        return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${unit}`;
    }
    
    if (unit === 'km²' || unit === 'habitantes' || unit === 'veículos' || unit === 'consumidores') {
        return `${formatNumber(value)} ${unit}`;
    }
    
    // Padrão
    return `${formatNumber(value)}${unit ? ' ' + unit : ''}`;
}

function formatNumber(num) {
    if (!Number.isFinite(num)) return '-';
    return num.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

function formatCompact(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return Math.round(num).toString();
}

function updateCategoryBadge(category) {
    const badge = document.getElementById('categoryBadge');
    if (!badge) return;
    
    const labels = {
        'demografia': 'Demografia',
        'economia': 'Economia',
        'infraestrutura': 'Infraestrutura',
        'meio-ambiente': 'Meio Ambiente',
        'social': 'Social',
        'territorio': 'Território'
    };
    
    const colors = {
        'demografia': '#2E5F8A',
        'economia': '#3B7F3F',
        'infraestrutura': '#E67E22',
        'meio-ambiente': '#2E7D32',
        'social': '#8A2E2E',
        'territorio': '#8B7355'
    };
    
    if (category && labels[category]) {
        badge.textContent = labels[category];
        badge.style.backgroundColor = colors[category];
        badge.classList.add('active');
    } else {
        badge.classList.remove('active');
    }
}

/**
 * Esconde o painel de informações e legenda
 */
function hideInfoLegendPanel() {
    const panel = document.getElementById('infoLegendPanel');
    if (panel) {
        panel.style.display = 'none';
    }
}

/**
 * Mostra o painel de informações e legenda
 */
function showInfoLegendPanel() {
    console.log('showInfoLegendPanel chamado');
    const panel = document.getElementById('infoLegendPanel');
    if (panel) {
        panel.style.display = 'block';
        console.log('Panel display definido como block, computed style:', window.getComputedStyle(panel).display);
    }
    
    // Reset das classes para estado inicial
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    if (infoText) {
        infoText.classList.remove('hide');
    }
    if (infoDetails) {
        infoDetails.classList.remove('show');
    }
}

/**
 * Controla a visibilidade do painel baseado no ano selecionado
 */
function toggleInfoLegendPanel(year) {
    // Mostra painel apenas no modo interativo 2025
    if (year === '2025') {
        showInfoLegendPanel();
    } else {
        hideInfoLegendPanel();
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.classList.toggle('hidden', !show);
}

function showError(message) {
    console.error(message);
    alert(message);
}

function resetUI() {
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    infoText.classList.remove('hide');
    infoText.style.display = 'block';
    
    infoDetails.classList.remove('show');
    
    document.getElementById('stats-row').style.display = 'none';
    document.getElementById('legend-content').innerHTML = 
        '<p class="text-muted small">Selecione um indicador para visualizar a legenda</p>';
}

// ========== INICIAR APLICAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOMContentLoaded disparado');
    console.log('📍 Verificando elementos antes de init()...');
    console.log('   - #map:', document.getElementById('map') ? '✅ Existe' : '❌ Não existe');
    console.log('   - #mapContainer:', document.getElementById('mapContainer') ? '✅ Existe' : '❌ Não existe');
    init();
});
