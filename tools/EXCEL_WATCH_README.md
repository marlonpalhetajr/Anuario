# 📊 Conversor Excel → JSON com Watch Automático

Converte automaticamente arquivos Excel para JSON em tempo real, monitora a pasta `tabelas-excel/` e sincroniza com `data/`.

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
pip install -r tools/requirements.txt
```

Ou no VS Code:
- Abra o Command Palette (`Ctrl+Shift+P`)
- Digite: `Tasks: Run Task`
- Selecione: `📦 Instalar Dependências (Excel→JSON)`

### 2. Iniciar Watch Automático

**Opção A: VS Code (Recomendado)**
- Command Palette (`Ctrl+Shift+P`)
- Digite: `Tasks: Run Task`
- Selecione: `👀 Iniciar Watch Excel→JSON`
- Watch iniciará e ficará monitorando

**Opção B: Terminal**
```bash
python tools/excel_to_json_watch.py --watch
```

**Opção C: Conversão Manual (uma única vez)**
```bash
python tools/excel_to_json_watch.py --once
```

---

## 📋 Como Funciona

### Estrutura de Dados Esperada

Coloque seus arquivos Excel em **`tabelas-excel/`** com este formato:

| municipio | valor | (opcional) ano |
|-----------|-------|---|
| Belém | 1465575 | 2025 |
| Ananindeua | 509227 | 2025 |
| Marabá | 281756 | 2025 |

**Importante:**
- ✅ Coluna **obrigatória**: `municipio`
- ✅ Coluna **obrigatória**: `valor` (números)
- ✅ Coluna **opcional**: `ano`, `regiao`, etc.
- ✅ Não deixe células vazias em municipio ou valor

### Exemplo de Arquivo

**Arquivo:** `tabelas-excel/populacao_2025.xlsx`

```
Município      Valor
Belém          1465575
Ananindeua     509227
Marabá         281756
```

### Resultado

Gera automaticamente em **`data/`**:

**Arquivo:** `data/populacao_2025.json`
```json
{
  "Belém": 1465575,
  "Ananindeua": 509227,
  "Marabá": 281756
}
```

---

## 🔄 Fluxo do Watch

```
1️⃣  Você salva arquivo Excel
        ↓
2️⃣  Watch detecta mudança
        ↓
3️⃣  Script processa arquivo
        ↓
4️⃣  Valida dados
        ↓
5️⃣  Gera JSON
        ↓
6️⃣  Log registra resultado
        ↓
7️⃣  Mapa carrega novo dados
```

---

## 📝 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `tools/excel_to_json_watch.py` | Script principal (watch + conversão) |
| `tools/requirements.txt` | Dependências Python |
| `tools/conversao.log` | Log de todas conversões |
| `.vscode/tasks.json` | Tasks do VS Code |

---

## 📊 Monitoramento no VS Code

Quando o watch estiver ativo, você verá:

```
👀 WATCH INICIADO
==============================================================
📁 Monitorando: C:\...\tabelas-excel/
💾 Salvando em: C:\...\data/
📋 Log: C:\...\tools\conversao.log

🟢 Aguardando mudanças... (Ctrl+C para parar)
==============================================================

[2026-02-26 14:30:45] 📖 Processando: populacao_2025.xlsx
[2026-02-26 14:30:46] ✅ Convertido: populacao_2025.json (144 municípios)
[2026-02-26 14:30:46] 📖 Processando: pib_per_capita_2021.xlsx
[2026-02-26 14:30:47] ✅ Convertido: pib_per_capita_2021.json (144 municípios)
```

---

## 🛠️ Troubleshooting

### ❌ "ModuleNotFoundError: No module named 'watchdog'"
```bash
pip install watchdog==3.0.0
```

### ❌ "ExcelFile.parse() got an unexpected keyword argument"
```bash
pip install --upgrade openpyxl
```

### ❌ "Nenhum arquivo .xlsx encontrado"
- Verifique se a pasta `tabelas-excel/` existe
- Coloque os arquivos Excel lá

### ❌ "Excel deve ter coluna 'municipio'"
- Renomeie a coluna para exatamente `municipio` (lowercase)
- Ou adicione coluna `municipio` ao Excel

### ⚠️ Watch não detecta mudança
- Salve o arquivo explicitamente (Ctrl+S)
- Espere 1 segundo após salvar
- Verifique o panel Terminal do VS Code

---

## 🎯 Integração com Mapa

Seu `mapa-app.js` carrega automaticamente os JSONs:

```javascript
// Em mapa-app.js (loadData function)
const populacaoData = await fetch('data/populacao_2025.json')
    .then(r => r.json());

STATE.populacao = populacaoData;
```

Quando um novo JSON for gerado, o mapa pode recarregar:

```javascript
// Adicionar ao seu mapa para reload automático
window.addEventListener('reload-dados', () => {
    location.reload(); // ou atualizar dados dinâmicamente
});
```

---

## 💡 Dicas

1. **Mantenha o Watch rodando** em uma aba do VS Code enquanto trabalha
2. **Log fica em** `tools/conversao.log` para debugging
3. **Múltiplos arquivos Excel** são processados em paralelo
4. **Nomes de arquivo** viram nomes de JSON automaticamente:
   - `populacao_2025.xlsx` → `populacao_2025.json`

---

## 🚫 Parar Watch

- Pressione `Ctrl+C` no terminal
- Ou clique no X do panel Terminal
- Log final é registrado automaticamente

---

Pronto! Agora você tem conversão automática Excel → JSON em tempo real! 🎉
