# Mapa Interativo - Integração de Mapas Históricos (2017-2024)

## 📋 Resumo das Alterações

Este documento descreve as alterações realizadas para integrar todos os mapas históricos de 2017 a 2024 no sistema de Mapa Interativo do Pará.

## 🗂️ Arquivos Criados

### 1. `gerar-config-mapas.py`
Script Python que escaneia a pasta `mapas-modo-interativo` e gera um arquivo JSON com todos os mapas organizados por categoria e ano.

**Funcionalidades:**
- Escaneia pastas de mapas de 2017 a 2024
- Organiza mapas por categoria (Demografia, Economia, Infraestrutura, Meio Ambiente, Social, Território)
- Gera arquivo `config-mapas.json` com metadados de todos os mapas
- Normaliza nomes de arquivos e corrige encodings

**Uso:**
```bash
cd mapa-interativo
python gerar-config-mapas.py
```

### 2. `config-mapas.json`
Arquivo JSON gerado automaticamente contendo:
- Lista de anos disponíveis (2017-2024)
- Lista de categorias
- Mapas organizados por categoria e ano
- Caminhos relativos para cada mapa
- Total de 470 mapas catalogados

**Estrutura:**
```json
{
  "anos": ["2017", "2018", ...],
  "categorias": ["Demografia", "Economia", ...],
  "mapas": {
    "Demografia": {
      "2017": [
        {
          "titulo": "População Total 2016",
          "arquivo": "dem1_populacao_total_2016.png",
          "caminho": "../mapas-modo-interativo/mapas2017/demografia/dem1_populacao_total_2016.png"
        }
      ]
    }
  },
  "total": 470
}
```

### 3. `config-loader.js`
Módulo JavaScript que carrega e gerencia a configuração de mapas.

**Principais Funções:**
- `loadMapasConfig()`: Carrega arquivo config-mapas.json
- `populateYearsFromConfig()`: Popula filtro de anos (2017-2024)
- `getMapasByCategoria(categoria, ano)`: Obtém mapas filtrados
- `renderTerritoryGalleryFromConfig()`: Renderiza galeria com mapas históricos
- `renderCategoryGallery(categoria)`: Renderiza galeria para qualquer categoria

## 📝 Arquivos Modificados

### 1. `mapa-interativo.html`
**Alteração:** Adicionado script config-loader.js

```html
<!-- Loader de Configuração de Mapas -->
<script src="config-loader.js"></script>
```

### 2. `mapa-app.js`
**Alterações principais:**

#### a) Função `init()`
- Adicionado carregamento da configuração de mapas
```javascript
// Carrega configuração de mapas (2017-2024)
await loadMapasConfig();
```

#### b) Função `populateYearFilter()`
- Agora usa anos da configuração quando disponível
- Fallback para anos padrão caso configuração não carregue

#### c) Função `renderTerritoryGallery()`
- Verifica se configuração está carregada
- Usa `renderTerritoryGalleryFromConfig()` quando disponível
- Mantém fallback para galeria padrão

#### d) Função `setupEventListeners()`
- Atualizado para re-renderizar galeria quando ano mudar
- Seleciona ano apropriado por categoria (2024 para Território, 2025 para outras)

## 📊 Estatísticas dos Mapas

### Total de Mapas: 470

**Por Categoria:**
- Demografia: 24 mapas (3 por ano)
- Economia: 94 mapas (7-15 por ano)
- Infraestrutura: 24 mapas (3 por ano)
- Meio Ambiente: 27 mapas (3-4 por ano)
- Social: 197 mapas (20-27 por ano)
- Território: 104 mapas (12-14 por ano)

**Por Ano:**
- 2017: 50 mapas
- 2018: 64 mapas
- 2019: 60 mapas
- 2020: 60 mapas
- 2021: 60 mapas
- 2022: 63 mapas
- 2023: 63 mapas
- 2024: 50 mapas

## 🎯 Funcionalidades Implementadas

### 1. Filtro de Ano Dinâmico
- Usuário pode selecionar anos de 2017 a 2024
- Galeria atualiza automaticamente baseado no ano selecionado
- Opção "Todos os anos" disponível

### 2. Galeria de Mapas por Categoria
- Categoria Território: Exibe mapas estáticos em galeria
- Outras categorias: Mantém funcionalidade de mapa coroplético interativo
- Cada mapa tem botão para visualização em modal (tela cheia)

### 3. Visualização em Modal
- Mapas abrem em modal com Leaflet
- Zoom e pan habilitados
- Título do mapa exibido

### 4. Organização Inteligente
- Mapas ordenados por título
- Ano exibido junto ao título
- Tratamento de imagens ausentes (fallback)

## 🔧 Como Usar

### Para Usuário Final:

1. **Selecionar Categoria:** Escolha uma das 6 categorias
2. **Selecionar Ano:** Escolha um ano de 2017 a 2024 (ou "Todos os anos")
3. **Visualizar Mapas:**
   - **Território:** Galeria de mapas estáticos aparece automaticamente
   - **Outras categorias:** Mapas aparecem na galeria se disponíveis
4. **Abrir Mapa:** Clique no ícone de olho para visualizar em tela cheia

### Para Desenvolvedor:

#### Adicionar Novos Mapas:
1. Coloque os arquivos PNG na estrutura correta:
   ```
   mapas-modo-interativo/
     mapasXXXX/
       categoria/
         arquivo.png
   ```
2. Execute o script para atualizar configuração:
   ```bash
   python gerar-config-mapas.py
   ```
3. Recarregue a página

#### Personalizar Visualização:
- Edite `config-loader.js` para modificar layout da galeria
- Edite CSS em `mapa-interativo.html` para estilização
- Modifique `TERRITORY_ICONS` em `mapa-app.js` para ícones customizados

## 🎨 Estrutura de Pastas

```
anuario2024/
├── mapas-modo-interativo/
│   ├── mapas2017/
│   │   ├── demografia/
│   │   ├── economia/
│   │   ├── infraestrutura/
│   │   ├── meioambiente/
│   │   ├── social/
│   │   └── territorio/
│   ├── mapas2018/
│   │   └── ... (mesma estrutura)
│   └── ... (até mapas2024)
│
└── mapa-interativo/
    ├── mapa-interativo.html
    ├── mapa-app.js
    ├── paletas-cores.js
    ├── config-loader.js ⬅️ NOVO
    ├── config-mapas.json ⬅️ NOVO
    └── gerar-config-mapas.py ⬅️ NOVO
```

## ⚠️ Notas Importantes

1. **Servidor Web Necessário:** O sistema requer um servidor web local (não funciona abrindo HTML diretamente)
2. **Caminhos Relativos:** Todos os caminhos são relativos à pasta mapa-interativo
3. **Cache:** Use Ctrl+F5 para forçar reload após atualizações
4. **Encoding:** Alguns nomes de arquivo têm caracteres especiais (ç, á, etc.) - o script trata automaticamente

## 🐛 Solução de Problemas

### Mapas não aparecem:
- Verifique se o arquivo `config-mapas.json` existe
- Abra o console (F12) e verifique erros
- Confirme que está usando servidor web

### Imagens quebradas:
- Verifique caminhos no config-mapas.json
- Confirme que arquivos PNG existem nas pastas
- Verifique console para erros 404

### Filtro de ano não funciona:
- Confirme que config-loader.js está carregado
- Verifique se `MAPAS_CONFIG.loaded` é true no console

## 📈 Melhorias Futuras Possíveis

1. **Pesquisa de Mapas:** Campo de busca para filtrar por palavras-chave
2. **Download:** Botão para baixar mapas em alta resolução
3. **Comparação:** Visualizar dois mapas lado a lado
4. **Timeline:** Slider para navegar pelos anos
5. **Estatísticas:** Dashboard com estatísticas dos mapas
6. **Exportação:** Gerar relatório PDF com mapas selecionados

## ✅ Status

- ✅ Script de geração de configuração implementado
- ✅ Loader de configuração implementado
- ✅ Integração com HTML e JavaScript
- ✅ Filtro de ano funcional
- ✅ Galeria de mapas renderizando
- ✅ Modal de visualização funcionando
- ✅ Suporte a todas as 6 categorias
- ✅ 470 mapas catalogados

## 👤 Autor

Sistema desenvolvido para FAPESPA - Fundação Amazônia de Amparo a Estudos e Pesquisas
Anuário Estatístico do Pará 2025

---

**Última atualização:** 20/01/2026
