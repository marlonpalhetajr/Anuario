# 🔧 Solução para "Erro ao Carregar Dados" - Mapa Interativo

## ❌ Problema Identificado

Quando você abre o arquivo HTML diretamente do explorador de arquivos (`file://`), o navegador bloqueia requisições fetch() por questões de segurança (política CORS). Por isso você vê o erro "Erro ao carregar dados".

## ✅ Soluções

### **Solução 1: Usar Servidor HTTP Local (RECOMENDADO)**

Criei um servidor HTTP simples para você. Para usar:

#### **Opção A: Arquivo .bat (Mais Simples)**
1. Navegue até: `tools/`
2. Duplo clique em: **`iniciar-servidor.bat`**
3. O servidor iniciará e abrirá o navegador automaticamente
4. Acesse: `http://localhost:8080/mapa-interativo/mapa-interativo.html`

#### **Opção B: Linha de Comando**
```bash
cd "c:\Users\marlon.junior\OneDrive - Fapespa\anuario2024\tools"
.\iniciar-servidor.bat
```

#### **Para Parar o Servidor:**
Pressione `Ctrl+C` no terminal

---

### **Solução 2: Extensão do VS Code (Live Server)**

Se você usa VS Code:

1. Instale a extensão **"Live Server"** (Ritwick Dey)
2. Abra `mapa-interativo.html` no VS Code
3. Clique direito → **"Open with Live Server"**
4. Pronto! Abrirá em `http://127.0.0.1:5500`

---

### **Solução 3: Python (Se instalado)**

```bash
cd "c:\Users\marlon.junior\OneDrive - Fapespa\anuario2024"
python -m http.server 8080
```

Depois acesse: `http://localhost:8080/mapa-interativo/mapa-interativo.html`

---

## 📊 Indicadores Disponíveis para Teste

Criei 2 indicadores de EXEMPLO com dados reais para você testar:

### ✅ **Demografia**
1. **População Total 2025** - Todos os 144 municípios
2. **Densidade Demográfica** - Hab/km² calculados

### Como testar:
1. Inicie o servidor (solução acima)
2. Acesse o mapa interativo
3. Selecione **"Demografia"**
4. Escolha **"População Total 2025 (Exemplo)"**
5. Veja os 144 municípios aparecerem! 🗺️

---

## 🔍 Verificações no Console

Agora o sistema mostra logs detalhados. Para ver:

1. Abra o Console do Navegador: **F12** ou **Ctrl+Shift+I**
2. Vá na aba **"Console"**
3. Você verá:
   ```
   🚀 Inicializando Mapa Interativo do Pará...
   📍 Inicializando mapa Leaflet...
   📦 Carregando dados...
   Carregando catálogo de: ../data/catalogo_2025.json
   Catálogo carregado com sucesso: ...
   Carregando coordenadas de: ../data/coordenadas_municipios_pa.json
   Coordenadas carregadas: 144 municípios
   ✅ Inicialização concluída com sucesso!
   ```

Se houver erro, você verá:
```
❌ Erro ao carregar catálogo: ...
```

---

## 📁 Arquivos Criados

### **Servidor:**
- `tools/iniciar-servidor.bat` ← **Use este!**
- `tools/iniciar-servidor.ps1` (PowerShell)
- `tools/servidor-local.js` (Node.js)

### **Dados de Exemplo:**
- `data/indicadores/2025/demo-exemplo-populacao.json` (144 municípios)
- `data/indicadores/2025/demo-exemplo-densidade.json` (144 municípios)

### **Arquivos Essenciais:**
- `data/catalogo_2025.json` ✅ (Atualizado com exemplos)
- `data/coordenadas_municipios_pa.json` ✅ (144 municípios completos)
- `mapa-interativo/mapa-interativo.html` ✅ (Com logs melhorados)

---

## 🚀 Próximos Passos

### **Para ter TODOS os dados reais:**

Execute os scripts de conversão que criei:

#### **Opção Python:**
```bash
cd tools
pip install pandas openpyxl
python excel_to_json_map.py
```

#### **Opção Node.js:**
```bash
cd tools
npm install xlsx
node excel_to_json_map.js
```

Isso vai:
- ✅ Processar todas as planilhas Excel de `Tabelas 2025/`
- ✅ Gerar JSONs para TODOS os indicadores
- ✅ Atualizar o catálogo automaticamente

---

## 📞 Status Atual

### ✅ **Funcionando:**
- Arquitetura completa implementada
- 144 municípios com coordenadas
- 2 indicadores de exemplo com dados reais
- Sistema de filtros (categoria, indicador, região)
- Estatísticas (min, max, média)
- Legenda dinâmica
- Popups e hover interativos

### ⏳ **Pendente:**
- Executar scripts para converter Excel → JSON (30+ indicadores)
- Adicionar mais indicadores de teste

---

## 💡 Dica Final

**SEMPRE use um servidor HTTP para acessar o mapa interativo!**

Nunca abra `file:///c:/Users/.../mapa-interativo.html` diretamente.

Use: `http://localhost:8080/mapa-interativo/mapa-interativo.html`

---

**Última atualização:** 12 de Janeiro de 2026
