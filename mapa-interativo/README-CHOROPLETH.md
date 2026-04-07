# Mapa Interativo - Visualização Coroplética

## ✅ Implementado

### Dados Processados
- **População 2025**: Extraída de `Tabelas 2025/1. Demografia/Tab 1.1 População Total`
- **145 municípios** do Pará com dados populacionais
- **GeoJSON**: 143 polígonos municipais baixados do IBGE/geodata-br

### Visualização
- **Mapa Coroplético**: Municípios coloridos por faixa populacional
- **5 Classes de Cores** (tons de azul):
  - Azul muito claro: 4.280 - 40.473 hab
  - Azul claro: 40.474 - 96.119 hab  
  - Azul médio: 96.120 - 209.126 hab
  - Azul escuro: 209.127 - 360.871 hab
  - Azul muito escuro: 360.872 - 1.397.315 hab

### Funcionalidades
✅ Polígonos com preenchimento por cor
✅ Hover destaca município
✅ Click mostra popup com informações
✅ Click duplo faz zoom no município
✅ Legenda com faixas populacionais
✅ Painel de estatísticas (Total, Min, Max, Média)
✅ Painel lateral com informações ao passar mouse

## Arquivos Gerados

```
data/
  ├── populacao_2025.json          # Dados extraídos do Excel
  └── para_municipios.geojson      # Polígonos dos municípios
```

## Como Usar

1. Abra o arquivo através do Live Server
2. O mapa coroplético carrega automaticamente
3. Passe o mouse sobre municípios para ver dados
4. Clique para popup detalhado
5. Clique duplo para zoom

## Próximos Passos

- [ ] Adicionar mais indicadores (PIB, IDH, etc)
- [ ] Filtros por região de integração
- [ ] Comparação entre anos
- [ ] Exportar imagens do mapa
- [ ] Gráficos complementares

---

Desenvolvido para FAPESPA - Anuário Estatístico 2025
