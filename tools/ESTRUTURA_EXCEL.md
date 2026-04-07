# 📋 Guia de Estrutura de Dados para o Conversor

## ✅ Formato Correto do Excel

Seus arquivos Excel devem ter **EXATAMENTE** esta estrutura:

### Colunas Obrigatórias

| municipio | valor |
|-----------|-------|
| Belém | 1465575 |
| Ananindeua | 509227 |
| Marabá | 281756 |

### Colunas Opcionais (ignoradas)

Pode incluir outras colunas, que serão ignoradas:

| municipio | valor | regiao | ano | fonte |
|-----------|-------|--------|-----|-------|
| Belém | 1465575 | Metropolitana | 2025 | IBGE |
| Ananindeua | 509227 | Metropolitana | 2025 | IBGE |

---

## 🎨 Exemplos de Estruturação

### Exemplo 1: Dados Simples
**Arquivo:** `tabelas-excel/populacao_2025.xlsx`

```
Município        Valor
Belém            1465575
Ananindeua       509227
Marabá           281756
Parauapebas      228621
Altamira         138749
Barcarena        139076
```

**Resultado JSON:**
```json
{
  "Belém": 1465575,
  "Ananindeua": 509227,
  "Marabá": 281756,
  "Parauapebas": 228621,
  "Altamira": 138749,
  "Barcarena": 139076
}
```

---

### Exemplo 2: Dados com Decimais
**Arquivo:** `tabelas-excel/densidade_demografica_2024.xlsx`

```
Município        Densidade (hab/km²)
Belém            9543.26
Ananindeua       2356.44
Marabá           15.87
Parauapebas      11.23
```

**Resultado JSON:**
```json
{
  "Belém": 9543.26,
  "Ananindeua": 2356.44,
  "Marabá": 15.87,
  "Parauapebas": 11.23
}
```

---

### Exemplo 3: Dados com Percentuais
**Arquivo:** `tabelas-excel/taxa_urbanizacao_2023.xlsx`

```
Município        Taxa (%)
Belém            98.5
Ananindeua       97.2
Marabá           89.1
Itaituba         76.4
Oeiras           45.6
```

**Resultado JSON:**
```json
{
  "Belém": 98.5,
  "Ananindeua": 97.2,
  "Marabá": 89.1,
  "Itaituba": 76.4,
  "Oeiras": 45.6
}
```

---

## ❌ O QUE NÃO FAZER

### ❌ Falta coluna "municipio"
```
❌ ERRADO:
| Cidade | Habitantes |
| Belém  | 1465575   |

✅ CORRETO:
| municipio | valor  |
| Belém     | 1465575 |
```

### ❌ Falta coluna "valor"
```
❌ ERRADO:
| municipio | população | população_2024 |
| Belém     | 1465575   | 1470000       |

✅ CORRETO:
| municipio | valor   |
| Belém     | 1465575 |
```

### ❌ Pode ter valores vazios
```
❌ ERRADO:
| municipio | valor |
| Belém     | 1465575 |
| Igarapé   |       |
| Marabá    | 281756 |

✅ CORRETO:
| municipio | valor |
| Belém     | 1465575 |
| Marabá    | 281756 |
```

### ❌ Valores não-numéricos
```
❌ ERRADO:
| municipio | valor |
| Belém     | 1.4 milhões |
| Marabá    | aprox. 281 mil |

✅ CORRETO:
| municipio | valor   |
| Belém     | 1400000 |
| Marabá    | 281000  |
```

### ❌ Espaços extras nos nomes
```
❌ ERRADO:
| municipio  | valor |
|  Belém  | 1465575 |
|  Marabá  | 281756 |

✅ CORRETO:
| municipio | valor   |
| Belém     | 1465575 |
| Marabá    | 281756  |
```

---

## 📊 Monitoramento de Conversão

Quando o Watch está ativo, você verá logs assim:

```
[2026-02-26 14:30:45] 📖 Processando: populacao_2025.xlsx
✅ Convertido: populacao_2025.json (144 municípios)

[2026-02-26 14:35:20] 📖 Processando: densidade_2024.xlsx
✅ Convertido: densidade_2024.json (144 municípios)
```

---

## 🔍 Checklist Antes de Salvar Excel

Antes de salvar seu Excel, verifique:

- [ ] **Coluna "municipio"** existe com nomes corretos dos 144 municípios
- [ ] **Coluna "valor"** existe com números válidos
- [ ] **Nenhuma célula vazia** nas colunas municipio e valor
- [ ] **Sem espaços extras** nos nomes dos municípios
- [ ] **Números sem formatação especial** (sem R$, %, etc)
- [ ] **Arquivo salvo em** `tabelas-excel/` com nome descritivo
- [ ] **Nome do arquivo** tem o ano/período (ex: `populacao_2025.xlsx`)

---

## 💡 Exemplo Pronto para Usar

Estrutura de Excel que funciona **100% certo**:

```
LINHA 1 (cabeçalho):
A1: "municipio"    B1: "valor"

LINHAS 2-145 (dados):
A2: Belém          B2: 1465575
A3: Ananindeua     B3: 509227
...
A145: Ulianópolis  B145: 7812
```

Salve como: **`tabelas-excel/dados_exemplo_2025.xlsx`**

Watch detectará automaticamente e gerará:
**`data/dados_exemplo_2025.json`**

---

Qualquer dúvida? Verifique os logs em `tools/conversao.log` 📋
