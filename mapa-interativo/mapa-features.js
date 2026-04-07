// Funcionalidades Avançadas para Mapa Interativo
// Inclui: Busca, Ranking, Histórico, Filtros por Região, Comparador

class MapaFeaturesAdvanced {
    constructor() {
        this.categoriaSelecionada = null;
        this.indicadorSelecionado = null;
        this.municipiosComparados = [];
        this.chartHistorico = null;
        this.chartComparacao = null;
        this.chart3D = null;
    }

    // ========== 1. BUSCA COM AUTOCOMPLETE ==========
    inicializarBusca() {
        try {
            const searchInput = document.getElementById('searchMunicipio');
            if (!searchInput) {
                console.warn('⚠️ Campo de busca não encontrado');
                return;
            }

            const listaMunicipios = Object.keys(MUNICIPIOS_EXPANDIDOS);
            
            searchInput.addEventListener('input', (e) => {
                const valor = e.target.value.toLowerCase();
                const resultsContainer = document.getElementById('searchResults');
                
                if (!resultsContainer) return;
            
            if (valor.length === 0) {
                resultsContainer.innerHTML = '';
                resultsContainer.style.display = 'none';
                return;
            }

            const resultados = listaMunicipios.filter(nome => 
                nome.toLowerCase().includes(valor)
            );

            if (resultados.length === 0) {
                resultsContainer.innerHTML = '<div class="search-no-results">Nenhum município encontrado</div>';
                resultsContainer.style.display = 'block';
                return;
            }

            resultsContainer.innerHTML = resultados.map(nome => `
                <div class="search-result-item" onclick="window.mapaFeatures.selecionarMunicipioBusca('${nome}')">
                    <i class="bi bi-geo-alt"></i>
                    <span>${nome}</span>
                    <small>${MUNICIPIOS_EXPANDIDOS[nome].regiao}</small>
                </div>
            `).join('');
            
            resultsContainer.style.display = 'block';
            });

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (e.target !== searchInput) {
                    const resultsContainer = document.getElementById('searchResults');
                    if (resultsContainer) {
                        resultsContainer.style.display = 'none';
                    }
                }
            });
            
            console.log('✅ Busca inicializada com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar busca:', error);
        }
    }

    selecionarMunicipioBusca(nome) {
        try {
            const mun = MUNICIPIOS_EXPANDIDOS[nome];
            const searchInput = document.getElementById('searchMunicipio');
            if (searchInput) {
                searchInput.value = nome;
            }
            
            const resultsContainer = document.getElementById('searchResults');
            if (resultsContainer) {
                resultsContainer.style.display = 'none';
            }

            // Mostrar informações do município
            this.mostrarInfoMunicipio(nome, mun);
            console.log('✅ Município selecionado:', nome);
        } catch (error) {
            console.error('❌ Erro ao selecionar município:', error);
        }
    }

    mostrarInfoMunicipio(nome, mun) {
        try {
            const modalBody = document.getElementById('municipioModalBody');
            if (!modalBody) {
                console.warn('⚠️ Modal body não encontrado');
                return;
            }

            const stats = `
                <div class="municipio-detail-card">
                    <div class="detail-header">
                        <h3>${nome}</h3>
                        <span class="detail-region">${mun.regiao}</span>
                    </div>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Mesorregião</label>
                            <strong>${mun.mesorregiao}</strong>
                        </div>
                        <div class="detail-item">
                            <label>Coordenadas</label>
                            <strong>${mun.coords[0].toFixed(4)}, ${mun.coords[1].toFixed(4)}</strong>
                        </div>
                    </div>
                    <div class="detail-stats">
                        <h4>Indicadores Principais (2024)</h4>
                        <div class="stats-grid">
                            <div class="stat-box" style="border-left-color: #3498db;">
                                <label>População</label>
                                <strong>${mun.data.demografia.populacao[0].toLocaleString('pt-BR')}</strong>
                            </div>
                            <div class="stat-box" style="border-left-color: #e74c3c;">
                                <label>PIB</label>
                                <strong>R$ ${mun.data.economia.pib[0].toFixed(2)}B</strong>
                            </div>
                            <div class="stat-box" style="border-left-color: #27ae60;">
                                <label>IDH</label>
                                <strong>${mun.data.social.idh[0].toFixed(3)}</strong>
                            </div>
                            <div class="stat-box" style="border-left-color: #f39c12;">
                                <label>Saneamento</label>
                                <strong>${mun.data.infraestrutura.saneamento[0].toFixed(1)}%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            modalBody.innerHTML = stats;
            console.log('✅ Informações do município exibidas');
        } catch (error) {
            console.error('❌ Erro ao mostrar informações do município:', error);
        }
    }

    // ========== 2. TABELA DE RANKING ==========
    inicializarRanking() {
        try {
            const tabRanking = document.getElementById('tabRanking');
            if (!tabRanking) {
                console.warn('⚠️ Aba de ranking não encontrada');
                return;
            }

            tabRanking.addEventListener('click', () => {
                this.atualizarRanking();
            });
            console.log('✅ Ranking inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar ranking:', error);
        }
    }

    atualizarRanking() {
        try {
            const rankingBody = document.getElementById('rankingTableBody');
            if (!rankingBody) {
                console.warn('⚠️ Elemento de ranking não encontrado');
                return;
            }

            const categoria = document.getElementById('category').value;
            const indicador = document.getElementById('indicator').value;

            if (!categoria || !indicador) {
                rankingBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Selecione uma categoria e indicador</td></tr>';
                return;
            }

            const { valores } = calcularEstatisticas(categoria, indicador);
            const config = CATEGORIAS_CONFIG[categoria].indicadores[indicador];

            let html = '';
            valores.slice(0, 20).forEach((item, index) => {
                const percentual = (item.valor / valores[0].valor * 100).toFixed(1);
                const medalha = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                
                html += `
                    <tr class="ranking-row">
                        <td class="rank-position">${medalha} ${index + 1}</td>
                        <td class="rank-name">${item.nome}</td>
                        <td class="rank-value">${this.formatarValor(item.valor, config.decimals)} ${config.unit}</td>
                        <td class="rank-bar">
                            <div class="progress-bar" style="width: ${percentual}%;" title="${percentual}%"></div>
                        </td>
                    </tr>
                `;
            });

            rankingBody.innerHTML = html;
            console.log('✅ Ranking atualizado');
        } catch (error) {
            console.error('❌ Erro ao atualizar ranking:', error);
        }
    }

    // ========== 3. GRÁFICO HISTÓRICO ==========
    inicializarGraficoHistorico() {
        try {
            const tabHistorico = document.getElementById('tabHistorico');
            if (!tabHistorico) {
                console.warn('⚠️ Aba de histórico não encontrada');
                return;
            }

            tabHistorico.addEventListener('click', () => {
                this.atualizarGraficoHistorico();
            });
            console.log('✅ Gráfico histórico inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar gráfico histórico:', error);
        }
    }

    atualizarGraficoHistorico() {
        try {
            const categoria = document.getElementById('category').value;
            const indicador = document.getElementById('indicator').value;
            const chartDiv = document.getElementById('historicoChart');

            if (!categoria || !indicador || !chartDiv) {
                console.warn('⚠️ Categoria, indicador ou canvas não disponível');
                return;
            }

            // Verificar se o canvas está visível e tem dimensões
            const rect = chartDiv.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                console.warn('⚠️ Canvas sem dimensões visíveis, aguardando...');
                // Tentar novamente após um delay
                setTimeout(() => this.atualizarGraficoHistorico(), 100);
                return;
            }

            const primeiros5 = Object.keys(MUNICIPIOS_EXPANDIDOS).slice(0, 5);
            const datasets = primeiros5.map((nome, idx) => {
                const historico = getHistorico(nome, categoria, indicador);
                const cores = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6'];
                
                return {
                    label: nome,
                    data: historico,
                    borderColor: cores[idx],
                    backgroundColor: cores[idx] + '20',
                    tension: 0.3,
                    borderWidth: 2,
                    fill: true
                };
            });

            const ctx = chartDiv.getContext('2d');
            if (!ctx) {
                console.error('❌ Não foi possível obter contexto 2D do canvas');
                return;
            }

            // Destruir gráfico anterior se existir
            if (this.chartHistorico) {
                this.chartHistorico.destroy();
                this.chartHistorico = null;
            }

            // Criar novo gráfico
            this.chartHistorico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2020', '2021', '2022', '2023', '2024'],
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: `Histórico - ${CATEGORIAS_CONFIG[categoria].indicadores[indicador].label}`
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            console.log('✅ Gráfico histórico criado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao atualizar gráfico histórico:', error);
        }
    }

    // ========== 4. FILTROS POR REGIÃO ==========
    inicializarFiltroRegiao() {
        try {
            const selectRegiao = document.getElementById('filterRegiao');
            if (!selectRegiao) {
                console.warn('⚠️ Select de filtro de região não encontrado');
                return;
            }

            const regioes = {};
            for (const nome in MUNICIPIOS_EXPANDIDOS) {
                const regiao = MUNICIPIOS_EXPANDIDOS[nome].regiao;
                regioes[regiao] = true;
            }

            const opcoesRegiao = Object.keys(regioes).sort().map(regiao => 
                `<option value="${regiao}">${regiao}</option>`
            ).join('');

            selectRegiao.innerHTML = '<option value="">Todas as regiões</option>' + opcoesRegiao;

            selectRegiao.addEventListener('change', () => {
                this.filtrarPorRegiao(selectRegiao.value);
            });
            
            console.log('✅ Filtro por região inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar filtro de região:', error);
        }
    }

    filtrarPorRegiao(regiao) {
        try {
            const listaFiltrada = document.getElementById('listaFiltrada');
            if (!listaFiltrada) {
                console.warn('⚠️ Elemento de lista filtrada não encontrado');
                return;
            }

            let municipios = Object.keys(MUNICIPIOS_EXPANDIDOS);
            
            if (regiao) {
                municipios = municipios.filter(nome => 
                    MUNICIPIOS_EXPANDIDOS[nome].regiao === regiao
                );
            }

            const html = municipios.map(nome => {
                const mun = MUNICIPIOS_EXPANDIDOS[nome];
                return `
                    <div class="lista-item-regiao">
                        <div class="lista-item-header">
                            <strong>${nome}</strong>
                            <span class="lista-item-meso">${mun.mesorregiao}</span>
                        </div>
                        <div class="lista-item-stats">
                            <span>👥 ${mun.data.demografia.populacao[0].toLocaleString('pt-BR')}</span>
                            <span>💰 R$ ${mun.data.economia.pib[0].toFixed(1)}B</span>
                            <span>📊 IDH ${mun.data.social.idh[0].toFixed(3)}</span>
                        </div>
                    </div>
                `;
            }).join('');

            listaFiltrada.innerHTML = html;
            console.log('✅ Filtro aplicado: ' + (regiao || 'Todas as regiões'));
        } catch (error) {
            console.error('❌ Erro ao filtrar por região:', error);
        }
    }

    // ========== 5. COMPARADOR DE MUNICÍPIOS ==========
    inicializarComparador() {
        try {
            const btnAdicionarComparacao = document.getElementById('btnAdicionarComparacao');
            if (!btnAdicionarComparacao) {
                console.warn('⚠️ Botão de adição de comparação não encontrado');
                return;
            }

            btnAdicionarComparacao.addEventListener('click', () => {
                const selectMun = document.getElementById('selectMunicipioComparacao');
                const municipio = selectMun.value;

                if (!municipio) {
                    alert('Selecione um município');
                    return;
                }

                if (this.municipiosComparados.includes(municipio)) {
                    alert('Município já adicionado');
                    return;
                }

                if (this.municipiosComparados.length >= 5) {
                    alert('Máximo de 5 municípios para comparação');
                    return;
                }

                this.municipiosComparados.push(municipio);
                this.atualizarListaComparacao();
                selectMun.value = '';
            });

            // Popoular select de municípios
            const selectMun = document.getElementById('selectMunicipioComparacao');
            if (selectMun) {
                const opcoesHtml = Object.keys(MUNICIPIOS_EXPANDIDOS)
                    .map(nome => `<option value="${nome}">${nome}</option>`)
                    .join('');
                selectMun.innerHTML = '<option value="">Selecione um município...</option>' + opcoesHtml;
            }
            
            console.log('✅ Comparador inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar comparador:', error);
        }
    }

    atualizarListaComparacao() {
        try {
            const listaMun = document.getElementById('listaComparacaoMunicipios');
            if (!listaMun) {
                console.warn('⚠️ Elemento de lista de comparação não encontrado');
                return;
            }

            const html = this.municipiosComparados.map((nome, idx) => `
                <div class="comparacao-item">
                    <span>${nome}</span>
                    <button class="btn-remove-comparacao" onclick="window.mapaFeatures.removerComparacao(${idx})">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `).join('');

            listaMun.innerHTML = html || '<p class="text-muted">Nenhum município selecionado</p>';

            if (this.municipiosComparados.length > 0) {
                this.atualizarGraficoComparacao();
            }
            console.log('✅ Lista de comparação atualizada');
        } catch (error) {
            console.error('❌ Erro ao atualizar lista de comparação:', error);
        }
    }

    removerComparacao(idx) {
        try {
            this.municipiosComparados.splice(idx, 1);
            this.atualizarListaComparacao();
            console.log('✅ Município removido da comparação');
        } catch (error) {
            console.error('❌ Erro ao remover comparação:', error);
        }
    }

    atualizarGraficoComparacao() {
        try {
            const categoria = document.getElementById('category').value;
            const indicador = document.getElementById('indicator').value;
            const chartDiv = document.getElementById('comparacaoChart');

            if (!categoria || !indicador || !chartDiv) {
                console.warn('⚠️ Categoria, indicador ou canvas de comparação não disponível');
                return;
            }

            if (this.municipiosComparados.length === 0) {
                console.log('ℹ️ Nenhum município selecionado para comparação');
                return;
            }

            // Verificar se o canvas está visível
            const rect = chartDiv.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                console.warn('⚠️ Canvas de comparação sem dimensões, aguardando...');
                setTimeout(() => this.atualizarGraficoComparacao(), 100);
                return;
            }

            const cores = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6'];
            const labels = [];
            const valores = [];
            const backgroundColors = [];

            this.municipiosComparados.forEach((nome, idx) => {
                const valor = getMunicipioData(nome, categoria, indicador);
                labels.push(nome);
                valores.push(valor);
                backgroundColors.push(cores[idx]);
            });

            const ctx = chartDiv.getContext('2d');
            if (!ctx) {
                console.error('❌ Não foi possível obter contexto 2D do canvas de comparação');
                return;
            }

            // Destruir gráfico anterior
            if (this.chartComparacao) {
                this.chartComparacao.destroy();
                this.chartComparacao = null;
            }

            const config = CATEGORIAS_CONFIG[categoria].indicadores[indicador];
            const chartType = 'bar';

            this.chartComparacao = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: config.label,
                        data: valores,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    indexAxis: 'x',
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: `Comparação - ${config.label}`
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: config.unit
                            }
                        }
                    }
                }
            });
            console.log('✅ Gráfico de comparação criado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao atualizar gráfico de comparação:', error);
        }
    }

    // ========== UTILIDADES ==========
    formatarValor(valor, decimals = 2) {
        try {
            if (typeof valor !== 'number') return '—';
            
            if (decimals === 0) {
                return valor.toLocaleString('pt-BR');
            } else {
                return valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                });
            }
        } catch (error) {
            console.error('❌ Erro ao formatar valor:', error);
            return '—';
        }
    }

    inicializarTodos() {
        console.log('✅ Iniciando funcionalidades avançadas...');
        this.inicializarBusca();
        this.inicializarRanking();
        this.inicializarGraficoHistorico();
        this.inicializarFiltroRegiao();
        this.inicializarComparador();
        console.log('✅ Funcionalidades avançadas carregadas!');
    }
}

// Criar instância global
const mapaFeatures = new MapaFeaturesAdvanced();
window.mapaFeatures = mapaFeatures;

// Inicializar quando DOM estiver pronto (esperar mapa carregar)
document.addEventListener('DOMContentLoaded', () => {
    console.log('📍 DOM carregado. Aguardando inicialização do mapa...');
    
    // Aguardar um pouco mais para o mapa se inicializar
    setTimeout(() => {
        // Aguardar estado da aplicação estar pronto
        if (typeof window.initMapInterval !== 'undefined') {
            clearInterval(window.initMapInterval);
        }
        
        // Tentar inicializar em intervalo até o mapa estar pronto
        let tentativas = 0;
        const maxTentativas = 20;
        
        window.initMapInterval = setInterval(() => {
            tentativas++;
            
            // Verificar se elementos da página existem
            const mapElement = document.getElementById('map');
            const searchInput = document.getElementById('searchMunicipio');
            
            if (mapElement && searchInput && tentativas > 2) {
                clearInterval(window.initMapInterval);
                console.log('🗺️ Mapa pronto! Inicializando features...');
                mapaFeatures.inicializarTodos();
            } else if (tentativas >= maxTentativas) {
                clearInterval(window.initMapInterval);
                console.warn('⚠️ Timeout ao aguardar mapa. Inicializando features mesmo assim...');
                mapaFeatures.inicializarTodos();
            }
        }, 200);
    }, 100);
});
