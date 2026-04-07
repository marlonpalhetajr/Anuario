// ========== ESTADO APLICAÇÃO ==========
const STATE = {
    map: null,
    geojson: null,
    currentData: {},
    currentIndicator: null,
    currentCategory: 'demografia',
    catalogo: null,
    modalMap: null
};

const CONFIG = {
    mapCenter: [-3.5, -52],
    mapZoom: 6,
    mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
};

const MAP_IDS = {
    source: 'municipios-source',
    fill: 'municipios-fill',
    line: 'municipios-line'
};

// ========== INICIALIZAR APLICAÇÃO ==========
async function init() {
    try {
        console.log('🚀 Inicializando Mapa Interativo...');
        showLoading(true);
        
        initMap();
        await loadData();
        populateCategories();
        setupEventListeners();
        populateYearFilter();
        
        // Carrega população 2025 por padrão
        document.getElementById('yearFilter').value = '2025';
        document.getElementById('category').value = 'demografia';
        
        STATE.currentIndicator = STATE.catalogo?.demografia?.[0] || {
            label: 'População Estimada 2025',
            slug: 'populacao_2025',
            path: 'data/populacao_2025.json',
            unit: 'habitantes',
            year: '2025'
        };
        
        STATE.currentData = await loadIndicatorData(STATE.currentIndicator.path);
        console.log(`✅ Dados carregados: ${Object.keys(STATE.currentData).length} municípios`);
        
        loadChoroplethMap();
        populateIndicators();
        
        console.log('✅ Mapa inicializado com sucesso!');
        showLoading(false);
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showError(`Erro ao carregar o mapa: ${error.message}`);
        showLoading(false);
    }
}

// ========== MAPA MapLibre ==========
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('❌ Elemento #map não encontrado');
        return;
    }
    
    STATE.map = new maplibregl.Map({
        container: mapElement,
        style: CONFIG.mapStyle,
        center: CONFIG.mapCenter,
        zoom: CONFIG.mapZoom,
        minZoom: 4,
        maxZoom: 18
    });
    
    STATE.map.on('load', () => {
        console.log('✅ Mapa MapLibre carregado');
    });
}

// ========== CARREGAMENTO DE DADOS ==========
async function loadData() {
    try {
        const resp = await fetch('data/municipios_para.geojson');
        STATE.geojson = await resp.json();
        console.log(`✅ GeoJSON carregado: ${STATE.geojson.features.length} features`);
    } catch (e) {
        console.warn('⚠️ GeoJSON não disponível:', e.message);
        STATE.geojson = { type: 'FeatureCollection', features: [] };
    }
    
    try {
        const resp = await fetch('data/catalogo_categorias.json');
        STATE.catalogo = await resp.json();
        console.log(`✅ Catálogo carregado`);
    } catch (e) {
        console.warn('⚠️ Catálogo não disponível:', e.message);
        STATE.catalogo = {};
    }
}

async function loadIndicatorData(path) {
    try {
        if (!path) return {};
        const resp = await fetch(path);
        const data = await resp.json();
        return data.data ? data.data : data;
    } catch (e) {
        console.warn(`⚠️ Falha ao carregar ${path}:`, e.message);
        return {};
    }
}

// ========== POPULADORES DE UI ==========
function populateCategories() {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '';
    
    const categories = STATE.catalogo ? Object.keys(STATE.catalogo) : 
        ['demografia', 'economia', 'infraestrutura', 'meio-ambiente', 'social', 'territorio'];
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ');
        categorySelect.appendChild(option);
    });
}

function populateIndicators() {
    const indicatorSelect = document.getElementById('indicator');
    const categorySelect = document.getElementById('category');
    const category = categorySelect.value;
    const yearFilter = document.getElementById('yearFilter');
    const selectedYear = yearFilter?.value || '2025';
    
    STATE.currentCategory = category;
    updateCategoryBadge(category);
    
    if (category === 'territorio') {
        indicatorSelect.innerHTML = '<option>Selecione um mapa</option>';
        document.getElementById('indicatorCol').style.display = 'none';
        renderTerritoryGallery();
        return;
    }
    
    indicatorSelect.innerHTML = '';
    const indicadores = (STATE.catalogo?.[category] || []).filter(ind => String(ind.year) === selectedYear);
    
    if (selectedYear === '2025') {
        document.getElementById('indicatorCol').style.display = 'block';
        
        if (indicadores.length === 0) {
            indicatorSelect.innerHTML = '<option>Nenhum indicador disponível</option>';
            return;
        }
        
        indicadores.forEach(ind => {
            const option = document.createElement('option');
            option.value = ind.slug;
            option.textContent = ind.label;
            option.dataset.path = ind.path || '';
            option.dataset.unit = ind.unit || '';
            option.dataset.year = ind.year || '';
            indicatorSelect.appendChild(option);
        });
        
        if (indicadores.length > 0) {
            indicatorSelect.selectedIndex = 0;
            loadSelectedIndicator();
        }
    } else {
        document.getElementById('indicatorCol').style.display = 'none';
        renderTerritoryGallery();
    }
}

function populateYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    yearFilter.innerHTML = '<option value="">Selecione o ano</option>';
    
    const years = ['2025', '2024', '2023', '2022'];
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    const categorySelect = document.getElementById('category');
    const yearFilter = document.getElementById('yearFilter');
    const indicatorSelect = document.getElementById('indicator');
    
    categorySelect.addEventListener('change', () => {
        populateIndicators();
    });
    
    yearFilter.addEventListener('change', () => {
        const selectedYear = yearFilter.value;
        const targetCategory = (selectedYear === '2025') ? 'demografia' : 'territorio';
        categorySelect.value = targetCategory;
        populateIndicators();
    });
    
    indicatorSelect.addEventListener('change', () => {
        loadSelectedIndicator();
    });
}

// ========== CARREGAR INDICADOR ==========
async function loadSelectedIndicator() {
    const indicatorSelect = document.getElementById('indicator');
    const option = indicatorSelect.options[indicatorSelect.selectedIndex];
    
    if (!option || !option.value) return;
    
    STATE.currentIndicator = {
        slug: option.value,
        label: option.textContent,
        unit: option.dataset.unit || '',
        path: option.dataset.path || '',
        year: option.dataset.year || '2025'
    };
    
    if (STATE.currentIndicator.path) {
        STATE.currentData = await loadIndicatorData(STATE.currentIndicator.path);
    }
    
    loadChoroplethMap();
}

// ========== RENDERIZAR MAPA COROPLÉTICO ==========
function loadChoroplethMap() {
    if (!STATE.map || !STATE.geojson || !STATE.currentData) return;
    
    console.log(`🗺️ Renderizando ${STATE.currentIndicator.label}...`);
    
    clearMap();
    
    const values = Object.values(STATE.currentData).filter(v => Number.isFinite(v) && v > 0);
    if (values.length === 0) {
        showError('Nenhum dado disponível para este indicador');
        return;
    }
    
    const breaks = calculateBreaks(values, 5);
    const palette = getColorPalette();
    
    const enrichedGeojson = buildGeojsonWithValues(STATE.geojson, STATE.currentData);
    
    if (!STATE.map.getSource(MAP_IDS.source)) {
        STATE.map.addSource(MAP_IDS.source, {
            type: 'geojson',
            data: enrichedGeojson
        });
    } else {
        STATE.map.getSource(MAP_IDS.source).setData(enrichedGeojson);
    }
    
    const fillColorExpression = buildFillColorExpression(breaks, palette);
    
    if (!STATE.map.getLayer(MAP_IDS.fill)) {
        STATE.map.addLayer({
            id: MAP_IDS.fill,
            type: 'fill',
            source: MAP_IDS.source,
            paint: {
                'fill-color': fillColorExpression,
                'fill-opacity': 0.7
            }
        });
    } else {
        STATE.map.setPaintProperty(MAP_IDS.fill, 'fill-color', fillColorExpression);
    }
    
    if (!STATE.map.getLayer(MAP_IDS.line)) {
        STATE.map.addLayer({
            id: MAP_IDS.line,
            type: 'line',
            source: MAP_IDS.source,
            paint: {
                'line-color': '#ffffff',
                'line-width': 1
            }
        });
    }
    
    bindMapInteractions();
    updateLegendDynamic(breaks, palette);
    updateStatistics(values);
    
    // Fit bounds
    const bounds = getGeojsonBounds(enrichedGeojson);
    if (bounds) {
        STATE.map.fitBounds(bounds, { padding: 30, animate: false });
    }
}

// ========== FUNÇÕES AUXILIARES ==========
function calculateBreaks(values, numClasses) {
    const sorted = [...values].sort((a, b) => a - b);
    const breaks = [];
    for (let i = 1; i < numClasses; i++) {
        const pos = (i / numClasses) * (sorted.length - 1);
        const idx = Math.floor(pos);
        const rest = pos - idx;
        const val = idx + 1 < sorted.length 
            ? sorted[idx] * (1 - rest) + sorted[idx + 1] * rest 
            : sorted[idx];
        breaks.push(val);
    }
    return breaks;
}

function getColorPalette() {
    return ['#E6F4EA', '#C1E3CC', '#90D0A9', '#3BB273', '#168F49'];
}

function buildFillColorExpression(breaks, palette) {
    let expr = ['case'];
    for (let i = 0; i < breaks.length; i++) {
        expr.push(['<=', ['get', 'value'], breaks[i]]);
        expr.push(palette[i]);
    }
    expr.push(palette[palette.length - 1]);
    return expr;
}

function buildGeojsonWithValues(geojson, dataByMunicipio) {
    return {
        ...geojson,
        features: geojson.features.map(feature => ({
            ...feature,
            properties: {
                ...feature.properties,
                value: dataByMunicipio[feature.properties.name] || null
            }
        }))
    };
}

function getGeojsonBounds(geojson) {
    let bounds = null;
    geojson.features.forEach(feature => {
        const featureBounds = getFeatureBounds(feature);
        if (featureBounds) {
            if (!bounds) bounds = featureBounds;
            else bounds = extendBounds(bounds, featureBounds);
        }
    });
    return bounds;
}

function getFeatureBounds(feature) {
    const coords = feature.geometry.coordinates;
    let bounds = null;
    if (feature.geometry.type === 'Polygon') {
        coords[0].forEach(coord => {
            if (!bounds) bounds = [[coord[0], coord[1]], [coord[0], coord[1]]];
            else extendBoundsFromCoordinates(bounds, [coord]);
        });
    }
    return bounds;
}

function extendBounds(bounds, featureBounds) {
    return [
        [Math.min(bounds[0][0], featureBounds[0][0]), Math.min(bounds[0][1], featureBounds[0][1])],
        [Math.max(bounds[1][0], featureBounds[1][0]), Math.max(bounds[1][1], featureBounds[1][1])]
    ];
}

function extendBoundsFromCoordinates(bounds, coordinates) {
    coordinates.forEach(coord => {
        bounds[0][0] = Math.min(bounds[0][0], coord[0]);
        bounds[0][1] = Math.min(bounds[0][1], coord[1]);
        bounds[1][0] = Math.max(bounds[1][0], coord[0]);
        bounds[1][1] = Math.max(bounds[1][1], coord[1]);
    });
}

function bindMapInteractions() {
    const map = STATE.map;
    if (!map.getLayer(MAP_IDS.fill)) return;
    
    map.on('mousemove', MAP_IDS.fill, (e) => {
        if (e.features.length > 0) {
            const municipio = e.features[0].properties.name;
            const valor = e.features[0].properties.value;
            updateInfoPanel(municipio, valor);
        }
    });
    
    map.on('mouseleave', MAP_IDS.fill, () => {
        resetUI();
    });
}

function clearMap() {
    const map = STATE.map;
    if (map.getLayer(MAP_IDS.fill)) map.removeLayer(MAP_IDS.fill);
    if (map.getLayer(MAP_IDS.line)) map.removeLayer(MAP_IDS.line);
    if (map.getSource(MAP_IDS.source)) map.removeSource(MAP_IDS.source);
}

function updateInfoPanel(municipio, valor) {
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    if (infoText) infoText.style.display = 'none';
    if (infoDetails) {
        infoDetails.innerHTML = `
            <div class="info-item">
                <label>Município</label>
                <strong>${municipio}</strong>
            </div>
            <div class="info-item">
                <label>${STATE.currentIndicator?.label || 'Indicador'}</label>
                <strong>${formatValue(valor, STATE.currentIndicator?.unit)}</strong>
            </div>
        `;
        infoDetails.classList.add('show');
    }
}

function updateLegendDynamic(breaks, palette) {
    const legendContent = document.getElementById('legend-content');
    if (!legendContent) return;
    
    const values = Object.values(STATE.currentData).filter(v => Number.isFinite(v));
    if (values.length === 0) {
        legendContent.innerHTML = '<p class="text-muted">Sem dados</p>';
        return;
    }
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const ranges = [min, ...breaks, max];
    
    let html = '';
    for (let i = 0; i < ranges.length - 1; i++) {
        const color = palette[Math.min(i, palette.length - 1)];
        const label = `${formatValue(ranges[i], STATE.currentIndicator?.unit)} – ${formatValue(ranges[i + 1], STATE.currentIndicator?.unit)}`;
        html += `<div class="legend-item"><div class="legend-color" style="background-color: ${color}"></div><span>${label}</span></div>`;
    }
    legendContent.innerHTML = html;
}

function updateStatistics(values) {
    const statsRow = document.getElementById('stats-row');
    if (!statsRow) return;
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    statsRow.innerHTML = `
        <div class="stat-box">
            <label>Mínimo</label>
            <strong>${formatValue(min, STATE.currentIndicator?.unit)}</strong>
        </div>
        <div class="stat-box">
            <label>Máximo</label>
            <strong>${formatValue(max, STATE.currentIndicator?.unit)}</strong>
        </div>
        <div class="stat-box">
            <label>Média</label>
            <strong>${formatValue(avg, STATE.currentIndicator?.unit)}</strong>
        </div>
    `;
}

function formatValue(value, unit) {
    if (!Number.isFinite(value)) return '-';
    if (unit === 'R$') return 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    if (unit === '%') return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' %';
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + (unit ? ' ' + unit : '');
}

function updateCategoryBadge(category) {
    const badge = document.getElementById('categoryBadge');
    if (!badge) return;
    const label = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    badge.textContent = label;
}

function renderTerritoryGallery() {
    const gallery = document.getElementById('territory-gallery');
    if (!gallery) return;
    const message = '<p class="text-muted">Mapas de Território não disponíveis para este ano</p>';
    gallery.innerHTML = message;
    gallery.style.display = 'flex';
    
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) mapContainer.style.display = 'none';
}

function resetUI() {
    const infoText = document.getElementById('info-text');
    const infoDetails = document.getElementById('info-details');
    
    if (infoText) infoText.style.display = 'block';
    if (infoDetails) infoDetails.classList.remove('show');
}

function showLoading(show) {
    // Implementar conforme necessário
}

function showError(message) {
    alert('Erro: ' + message);
}

// Iniciar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
