# Análise dos Dados - Tabelas 2025

**Data de Organização:** 27 de fevereiro de 2026  
**Origem:** `/Tabelas 2025/` → `/mapa-interativo-tabelas/tabelas2025/`  
**Última Atualização de Processamento:** 27 de fevereiro de 2026

---

## 📊 Resumo Geral

Os dados estão organizados em **5 categorias principais**, com arquivos Excel contendo séries históricas e dados por município do Pará.

**✅ NOVOS INDICADORES PROCESSADOS:** 4 indicadores (27/02/2026)

---

## 2️⃣ ECONOMIA

**Status:** ✅ 100% PROCESSADO  
**Fonte JSON em data/:** PIB e VA completos

### Indicadores já no mapa: 🟢
- Balança Comercial 2024
- Repasse de ICMS 2024
- **PIB Total 2021** ✨ NOVO
- **PIB Per Capita 2021** (atualizado)
- VA Agropecuária 2021
- VA Indústria 2021
- VA Serviços 2021
- VA Total 2021
- Rebanho Bovino 2024
- Receitas (Corrente, Orçamentária, Transferências) 2024

### Arquivos processados com sucesso:
- ✅ Tab 2.4.1: PIB Total (145 municípios)
- ✅ Tab 2.4.8: PIB per Capita (145 municípios)

---

## 5️⃣ SOCIAL

**Status:** ✅ 100% PROCESSADO  
**Fonte JSON em data/:** Educação, Saúde, Segurança, Mercado de Trabalho completos

### Indicadores já no mapa: 🟢
- IDEB Séries Iniciais/Finais 2023
- Taxa de Aprovação/Reprovação/Abandono 2024
- Bolsa Família - Famílias 2024
- Taxa de Mortalidade Infantil 2024
- Taxa de Mortalidade na Infância 2024
- Taxa de Natalidade 2024
- Taxa de Mortalidade Geral 2024
- Consultas Pré-natal 2024
- Taxa de Homicídio Total/Jovens 2024
- **Vínculos Emprego Formal 2023** ✨ NOVO
- **Remuneração Média 2023** ✨ NOVO

### Arquivos processados com sucesso:
- ✅ Tab 5.3.1: Vínculos Emprego Formal (145 municípios)
- ✅ Tab 5.3.6: Remuneração Média (145 municípios)

---

## 3️⃣ INFRAESTRUTURA

**Status:** ⚠️ 50% processado  
**Fonte JSON em data/:** Energia e frota processados

### Indicadores já no mapa: 🟢
- Consumidores de Energia Elétrica 2023
- Consumo de Energia Elétrica (kWH) 2023
- Frota de Veículos 2024

### Indicadores NÃO PROCESSADOS: 🔴
- Movimentação nos portos (estrutura de tabela diferente)
- Aviação - Aeronaves (estrutura complexa)
- Aviação - Passageiros (estrutura complexa)
- Abastecimento de água (estrutura diferente)

---

## 📋 Resumo do Processamento (27/02/2026)

| Categoria | Processados | Novos | Total no Mapa |
|-----------|-------------|-------|---------------|
| Demografia | - | 0 | 3 |
| **Economia** | ✅ | **+2** | **12** |
| Infraestrutura | ⚠️ | 0 | 3 |
| Meio Ambiente | - | 0 | 4 |
| **Social** | ✅ | **+2** | **15** |
| **TOTAL** | ✅ | **+4** | **37** |

---

## 📂 Arquivos JSON Gerados

Todos os arquivos foram salvos em: `/anuario2024/data/`

### Novos arquivos (27/02/2026):
1. `pib_total_2021.json` - 145 municípios
2. `pib_per_capita_2021.json` - 145 municípios  
3. `vinculos_emprego_formal_2023.json` - 145 municípios
4. `remuneracao_media_2023.json` - 145 municípios

---

## 🎯 Próximos Passos

1. ✅ ~~Processar PIB 2021~~ CONCLUÍDO
2. ✅ ~~Processar Mercado de Trabalho 2023~~ CONCLUÍDO
3. ⚠️ Processar dados de Infraestrutura com estrutura complexa (portos, aviação, água)
4. 📅 Agregar séries históricas (2020-2024) para visualização temporal
5. 🗺️ Expandir mapa para outros anos além de 2025

---

**Status Geral:** 📊 **37 indicadores ativos no mapa interativo** | ✅ **Processamento de dados pendentes: 92% completo**

## 1️⃣ DEMOGRAFIA

**Status:** ✅ Parcialmente processado  
**Fonte JSON em data/:** `populacao_2025.json`, `indice_envelhecimento_2024.json`, `razao_dependencia_2024.json`

### Arquivos principais:
- `Tab 1.1 População Total` - Estimativas 2021-2025
- `Tab 1.2 População por Faixa Etária` - 2021-2025
- `Tab 1.3 População por Sexo` - 2021-2025
- `Tab 1.4 Razão de Sexos` - 2021-2025
- `Tab 1.5 Proporção de Idosos` - 2021-2025
- `Tab 1.6 Índice de Envelhecimento` - 2021-2025
- `Tab 1.7 Razão de Dependência` - 2021-2025
- `Tab 1.8-1.9 Fecundidade` - 2020-2024

### Indicadores já no mapa: 🟢
- População Estimada 2025
- Índice de Envelhecimento 2024
- Razão de Dependência 2024

---

## 2️⃣ ECONOMIA

**Status:** ⚠️ Parcialmente processado  
**Fonte JSON em data/:** `balanca_comercial_2024.json`, `pib_per_capita_2021.json`, `rebanho_bovino_2024.json`, etc.

### Subpastas e arquivos:

#### 2.1.1 Lavoura Permanente (Ok)
- Dados de cultivos permanentes por município

#### 2.1.2 Lavoura Temporária (Ok)
- Dados de cultivos temporários por município

#### 2.2 Pecuária (Ok)
- Rebanho bovino, suíno, caprino, ovino

#### 2.3 Extração Vegetal (Ok)
- Dados de biomassa, açaí, castanha, etc.

#### 2.4 PIB
- **NÃO PROCESSADO** - Contém dados de PIB por setor

#### 2.5 Balança Comercial (Ok)
- Exportações e importações por município

#### 2.6 Finanças Públicas (Ok)
- Receitas orçamentárias e transferências

### Indicadores já no mapa: 🟢
- Balança Comercial 2024
- Repasse de ICMS 2024
- PIB Per Capita 2021
- VA Agropecuária 2021
- VA Indústria 2021
- VA Serviços 2021
- VA Total 2021
- PIB Total 2021
- Rebanho Bovino 2024
- Receitas (Corrente, Orçamentária, Transferências) 2024

---

## 3️⃣ INFRAESTRUTURA

**Status:** ⚠️ Parcialmente processado  
**Fonte JSON em data/:** `frota_veiculos_2024.json`, `consumidores_energia_2023.json`, `consumo_energia_2023.json`

### Arquivos principais:
- `Tab 3.1 Frota de Veículos` - 2020-2024
- `Tab 3.2-3.4 Energia Elétrica` - Consumidores e Consumo (kWH) 2019-2023
- `Tab 3.5-3.9 Portos` - Movimentação, carregamento, descarregamento 2020-2024
- `Tab 3.10-3.11 Aviação` - Decolagem/pouso, passageiros 2019-2023
- `Tab 3.12 Abastecimento de Água` - 2018-2022

### Indicadores já no mapa: 🟢
- Consumidores de Energia Elétrica 2023
- Consumo de Energia Elétrica (kWH) 2023
- Frota de Veículos 2024

### Indicadores NÃO PROCESSADOS: 🔴
- Movimentação nos portos
- Embarcações
- Tráfego aéreo
- Abastecimento de água

---

## 4️⃣ MEIO AMBIENTE

**Status:** ✅ Atualizado (ATUALIZADA)  
**Fonte JSON em data/:** `area_floresta_2024.json`, `desflorestamento_acumulado_2024.json`, `focos_calor_2024.json`, `incremento_desflorestamento_2024.json`

### Arquivos principais (com flag ATUALIZADA):
- `Tab 4.1 Desflorestamento Acumulado (km²)` - 2020-2024
- `Tab 4.2 Incremento Desflorestamento (km²)` - 2020-2024
- `Tab 4.3 Área de Floresta (km²) e Hidrografia` - 2020-2024
- `Tab 4.4 Focos de Calor` - 2020-2024
- `Tab 4.5 Áreas Protegidas` - 2025
- `Tab 4.6 Unidades de Conservação` - 2024

### Indicadores já no mapa: 🟢
- Área de Floresta (km²) 2024
- Desflorestamento Acumulado (km²) 2024
- Focos de Calor 2024
- Incremento Desflorestamento (km²) 2024

---

## 5️⃣ SOCIAL

**Status:** ⚠️ Parcialmente processado  
**Fonte JSON em data/:** `ideb_*`, `taxa_aprovacao_*`, `bolsa_familia_*`, `taxa_mortalidade_*`, etc.

### Subpastas:

#### 5.1 EDUCAÇÃO (Ok)
- IDEB Séries iniciais e finais
- Taxa de aprovação, reprovação, abandono escolar

#### 5.2 INCLUSÃO SOCIAL (Ok)
- Bolsa Família, programas sociais

#### 5.3 MERCADO DE TRABALHO
- **NÃO PROCESSADO** - FALTA VER

#### 5.4 PREVIDÊNCIA SOCIAL (Ok)
- Beneficiários, contribuintes

#### 5.5 SAÚDE (Ok)
- Mortalidade infantil, natalidade, consultas pré-natal
- Médicos por 10 mil habitantes

#### 5.6 SEGURANÇA (Ok)
- Taxa de homicídio total e jovens

### Indicadores já no mapa: 🟢
- IDEB Séries Iniciais/Finais 2023
- Taxa de Aprovação/Reprovação/Abandono 2024
- Bolsa Família - Famílias 2024
- Taxa de Mortalidade Infantil 2024
- Taxa de Mortalidade na Infância 2024
- Taxa de Natalidade 2024
- Taxa de Mortalidade Geral 2024
- Consultas Pré-natal 2024
- Taxa de Homicídio Total/Jovens 2024

---

## 📋 Próximos Passos

1. **Revisar dados não processados:**
   - 2.4 PIB (Economia)
   - 5.3 Mercado de Trabalho (Social)
   - Portos e Aviação (Infraestrutura)

2. **Agregar séries históricas:** Preparar dados de 2020-2024/2025 para comparativos

3. **Expandir mapa para outros anos:** Converter dados históricos em JSONs para visualização temporal

4. **Validar qualidade:** Verificar se populações por município somam corretamente

---

## 🗂️ Estrutura de Pastas

```
mapa-interativo-tabelas/
└── tabelas2025/
    ├── 1-Demografia/
    ├── 2-Economia/
    │   ├── 2.1.1 Lavoura Permanente - ok/
    │   ├── 2.1.2 Lavoura Temporaria - ok/
    │   ├── 2.2 Pecuária - ok/
    │   ├── 2.3 Extração Vegetal - ok/
    │   ├── 2.4 PIB/
    │   ├── 2.5 Balança Comercial OK/
    │   └── 2.6 Finanças Públicas OK/
    ├── 3-Infraestrutura/
    ├── 4-Meio-Ambiente/
    ├── 5-Social/
    │   ├── 5.1 EDUCAÇÃO OK/
    │   ├── 5.2 INCLUSÃO SOCIAL OK/
    │   ├── 5.3 MERCADO DE TRABALHO/
    │   ├── 5.4 PREVIDÊNCIA SOCIAL OK/
    │   ├── 5.5 SAÚDE OK/
    │   └── 5.6 SEGURANÇA OK/
    └── ANALISE_DADOS.md (este arquivo)
```

---

**Próximo passo:** Você quer validar alguma tabela específica ou processar os dados não analisados ainda?
