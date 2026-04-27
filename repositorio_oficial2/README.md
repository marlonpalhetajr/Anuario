# 📊 Repositório Anuário Fapespa 2025

Um repositório interativo de dados com navegação por hierarquia, filtros avançados e exports em múltiplos formatos. Otimizado para carregar apenas os dados necessários.

## 🚀 Características

✅ **Navegação por Hierarquia**: Temáticas → Subtemas → Indicadores (carregamento progressivo)
✅ **Desempenho Otimizado**: Apenas dados da temática/subtema são carregados
✅ **Filtro Avançado**: Subtema → Indicador → Localidade → Ano
✅ **Tabela Interativa**: Visualize os dados com paginação automática (20 linhas por página)
✅ **Downloads em Múltiplos Formatos**: 
  - 📥 XLSX (Excel)
  - 📥 CSV
✅ **Estatísticas em Tempo Real**: Total de registros e dados após filtro
✅ **Responsive**: Funciona em desktop e mobile
✅ **Interface Intuitiva**: Navegação clara com ícones e descrições

## 📁 Arquivos e Estrutura

### Páginas HTML
- **index.html** - Página inicial com 5 temáticas principais
- **demografia.html** - Temática Demografia (sem subtemas)
- **economia.html** - Temática Economia com 7 subtemas
- **infraestrutura.html** - Temática Infraestrutura (sem subtemas)
- **meio-ambiente.html** - Temática Meio Ambiente (sem subtemas)
- **social.html** - Temática Social com 6 subtemas
- **dados.html** - Página de visualização de dados (template dinâmico)

### Arquivos de Suporte
- **functions.js** - Funções compartilhadas (carregamento, parsing, download)
- **server.py** - Servidor local Python
- **start_server.bat** - Iniciador para Windows
- **start_server.ps1** - Iniciador para PowerShell
- **GUIA_RÁPIDO.txt** - Guia de início rápido
- **README.md** - Este arquivo

### Dados
- **dados_repositorio/** - Base de dados em CSVs separados por temática/subtema
- **dados_repositorio/manifest.json** - Índice de arquivos usados no carregamento

## 🎯 Como Usar

### Opção 1: Abrir Diretamente no Navegador (Mais Simples)
1. Abra o arquivo **index.html** no seu navegador preferido
2. A página inicial mostrará as 5 temáticas disponíveis
3. Clique em uma temática para explorar:
   - **Demografia**, **Infraestrutura** ou **Meio Ambiente**: Levam direto aos dados
   - **Economia** ou **Social**: Mostram os subtemas disponíveis
4. Selecione os filtros desejados
5. Clique em **XLSX** ou **CSV** para fazer download

### Opção 2: Usar o Servidor Local (Recomendado)
1. Abra o terminal na pasta `repositorio_oficial2`
2. Execute:
   ```bash
   python server.py
   ```
3. Acesse em seu navegador: **http://localhost:8000**
4. Navegue e explore os dados normalmente

## 🗂️ Fluxo de Navegação

```
index.html (5 temáticas)
├── Demografia → dados.html?tematica=Demografia
├── Economia → economia.html
│   ├── PIB → dados.html?tematica=Economia&subtema=PIB
│   ├── Lavoura Permanente → dados.html?tematica=Economia&subtema=Lavoura%20Permanente
│   ├── Lavoura Temporária → (...)
│   ├── Extração Vegetal → (...)
│   ├── Pecuária → (...)
│   ├── Balança Comercial → (...)
│   └── Finanças Públicas → (...)
├── Infraestrutura → dados.html?tematica=Infraestrutura
├── Meio Ambiente → dados.html?tematica=Meio%20Ambiente
└── Social → social.html
    ├── Educação → dados.html?tematica=Social&subtema=Educação
    ├── Inclusão Social → (...)
    ├── Mercado de Trabalho → (...)
    ├── Previdência Social → (...)
    ├── Saúde → (...)
    └── Segurança → (...)
```

## 🎨 Interface

### Página Inicial (index.html)
- 5 cards com temáticas principais
- Ícones visuais para cada temática
- Links diretos para a navegação

### Páginas de Temáticas
- **Sem subtemas** (Demografia, Infraestrutura, Meio Ambiente): Um único botão que leva ao dados
- **Com subtemas** (Economia, Social): Mostra os subtemas disponíveis como cards

### Página de Dados (dados.html)
- **Painel Esquerdo**: Filtros avançados (apenas filtros disponíveis para essa temática/subtema)
- **Painel Principal**: Tabela com até 20 linhas por página
- **Estatísticas**: Total de registros e registros após filtro

### Filtros Disponíveis (variam por temática)
- 📊 **Subtema**: Apenas se a temática tiver subtemas
- 📈 **Indicador**: Tipo específico de indicador
- 🏘️ **Localidade**: Município ou região
- 📅 **Ano**: Período dos dados

### Botões de Ação
- 🔄 **Limpar**: Reseta todos os filtros
- 📥 **XLSX**: Download em formato Excel
- 📥 **CSV**: Download em formato CSV

## 📊 Estrutura dos Dados

Os dados contêm os seguintes campos:
- **tematica**: Temática principal
- **subtema**: Subtema específico
- **indicador**: Descrição do indicador
- **ri**: Região de interesse
- **localidade**: Localidade/município
- **categoria**: Categoria específica
- **ano**: Ano do dado
- **valor**: Valor numérico

Os dados são carregados a partir dos arquivos CSV em `dados_repositorio/`.
O arquivo `dados_repositorio/manifest.json` define quais arquivos são válidos para cada temática/subtema.

## ⚙️ Configurações

### Paginação
- 20 linhas por página (configurável no código em `rowsPerPage`)

### Formato de Números
- Números formatados com separador de milhar
- Até 2 casas decimais

## ⚡ Otimizações Implementadas

1. **Carregamento Progressivo**: Apenas a temática/subtema selecionada é carregada
2. **Parsing Eficiente**: Parser CSV otimizado sem dependências externas
3. **Filtros Dinâmicos**: Apenas filtros disponíveis são mostrados
4. **Paginação Inteligente**: Máximo 20 linhas por página
5. **Sem Delays**: Dados carregam em milissegundos

## 📈 Próximas Melhorias Sugeridas

- [ ] Gráficos de análise de tendências por temática
- [ ] Exportação em PDF
- [ ] Busca por texto livre
- [ ] Marcadores/favoritos
- [ ] Histórico de filtros
- [ ] Cache de dados para carregamento mais rápido
- [ ] Ordenação por coluna
- [ ] Filters salvos por sessão

## 🔄 Atualização de Dados

Se adicionar/remover CSVs em `dados_repositorio/`, atualize o manifesto:

```bash
python -c "import csv,glob,json,os; root='dados_repositorio'; req={'tematica','subtema','indicador','ri','localidade','categoria','ano','valor'}; out=os.path.join(root,'manifest.json'); entries=[];\
import pathlib; files=sorted(glob.glob(os.path.join(root,'**','*.csv'),recursive=True));\
for fp in files:\
 f=open(fp,'r',encoding='utf-8-sig',newline=''); first=f.readline().strip('\\n\\r'); f.seek(0); delim=';' if ';' in first else ','; r=csv.DictReader(f,delimiter=delim);\
 fields=[(h or '').strip().strip('\\"').strip('\\ufeff') for h in (r.fieldnames or [])]; valid=req.issubset(set(fields)); row=next(r,None) if valid else None;\
 norm={(k or '').strip().strip('\\"'):(v or '').strip() for k,v in (row or {}).items()}; entries.append({'path':fp.replace('\\\\','/'),'delimiter':delim,'valid':valid,'tematica':norm.get('tematica',''),'subtema':norm.get('subtema',''),'fields':fields}); f.close();\
json.dump(entries,open(out,'w',encoding='utf-8'),ensure_ascii=False,indent=2)"
```

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato com o desenvolvedor.

---

**Versão**: 1.0  
**Data**: Abril 2026  
**Desenvolvido com ❤️ para Fapespa**
