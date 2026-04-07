/**
 * Funcionalidades Avançadas do Mapa Interativo
 * Inclui: Busca, Filtros, Comparação, Série Histórica, 3D e Exportação
 */

(function() {
    'use strict';

    // Estado global das funcionalidades avançadas
    const advancedState = {
        searchResults: [],
        comparisonList: [],
        is3DMode: false,
        isFullscreen: false,
        selectedMunicipios: [],
        charts: {
            comparison: null,
            history: null
        },
        originalPitch: 0,
        originalBearing: 0
    };

    // Dados de exemplo para regiões de integração
    const regioes = [
        'Araguaia', 'Baixo Amazonas', 'Carajás', 'Guajará', 'Guamá',
        'Lago de Tucuruí', 'Marajó', 'Rio Caeté', 'Rio Capim', 'Tapajós',
        'Tocantins', 'Xingu'
    ];

    // ===== INICIALIZAÇÃO =====
    document.addEventListener('DOMContentLoaded', function() {
        // Delay maior para garantir que STATE.map está inicializado
        setTimeout(function() {
            if (!window.STATE || !window.STATE.map) {
                console.warn('Tentando novamente em 2 segundos...');
                setTimeout(initializeAdvancedFeatures, 2000);
                return;
            }
            initializeAdvancedFeatures();
        }, 3000);
    });

    function initializeAdvancedFeatures() {
        // Forçar redimensionamento do mapa
        if (window.STATE && window.STATE.map) {
            console.log('Forçando redimensionamento do mapa...');
            window.STATE.map.resize();
            console.log('Tamanho do mapa:', window.STATE.map.getContainer().offsetWidth, 'x', window.STATE.map.getContainer().offsetHeight);
        }
        
        initSearchFunctionality();
        initAdvancedFilters();
        init3DToggle();
        initFullscreenToggle();
        initComparison();
        initHistoryChart();
        initStatsPanel();
        initExportFunctionality();
        populateRegionsFilter();
        
        // Integração com mapa (vai tentar reconectar automaticamente se não estiver pronto)
        setupMapClickIntegration();
        
        console.log('✅ Funcionalidades avançadas inicializadas');
    }

    // ===== BUSCA DE MUNICÍPIOS =====
    function initSearchFunctionality() {
        const searchInput = document.getElementById('searchMunicipio');
        const searchResults = document.getElementById('searchResults');
        const clearBtn = document.getElementById('clearSearch');

        if (!searchInput || !searchResults) {
            console.warn('Elementos de busca não encontrados no DOM');
            return;
        }

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                clearBtn.style.display = 'none';
                return;
            }

            clearBtn.style.display = 'block';
            performSearch(query);
        });

        clearBtn?.addEventListener('click', function() {
            searchInput.value = '';
            searchResults.classList.remove('active');
            clearBtn.style.display = 'none';
        });

        // Fechar resultados ao clicar fora
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    function performSearch(query) {
        if (!window.STATE || !window.STATE.geojson) {
            console.warn('GeoJSON não carregado ainda');
            return;
        }

        // Buscar nos municípios do geojson
        const results = window.STATE.geojson.features
            .filter(feature => {
                const nome = feature.properties.name || feature.properties.NM_MUN || '';
                return nome.toLowerCase().includes(query);
            })
            .slice(0, 10) // Limitar a 10 resultados
            .map(feature => ({
                nome: feature.properties.name || feature.properties.NM_MUN,
                regiao: feature.properties.regiao || 'N/A',
                feature: feature
            }));

        displaySearchResults(results);
    }

    function displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        
        if (!searchResults) {
            console.warn('Elemento searchResults não encontrado no DOM');
            return;
        }
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">Nenhum município encontrado</div>';
            searchResults.classList.add('active');
            return;
        }

        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" data-municipio="${result.nome}">
                <div class="search-result-name">${result.nome}</div>
                <div class="search-result-region">${result.regiao}</div>
            </div>
        `).join('');

        // Adicionar evento de clique
        searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                const municipio = results[index];
                zoomToMunicipio(municipio.feature);
                searchResults.classList.remove('active');
            });
        });

        searchResults.classList.add('active');
    }

    function zoomToMunicipio(feature) {
        if (!window.STATE || !window.STATE.map || !feature) return;
        
        try {
            const bounds = getFeatureBounds(feature);
            if (bounds) {
                window.STATE.map.fitBounds(bounds, { 
                    padding: 80,
                    duration: 1000
                });
            }
        } catch (error) {
            console.error('Erro ao dar zoom:', error);
        }
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

    // ===== FILTROS AVANÇADOS =====
    // ===== FILTROS AVANÇADOS =====
    function initAdvancedFilters() {
        const btnAdvanced = document.getElementById('btnAdvancedFilters');
        const panel = document.getElementById('advancedFiltersPanel');
        const btnApply = document.getElementById('btnApplyFilters');
        const btnClear = document.getElementById('btnClearFilters');

        if (!btnAdvanced || !panel) {
            console.warn('Elementos de filtros avançados não encontrados no DOM');
            return;
        }

        btnAdvanced.addEventListener('click', function() {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        btnApply?.addEventListener('click', applyAdvancedFilters);
        btnClear?.addEventListener('click', clearAdvancedFilters);
    }

    function applyAdvancedFilters() {
        const valueMin = document.getElementById('valueMin');
        const valueMax = document.getElementById('valueMax');
        const regionFilter = document.getElementById('regionFilter');

        if (!valueMin || !valueMax || !regionFilter) {
            console.warn('Campos de filtro não encontrados no DOM');
            return;
        }

        const minVal = parseFloat(valueMin.value) || -Infinity;
        const maxVal = parseFloat(valueMax.value) || Infinity;
        const region = regionFilter.value;

        if (!window.STATE || !window.STATE.map || !window.STATE.currentData) {
            alert('Carregue um indicador primeiro');
            return;
        }

        console.log('Aplicando filtros:', { minVal, maxVal, region });
        
        // Filtrar dados
        const filteredData = {};
        Object.keys(window.STATE.currentData).forEach(key => {
            const value = window.STATE.currentData[key];
            if (value >= minVal && value <= maxVal) {
                // Se houver filtro de região, aplicar também
                if (!region) {
                    filteredData[key] = value;
                } else {
                    // Verificar região do município no geojson
                    const feature = window.STATE.geojson.features.find(f => 
                        (f.properties.name || f.properties.NM_MUN) === key
                    );
                    if (feature && feature.properties.regiao === region) {
                        filteredData[key] = value;
                    }
                }
            }
        });

        console.log('Municípios filtrados:', Object.keys(filteredData).length);
        
        // Atualizar visualização (usando dados filtrados temporariamente)
        if (Object.keys(filteredData).length === 0) {
            alert('Nenhum município corresponde aos filtros aplicados');
            return;
        }

        // Salvar dados originais e aplicar filtrados
        if (!window.STATE.originalData) {
            window.STATE.originalData = window.STATE.currentData;
        }
        window.STATE.currentData = filteredData;
        
        // Recarregar visualização
        if (typeof window.updateVisualization === 'function') {
            window.updateVisualization();
        }
    }

    function clearAdvancedFilters() {
        const valueMin = document.getElementById('valueMin');
        const valueMax = document.getElementById('valueMax');
        const regionFilter = document.getElementById('regionFilter');

        if (!valueMin || !valueMax || !regionFilter) {
            console.warn('Campos de filtro não encontrados no DOM');
            return;
        }

        valueMin.value = '';
        valueMax.value = '';
        regionFilter.value = '';
        
        // Restaurar dados originais
        if (window.STATE && window.STATE.originalData) {
            window.STATE.currentData = window.STATE.originalData;
            delete window.STATE.originalData;
            
            // Recarregar visualização
            if (typeof window.updateVisualization === 'function') {
                window.updateVisualization();
            }
        }
    }

    function populateRegionsFilter() {
        const regionFilter = document.getElementById('regionFilter');
        if (!regionFilter) return;

        regioes.forEach(regiao => {
            const option = document.createElement('option');
            option.value = regiao;
            option.textContent = regiao;
            regionFilter.appendChild(option);
        });
    }

    // ===== VISUALIZAÇÃO 3D =====
    // ===== VISUALIZAÇÃO 3D =====
    function init3DToggle() {
        const btn3D = document.getElementById('btn3DToggle');
        
        if (!btn3D) {
            console.warn('Botão 3D não encontrado no DOM');
            return;
        }

        btn3D.addEventListener('click', function() {
            if (!window.STATE || !window.STATE.map) {
                alert('Mapa não está pronto');
                return;
            }

            advancedState.is3DMode = !advancedState.is3DMode;
            this.classList.toggle('active');
            
            if (advancedState.is3DMode) {
                // Salvar posição original
                advancedState.originalPitch = window.STATE.map.getPitch();
                advancedState.originalBearing = window.STATE.map.getBearing();
                enable3DView();
            } else {
                disable3DView();
            }
        });
    }

    function enable3DView() {
        console.log('Ativando visualização 3D');
        // Pitch de 35 graus (mais suave que 60)
        window.STATE.map.easeTo({ 
            pitch: 35, 
            bearing: 0,
            duration: 1000
        });
        
        // Adicionar classe visual
        document.body.classList.add('map-3d-active');
    }

    function disable3DView() {
        console.log('Desativando visualização 3D');
        // Retornar à posição original
        window.STATE.map.easeTo({ 
            pitch: advancedState.originalPitch || 0, 
            bearing: advancedState.originalBearing || 0,
            duration: 1000
        });
        
        // Remover classe visual
        document.body.classList.remove('map-3d-active');
    }

    // ===== FULLSCREEN =====
    function initFullscreenToggle() {
        const btnFullscreen = document.getElementById('btnFullscreen');
        
        if (!btnFullscreen) {
            console.warn('Botão fullscreen não encontrado no DOM');
            return;
        }

        btnFullscreen.addEventListener('click', function() {
            advancedState.isFullscreen = !advancedState.isFullscreen;
            document.body.classList.toggle('fullscreen-mode');
            this.classList.toggle('active');
            
            // Atualizar ícone
            const icon = this.querySelector('i');
            if (advancedState.isFullscreen) {
                icon.className = 'bi bi-fullscreen-exit';
            } else {
                icon.className = 'bi bi-arrows-fullscreen';
            }
        });
    }

    // ===== COMPARAÇÃO DE MUNICÍPIOS =====
    function initComparison() {
        // A lógica de adicionar municípios à comparação
        // será chamada quando o usuário clicar no mapa
        console.log('Sistema de comparação inicializado');
    }

    function setupMapClickIntegration() {
        // Adicionar listener para cliques no mapa
        if (!window.STATE || !window.STATE.map) {
            console.warn('Mapa não disponível ainda, tentando novamente em 1 segundo...');
            setTimeout(setupMapClickIntegration, 1000);
            return;
        }

        console.log('✅ Integrando eventos de clique do mapa');

        // Adicionar evento de click para comparação
        window.STATE.map.on('click', 'municipios-fill', function(e) {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                const nome = feature.properties.name || feature.properties.NM_MUN;
                const valor = window.STATE.currentData ? window.STATE.currentData[nome] : null;
                
                if (valor !== null && valor !== undefined) {
                    addToComparison(nome, valor);
                }
            }
        });
    }

    function addToComparison(municipio, valor) {
        if (advancedState.comparisonList.length >= 5) {
            alert('Máximo de 5 municípios para comparação');
            return;
        }

        if (advancedState.comparisonList.find(m => m.nome === municipio)) {
            console.log('Município já está na lista de comparação');
            return;
        }

        advancedState.comparisonList.push({ nome: municipio, valor: valor });
        updateComparisonPanel();
        
        // Ativar tab de comparação
        const compareTab = document.getElementById('compare-tab');
        if (compareTab) {
            compareTab.click();
        }
    }

    function updateComparisonPanel() {
        const container = document.getElementById('comparison-list');
        const canvas = document.getElementById('comparisonChart');

        if (!container || !canvas) {
            console.warn('Elementos de comparação não encontrados no DOM');
            return;
        }

        if (advancedState.comparisonList.length === 0) {
            container.innerHTML = '<p class="text-muted small" data-i18n="mapa_comparacao_vazia">Nenhum município selecionado</p>';
            canvas.style.display = 'none';
            return;
        }

        // Exibir lista
        container.innerHTML = advancedState.comparisonList.map((item, index) => `
            <div class="comparison-item">
                <span class="comparison-item-name">${item.nome}</span>
                <span class="comparison-item-value">${formatValue(item.valor)}</span>
                <button class="btn-remove-comparison" onclick="window.MapAdvanced.removeFromComparison(${index})">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `).join('');

        // Criar/atualizar gráfico
        canvas.style.display = 'block';
        updateComparisonChart();
    }

    function updateComparisonChart() {
        const canvas = document.getElementById('comparisonChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        if (advancedState.charts.comparison) {
            advancedState.charts.comparison.destroy();
        }

        advancedState.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: advancedState.comparisonList.map(m => m.nome),
                datasets: [{
                    label: window.STATE?.currentIndicator?.label || 'Valor',
                    data: advancedState.comparisonList.map(m => m.valor),
                    backgroundColor: 'rgba(40, 167, 69, 0.6)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    window.removeFromComparison = function(index) {
        advancedState.comparisonList.splice(index, 1);
        updateComparisonPanel();
    };

    // ===== SÉRIE HISTÓRICA =====
    function initHistoryChart() {
        // Será populado quando um município for selecionado
        console.log('Sistema de histórico inicializado');
        
        // Adicionar listener para quando um município for clicado
        if (window.STATE && window.STATE.map) {
            window.STATE.map.on('click', 'municipios-fill', function(e) {
                if (e.features && e.features.length > 0) {
                    const feature = e.features[0];
                    const nome = feature.properties.name || feature.properties.NM_MUN;
                    loadHistoryForMunicipio(nome);
                }
            });
        }
    }

    async function loadHistoryForMunicipio(municipio) {
        if (!window.STATE || !window.STATE.currentIndicator) {
            console.warn('Nenhum indicador selecionado');
            return;
        }

        // Tentar carregar dados históricos do mesmo indicador
        const indicatorSlug = window.STATE.currentIndicator.slug;
        const historicalData = await fetchHistoricalData(indicatorSlug, municipio);
        
        if (historicalData && historicalData.anos && historicalData.valores) {
            showHistoryFor(municipio, historicalData);
        } else {
            // Mostrar dados simulados se não houver histórico
            const mockData = {
                anos: ['2021', '2022', '2023', '2024', '2025'],
                valores: generateMockHistoricalData()
            };
            showHistoryFor(municipio, mockData);
        }
    }

    async function fetchHistoricalData(indicatorSlug, municipio) {
        // Tentar carregar dados de anos anteriores
        const years = ['2021', '2022', '2023', '2024', '2025'];
        const valores = [];
        const anos = [];
        
        for (const year of years) {
            try {
                // Ajustar slug para incluir ano
                const path = `data/${indicatorSlug.replace(/_\d{4}$/, '')}_${year}.json`;
                const response = await fetch(`../${path}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data[municipio] !== undefined) {
                        anos.push(year);
                        valores.push(data[municipio]);
                    }
                }
            } catch (error) {
                // Ignorar erros silenciosamente
            }
        }
        
        if (anos.length > 0) {
            return { anos, valores };
        }
        return null;
    }

    function generateMockHistoricalData() {
        // Gerar dados simulados com variação realista
        const base = Math.random() * 10000 + 1000;
        return Array.from({length: 5}, (_, i) => {
            const variation = (Math.random() - 0.5) * base * 0.2;
            return Math.round(base + variation);
        });
    }

    function showHistoryFor(municipio, historicalData) {
        const infoDiv = document.getElementById('history-info');
        const canvas = document.getElementById('historyChart');
        
        if (!canvas || !infoDiv) {
            console.warn('Elementos de histórico não encontrados no DOM');
            return;
        }
        
        const ctx = canvas.getContext('2d');

        infoDiv.innerHTML = `<p class="text-muted small">Evolução temporal: <strong>${municipio}</strong></p>`;

        if (advancedState.charts.history) {
            advancedState.charts.history.destroy();
        }

        advancedState.charts.history = new Chart(ctx, {
            type: 'line',
            data: {
                labels: historicalData.anos,
                datasets: [{
                    label: window.STATE?.currentIndicator?.label || 'Valor',
                    data: historicalData.valores,
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatValue(value);
                            }
                        }
                    }
                }
            }
        });
        
        // Ativar tab de histórico
        const historyTab = document.getElementById('history-tab');
        if (historyTab) {
            historyTab.click();
        }
    }

    // ===== ESTATÍSTICAS REGIONAIS =====
    function initStatsPanel() {
        // Atualizar estatísticas quando o indicador mudar
        console.log('Sistema de estatísticas inicializado');
        
        // Observar mudanças no seletor de indicadores
        const indicatorSelect = document.getElementById('indicator');
        if (indicatorSelect) {
            indicatorSelect.addEventListener('change', function() {
                setTimeout(updateRegionalStatsFromCurrent, 500);
            });
        }
        
        // Atualizar ao carregar
        setTimeout(updateRegionalStatsFromCurrent, 1500);
    }

    function updateRegionalStatsFromCurrent() {
        if (!window.STATE || !window.STATE.currentData) {
            return;
        }
        
        // Converter dados atuais em array de valores
        const data = Object.values(window.STATE.currentData)
            .filter(v => typeof v === 'number' && !isNaN(v));
        
        if (data.length === 0) {
            return;
        }
        
        updateRegionalStats(data);
    }

    function updateRegionalStats(data) {
        const container = document.getElementById('regionalStats');
        
        if (!container) {
            console.warn('Elemento regionalStats não encontrado no DOM');
            return;
        }
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-muted small">Selecione um indicador</p>';
            return;
        }

        const stats = calculateStats(data);
        
        container.innerHTML = `
            <div class="stat-item">
                <span class="stat-label" data-i18n="mapa_estatisticas_media">Média Estadual</span>
                <span class="stat-value">${formatValue(stats.media)}</span>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: 100%; background: linear-gradient(90deg, #28a745 0%, #20c997 100%);"></div>
                </div>
            </div>
            <div class="stat-item">
                <span class="stat-label" data-i18n="mapa_estatisticas_maior">Maior Valor</span>
                <span class="stat-value">${formatValue(stats.max)}</span>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: 100%; background: #28a745;"></div>
                </div>
            </div>
            <div class="stat-item">
                <span class="stat-label" data-i18n="mapa_estatisticas_menor">Menor Valor</span>
                <span class="stat-value">${formatValue(stats.min)}</span>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: ${(stats.min / stats.max * 100).toFixed(1)}%; background: #ffc107;"></div>
                </div>
            </div>
            <div class="stat-item">
                <span class="stat-label" data-i18n="mapa_estatisticas_desvio">Desvio Padrão</span>
                <span class="stat-value">${formatValue(stats.desvio)}</span>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: ${Math.min(stats.desvio / stats.max * 100, 100).toFixed(1)}%; background: #6c757d;"></div>
                </div>
            </div>
            <div class="stat-item mt-2">
                <span class="stat-label">Total de Municípios</span>
                <span class="stat-value">${data.length}</span>
            </div>
        `;
        
        // Re-aplicar traduções se necessário
        if (typeof changeLanguage === 'function' && localStorage.getItem('language')) {
            changeLanguage(localStorage.getItem('language'));
        }
    }

    function calculateStats(data) {
        const valores = data.filter(v => typeof v === 'number' && !isNaN(v));
        const sum = valores.reduce((a, b) => a + b, 0);
        const media = sum / valores.length;
        const max = Math.max(...valores);
        const min = Math.min(...valores);
        
        const variance = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / valores.length;
        const desvio = Math.sqrt(variance);

        return { media, max, min, desvio };
    }

    // ===== EXPORTAÇÃO =====
    function initExportFunctionality() {
        const btnExport = document.getElementById('btnExportData');
        
        if (!btnExport) {
            console.warn('Botão export não encontrado no DOM');
            return;
        }

        btnExport.addEventListener('click', function() {
            showExportModal();
        });
    }

    function showExportModal() {
        const options = confirm(
            'Exportar dados?\n\n' +
            'OK = Exportar CSV dos dados visíveis\n' +
            'Cancelar = Voltar'
        );

        if (options) {
            exportToCSV();
        }
    }

    function exportToCSV() {
        if (!window.STATE || !window.STATE.currentData || !window.STATE.currentIndicator) {
            alert('Nenhum dado disponível para exportar');
            return;
        }

        console.log('Exportando para CSV...');
        
        // Criar CSV
        let csv = 'Município,Valor\n';
        Object.keys(window.STATE.currentData).forEach(key => {
            const value = window.STATE.currentData[key];
            csv += `"${key}",${value}\n`;
        });

        // Download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const filename = `${window.STATE.currentIndicator.slug}_${new Date().toISOString().split('T')[0]}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ CSV exportado:', filename);
    }

    function exportMapToPNG() {
        console.log('Exportando mapa para PNG...');
        
        if (!window.STATE || !window.STATE.map) {
            alert('Mapa não disponível');
            return;
        }

        // Usar API do MapLibre para capturar
        const canvas = window.STATE.map.getCanvas();
        const link = document.createElement('a');
        link.download = `mapa_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        console.log('✅ Mapa exportado como PNG');
    }

    // ===== UTILITÁRIOS =====
    function formatValue(value) {
        if (typeof value === 'number') {
            return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
        }
        return value;
    }

    // Expor funções necessárias globalmente
    window.MapAdvanced = {
        addToComparison,
        showHistoryFor: loadHistoryForMunicipio,
        updateRegionalStats: updateRegionalStatsFromCurrent,
        zoomToMunicipio,
        removeFromComparison: window.removeFromComparison
    };

    console.log('✅ Funcionalidades avançadas do mapa carregadas');
})();
