# Mapa Interativo do Pará - Arquitetura Completa

## 📋 Visão Geral

Sistema robusto de visualização interativa de dados estatísticos dos 144 municípios do Pará, desenvolvido para o Anuário Estatístico 2024 da FAPESPA.

## 🏗️ Arquitetura

### **Estrutura de Arquivos**

```
anuario2024/
├── mapa-interativo/
│   ├── mapa-interativo.html          # Interface principal do mapa
│   └── mapa-interativo.html.backup   # Backup da versão anterior
├── data/
│   ├── catalogo_2025.json            # Catálogo de todos os indicadores
│   ├── coordenadas_municipios_pa.json # Coordenadas dos 144 municípios
│   └── indicadores/
│       └── 2025/                     # Dados por indicador (JSON)
├── tools/
│   ├── excel_to_json_map.py          # Script Python para conversão
│   └── excel_to_json_map.js          # Script Node.js para conversão
└── Tabelas 2025/                     # Planilhas Excel originais
    ├── 1. Demografia/
    ├── 2. Economia/
    ├── 3. Infraestrutura/
    ├── 4. Meio Ambiente/
    └── 5. Social/
```

## 🎯 Funcionalidades Implementadas

### **1. Visualização Interativa**
- ✅ Mapa com 144 municípios paraenses
- ✅ 5 categorias de dados (Demografia, Economia, Infraestrutura, Meio Ambiente, Social)
- ✅ 30+ indicadores disponíveis
- ✅ Cores escala quantílica (5 classes)
- ✅ Marcadores proporcionais aos valores

### **2. Controles e Filtros**
- ✅ Seleção de categoria
- ✅ Seleção de indicador
- ✅ Filtro por Região de Integração (8 regiões)
- ✅ Responsivo para dispositivos móveis

### **3. Painel de Informações**
- ✅ Hover interativo sobre municípios
- ✅ Popups com dados detalhados
- ✅ Estatísticas rápidas (min, max, média)
- ✅ Legenda dinâmica com intervalos

### **4. Design e UX**
- ✅ Interface Bootstrap 5
- ✅ Ícones Bootstrap Icons
- ✅ Gradiente verde FAPESPA (#28a745 → #20c997)
- ✅ Loading screen
- ✅ Animações suaves

## 📊 Catálogo de Indicadores

### **Demografia (9 indicadores)**
- População Total (2021-2025)
- População por Faixa Etária
- População por Sexo
- Razão de Sexos
- Proporção de Idosos
- Índice de Envelhecimento
- Razão de Dependência
- Taxa de Fecundidade Total
- Taxa Específica de Fecundidade

### **Economia (7 indicadores)**
- PIB Municipal
- Balança Comercial
- Finanças Públicas
- Lavoura Permanente
- Lavoura Temporária
- Pecuária
- Extração Vegetal

### **Infraestrutura (7 indicadores)**
- Frota de Veículos
- Consumidores de Energia Elétrica
- Consumo de Energia (kWh)
- Movimentação nos Portos
- Operações Aeroportuárias
- Passageiros Aéreos
- Abastecimento de Água

### **Meio Ambiente (5 indicadores)**
- Desflorestamento Acumulado
- Incremento de Desflorestamento
- Área de Floresta e Hidrografia
- Focos de Calor
- Áreas Protegidas

### **Social (6 indicadores)**
- Educação
- Inclusão Social
- Mercado de Trabalho
- Previdência Social
- Saúde
- Segurança Pública

## 🔧 Scripts de Conversão

### **Opção 1: Python (excel_to_json_map.py)**

**Pré-requisitos:**
```bash
pip install pandas openpyxl
```

**Execução:**
```bash
cd tools
python excel_to_json_map.py
```

**Funcionalidades:**
- Converte todas as planilhas Excel → JSON
- Detecta automaticamente colunas de municípios e valores
- Extrai ano mais recente dos dados
- Gera catálogo completo automaticamente
- Suporta múltiplas abas por planilha

---

### **Opção 2: Node.js (excel_to_json_map.js)**

**Pré-requisitos:**
```bash
npm install xlsx
```

**Execução:**
```bash
cd tools
node excel_to_json_map.js
```

**Vantagens:**
- Mesmas funcionalidades do script Python
- Melhor compatibilidade em ambientes Windows
- Mais rápido para grandes volumes de dados

---

## 📁 Formato de Dados

### **Estrutura do Catálogo (catalogo_2025.json)**

```json
{
  "categoria": [
    {
      "slug": "identificador-unico",
      "label": "Nome do Indicador",
      "unit": "unidade (hab, R$, km², etc)",
      "year": 2025,
      "path": "data/indicadores/2025/arquivo.json"
    }
  ]
}
```

### **Estrutura dos Indicadores (JSON individual)**

```json
{
  "metadata": {
    "source": "Tab 1.1 População Total.xlsx",
    "categoria": "demografia",
    "municipios": 144
  },
  "data": {
    "Belém": 1499641,
    "Ananindeua": 535547,
    "Santarém": 306480,
    ...
  }
}
```

### **Estrutura de Coordenadas (coordenadas_municipios_pa.json)**

```json
{
  "metadata": {
    "description": "Coordenadas geográficas dos 144 municípios do Pará",
    "fonte": "IBGE",
    "sistema_coordenadas": "WGS84 (lat, lon)",
    "total_municipios": 144
  },
  "municipios": {
    "Belém": {
      "lat": -1.4558,
      "lon": -48.4902,
      "regiao": "Metropolitana de Belém"
    },
    ...
  }
}
```

## 🚀 Uso do Mapa Interativo

### **1. Acesso**
Abra o arquivo: `mapa-interativo/mapa-interativo.html`

### **2. Fluxo de Uso**
1. Selecione uma **Categoria** (Demografia, Economia, etc)
2. Escolha um **Indicador** na lista
3. (Opcional) Filtre por **Região de Integração**
4. Explore o mapa:
   - Passe o mouse sobre municípios para ver dados
   - Clique para fixar popup
   - Use zoom/pan para navegar

### **3. Interpretação**
- **Cores**: Escala de verde (baixo → alto valor)
- **Tamanho**: Marcadores maiores = valores maiores
- **Estatísticas**: Painel superior mostra resumo

## 🔄 Atualização de Dados

### **Passo 1: Adicionar/Atualizar Planilhas**
Coloque novos arquivos Excel em: `Tabelas 2025/[Categoria]/`

### **Passo 2: Executar Conversão**
```bash
cd tools
python excel_to_json_map.py
# ou
node excel_to_json_map.js
```

### **Passo 3: Verificar**
- JSONs gerados em: `data/indicadores/2025/`
- Catálogo atualizado: `data/catalogo_2025.json`

### **Passo 4: Testar**
Abra `mapa-interativo.html` e verifique novos indicadores

## 🐛 Troubleshooting

### **Problema: "Nenhum dado disponível"**
- ✅ Verifique se o JSON do indicador existe
- ✅ Confirme que há dados para os municípios
- ✅ Veja console do navegador (F12) para erros

### **Problema: "Município não aparece no mapa"**
- ✅ Verifique grafia exata do nome no JSON
- ✅ Confirme se município está em `coordenadas_municipios_pa.json`
- ✅ Verifique se há coordenadas válidas

### **Problema: "Catálogo não carrega"**
- ✅ Caminho correto: `../data/catalogo_2025.json` (relativo ao HTML)
- ✅ JSON válido (use validador online)
- ✅ Encoding UTF-8

### **Problema: Scripts de conversão não funcionam**
- ✅ Python: Instale dependências (`pip install pandas openpyxl`)
- ✅ Node.js: Instale pacote (`npm install xlsx`)
- ✅ Verifique caminhos dos arquivos
- ✅ Certifique-se de que Excel não está aberto

## 📈 Melhorias Futuras

### **Curto Prazo**
- [ ] Adicionar download de dados em CSV
- [ ] Implementar comparação entre municípios
- [ ] Criar gráficos temporais (séries históricas)

### **Médio Prazo**
- [ ] Integrar GeoJSON com polígonos municipais
- [ ] Adicionar busca de município por nome
- [ ] Criar modo de comparação lado a lado

### **Longo Prazo**
- [ ] Dashboard com múltiplos indicadores simultâneos
- [ ] Relatórios automáticos PDF
- [ ] API REST para acesso programático aos dados

## 🔐 Licença e Créditos

**Desenvolvido para:**
Fundação Amazônia de Amparo a Estudos e Pesquisas (FAPESPA)

**Tecnologias:**
- Leaflet.js 1.9.4 (Mapa interativo)
- Bootstrap 5.3 (Interface)
- OpenStreetMap (Tiles do mapa)

**Dados:**
IBGE, IDESP-PA, DETRAN-PA, PRODEPA e outras fontes oficiais.

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este README primeiro
2. Consulte console do navegador (F12)
3. Revise logs dos scripts de conversão
4. Entre em contato com equipe técnica FAPESPA

---

**Última atualização:** Janeiro 2026
**Versão:** 2.0 (Arquitetura Robusta)
