import json

# Carregar o arquivo JSON
with open('config-mapas.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

# Contador de correções
icons_corrigidos = 0

# Processar apenas Meio Ambiente
if 'mapas' in config and 'Meio Ambiente' in config['mapas']:
    print("Processando Meio Ambiente...")
    meio_ambiente = config['mapas']['Meio Ambiente']
    
    for ano in ['2017', '2018']:
        if ano in meio_ambiente:
            print(f"\nAno {ano} encontrado:")
            for i, entry in enumerate(meio_ambiente[ano]):
                if 'icon' in entry:
                    old_icon = entry['icon']
                    if '/meioambiente/' in old_icon:
                        entry['icon'] = old_icon.replace('/meioambiente/', '/meio_ambiente/')
                        print(f"  [{i}] Corrigido: {entry['titulo']}")
                        print(f"      De: {old_icon}")
                        print(f"      Para: {entry['icon']}")
                        icons_corrigidos += 1
                    else:
                        print(f"  [{i}] Já correto: {entry['titulo']}")
        else:
            print(f"Ano {ano} NÃO encontrado")

# Salvar o arquivo atualizado
if icons_corrigidos > 0:
    with open('config-mapas.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Total de ícones corrigidos: {icons_corrigidos}")
    print("Arquivo salvo!")
else:
    print("\nNenhuma correção necessária.")
