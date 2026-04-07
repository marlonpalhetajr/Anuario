# Repositório 2025 - Guia de Uso

## 📋 O quefoi criado

Um novo repositório integrado com **152 tabelas** de todos os anos, eixos temáticos e regiões, com **filtros dinâmicos realmente funcionais**.

## 🚀 Acessar

**Versão com Regiões (RECOMENDADO):**
- Abra: `http://localhost:8080/index-v2.html`

**Ou acesse diretamente a página de Regiões de Integração:**
- `http://localhost:8080/regioes.html`
  - Clique em uma região para ver as tabelas daquela região
  - Cada região é um card clicável que filtra automaticamente

## 🔍 Filtros Funcionais

Os filtros são **dinâmicos e encadeados**:
- **Ano**: Filtra por ano de coleta/publicação
- **Eixo**: Social, Economia, Demografia, Infraestrutura, Meio Ambiente
- **Tema**: Automático conforme o eixo (ex: Educação, Saúde, PIB, etc)
- **Região**: Vazio por enquanto (estrutura pronta para dados municipais)
- **Município**: Filt municipal (estrutura pronta)
- **Busca livre**: Busca em título, indicador, código ou qualquer texto

**Comportamento:**
- Selecione um filtro e os outros se atualizam automaticamente mostrando apenas opções válidas
- Qualquer combinação de filtros funciona em tempo real
- Limpar filtros reseta tudo

## 📁 Estrutura de Arquivos Criados

```
repositorio_2025/
├── index.html                          # Versão original
├── index-v2.html                       # Versão com regiões (USAR ESTA)
├── regioes.html                        # Dashboard de regiões
├── assets/
│   ├── css/
│   │   ├── repository.css              # Estilos do repositório
│   │   └── regioes.css                 # Estilos da página de regiões
│   └── js/
│       ├── repository-engine.js        # Motor de filtros (versão original)
│       ├── repository-engine-v2.js     # Motor de filtros (USAR ESTA - com URL params)
│       └── regioes-dashboard.js        # Dashboard de regiões
├── data/
│   ├── tables-index.json               # 152 tabelas integradas
│   └── regioes-config.json             # Configuração das 13 regiões
└── build_index_from_files.py           # Gerador de índice (rodar se adicionar tabelas)
```

## 🔄 Se adicionar mais tabelas em `tabelas/`

```powershell
cd "c:\Users\marlon.junior\OneDrive - Fapespa\anuario2024"
python "repositorio_2025\build_index_from_files.py" --source "tabelas" --output "repositorio_2025\data\tables-index.json"
```

Depois recarregue a página no navegador (Ctrl+F5 para limpar cache).

## 🌐 Regiões de Integração Disponíveis

1. Pará (Estadual)
2. Araguaia
3. Baixo Amazonas
4. Carajás
5. Guajará
6. Guamá
7. Lago de Tucuruí
8. Marajó
9. Rio Caeté
10. Rio Capim
11. Tapajós
12. Tocantins
13. Xingu

## ✨ Features Implementados

✅ Filtros dinâmicos encadeados
✅ 152 tabelas integradas de todos os anos
✅ Busca livre por texto (título, código, indicador)
✅ Dashboard de regiões de integração
✅ Links diretos para abrir tabelas em nova aba
✅ Contador de resultados
✅ Responsivo (funciona em mobile)
✅ Suporte a parâmetros de URL (?regiao=Guamá)

## 🎯 Próximas Melhorias Possíveis

- [ ] Ordenação por clique nas colunas
- [ ] Paginação dos resultados
- [ ] Exportação CSV dos resultados filtrados
- [ ] Integração com dados de municípios por região
- [ ] Gráficos/visualizações dos dados
- [ ] Histórico de buscas salvas

---

**Servidor rodando em:** `http://localhost:8080`
**Versão:** 2025.1
