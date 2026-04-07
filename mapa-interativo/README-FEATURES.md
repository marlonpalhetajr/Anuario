# Mapa Interativo - Funcionalidades Avançadas

## 📋 Resumo das Implementações

Este documento descreve as 5 funcionalidades avançadas implementadas no mapa interativo do Anuário Estatístico do Pará.

---

## 🔍 **1. BUSCA COM AUTOCOMPLETE**

**Localização:** Painel de controles, campo superior

**Funcionalidades:**
- 🔎 Campo de busca em tempo real
- 📍 Autocomplete com lista de municípios
- 🏷️ Exibição de região da cada município
- 📊 Clique para visualizar detalhes completos

**Arquivos envolvidos:**
- `mapa-features.js` → Método `inicializarBusca()` e `selecionarMunicipioBusca()`
- `dados-expandidos.js` → Lista de municípios

**Como usar:**
1. Digite o nome de um município no campo "Buscar município..."
2. Selecione um resultado da lista
3. Veja os detalhes em um painel pop-up

---

## 📊 **2. TABELA DE RANKING**

**Localização:** Aba "Ranking"

**Funcionalidades:**
- 🥇 Top 20 municípios ordenados por valor
- 📈 Medalhas para 1º, 2º e 3º lugares
- 📊 Barra visual comparativa
- 🔄 Atualiza automaticamente ao mudar indicador

**Tabelas:**
```
Posição | Município | Valor | Comparativo (%)
```

**Arquivos envolvidos:**
- `mapa-features.js` → Método `atualizarRanking()`
- `dados-expandidos.js` → Função `calcularEstatisticas()`

**Como usar:**
1. Selecione uma Categoria (Demografia, Economia, Infraestrutura, Social)
2. Selecione um Indicador
3. Clique na aba "Ranking"
4. Veja o ranking dos 20 principais municípios

---

## 📈 **3. GRÁFICO HISTÓRICO (2020-2024)**

**Localização:** Aba "Histórico"

**Funcionalidades:**
- 📊 Gráfico de linha com série temporal
- 🎨 Cores diferenciadas por município
- 📉 Mostra tendência dos 5 maiores municípios
- 🔄 Carregamento automático ao mudar indicador

**Dados:**
- Anos: 2020, 2021, 2022, 2023, 2024
- Municípios: Top 5 por tamanho de população
- Biblioteca: Chart.js 4.4.0

**Arquivos envolvidos:**
- `mapa-features.js` → Método `atualizarGraficoHistorico()`
- `dados-expandidos.js` → Função `getHistorico()`

**Como usar:**
1. Selecione uma Categoria e Indicador
2. Clique na aba "Histórico"
3. Observe o gráfico de série temporal com tendências

---

## 🗺️ **4. FILTROS POR REGIÃO**

**Localização:** Aba "Filtros"

**Funcionalidades:**
- 🗺️ Dropdown com todas as regiões do Pará
- 📍 Lista dinâmica de municípios por região
- 📊 Exibe principais indicadores (Pop., PIB, IDH)
- 💾 Atualiza em tempo real

**Regiões:**
- Metropolitana de Belém
- Nordeste Paraense
- Oeste Paraense
- Sudeste Paraense
- Carajás
- Tapajós
- Xingu
- Marajó
- Lago de Tucuruí

**Arquivos envolvidos:**
- `mapa-features.js` → Método `filtrarPorRegiao()`
- `dados-expandidos.js` → Função `getMunicipiosPorRegiao()`

**Como usar:**
1. Clique na aba "Filtros"
2. Selecione uma região no dropdown
3. Visualize todos os municípios da região com indicadores

---

## 🔄 **5. COMPARADOR DE MUNICÍPIOS**

**Localização:** Aba "Comparação"

**Funcionalidades:**
- ➕ Adicionar até 5 municípios para comparar
- 📊 Gráfico de barras com comparação visual
- 🎨 Cores diferentes para cada município
- ❌ Remover municípios da seleção
- 🔄 Atualiza automaticamente ao adicionar/remover

**Características:**
- Limite: 5 municípios simultâneos
- Tipo de gráfico: Barras
- Atualiza conforme indicador selecionado

**Arquivos envolvidos:**
- `mapa-features.js` → Métodos `inicializarComparador()`, `atualizarGraficoComparacao()`, `removerComparacao()`
- `dados-expandidos.js` → Funções auxiliares

**Como usar:**
1. Clique na aba "Comparação"
2. Selecione um município no dropdown
3. Clique em "Adicionar"
4. Repita para adicionar até 5 municípios
5. Veja o gráfico comparativo atualizar automaticamente
6. _(Opcional)_ Clique na aba "Ranking" ou selecione outro indicador para comparar
7. Remova municípios clicando no botão ❌

---

## 📁 **Estrutura de Arquivos**

```
mapa-interativo/
├── mapa-teste.html           # Página principal (HTML completo)
├── mapa-features.js          # Classe MapaFeaturesAdvanced (5 features)
├── dados-expandidos.js       # Dados de 15+ municípios com histórico
├── mapa-app.js              # Integração com MapLibre GL
├── paletas-cores.js         # Paletas de cores
├── config-loader.js         # Configuração do mapa
└── ...outros arquivos
```

---

## 🎨 **Dados Disponíveis**

### Categorias:
- **Demografia**: População, Densidade
- **Economia**: PIB, Desemprego, Salário Mínimo
- **Infraestrutura**: Saneamento, Eletrificação
- **Social**: IDH, Escolaridade

### Municípios Inclusos (15 principais):
1. Belém
2. Ananindeua
3. Santarém
4. Marabá
5. Castanhal
6. Parauapebas
7. Altamira
8. Marituba
9. Tucuruí
10. Capanema
11. Marapanim
12. Soure
13. Oriximiná
14. Breves
15. Abaetetuba

_Nota: Dados são fictícios/exemplo para demonstração. Substituir por dados reais ao integrar com backend._

---

## 🚀 **Como Iniciar**

1. **Abrir página:**
   ```
   mapa-teste.html
   ```

2. **Dependências carregadas:**
   - Bootstrap 5
   - MapLibre GL 3.6.2
   - Chart.js 4.4.0
   - jQuery 3.4.1
   - Bootstrap Icons

3. **Fluxo típico:**
   ```
   1. Selecionar Categoria
   2. Selecionar Indicador
   3. Explorar abas:
      - Mapa (padrão)
      - Ranking
      - Histórico
      - Filtros
      - Comparação
   ```

---

## 🛠️ **Personalização**

### Adicionar novo indicador:
1. Edit `dados-expandidos.js`
2. Adicione dados no objeto `MUNICIPIOS_EXPANDIDOS`
3. Atualize `CATEGORIAS_CONFIG`

### Adicionar novo município:
1. Edit `dados-expandidos.js`
2. Adicione entrada em `MUNICIPIOS_EXPANDIDOS`:
```javascript
"Nome da Cidade": {
    coords: [-latitude, -longitude],
    regiao: "Nome da Região",
    mesorregiao: "Nome da Mesorregião",
    data: {
        categoria: {
            indicador: [2024, 2023, 2022, 2021, 2020]
        }
    }
}
```

### Mudar cores:
1. Edit `mapa-features.js` → Array `cores` (usado em gráficos)
2. Edit `mapa-teste.html` → `:root` CSS vars para cores globais

---

## 📝 **Notas Técnicas**

- **Linguagem:** JavaScript ES6+
- **Classe principal:** `MapaFeaturesAdvanced`
- **Instância global:** `window.mapaFeatures`
- **Inicialização:** Automática ao carregar DOM
- **Gráficos:** Chart.js com tipos 'line' e 'bar'
- **Responsividade:** Bootstrap Grid + Media Queries

---

## ✅ **Features Completadas**

- ✅ Busca com autocomplete
- ✅ Tabela de ranking (20 top)
- ✅ Gráfico histórico (5 anos)
- ✅ Filtros por região
- ✅ Comparador de municípios (até 5)

---

## 🎯 **Próximos Passos (Opcionais)**

- [ ] Exportar ranking em CSV
- [ ] Screenshot do mapa
- [ ] Modo 3D com extrude
- [ ] Heatmap de clusters
- [ ] Análise de correlação
- [ ] Favoritos/Bookmarks
- [ ] Print-friendly PDF

---

**Data de criação:** 26 de fevereiro de 2026  
**Versão:** 1.0  
**Status:** ✅ Funcional
