import json

# Carregar o arquivo JSON
with open('config-mapas.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

# Contador de correções
icons_corrigidos = 0

# Verificar todas as categorias
for categoria, anos_data in config.items():
    if categoria == 'anos':
        continue
    
    # Processar apenas Meio Ambiente
    if categoria == 'Meio Ambiente':
        for ano in ['2017', '2018']:
            if ano in anos_data:
                for entry in anos_data[ano]:
                    # Corrigir caminho do ícone
                    if 'icon' in entry and '/meioambiente/' in entry['icon']:
                        entry['icon'] = entry['icon'].replace('/meioambiente/', '/meio_ambiente/')
                        icons_corrigidos += 1

# Salvar o arquivo atualizado
with open('config-mapas.json', 'w', encoding='utf-8') as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

print(f"Total de ícones corrigidos: {icons_corrigidos}")
print("Correção concluída!")
