#!/usr/bin/env python3
import json
from pathlib import Path

# Carregar o config-mapas.json
with open('config-mapas.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

base = Path('c:\\Users\\marlon.junior\\OneDrive - Fapespa\\anuario2024')

# Verificar e corrigir caminhos dos ícones para 2021, 2020, 2019, 2018
anos_problema = ['2021', '2020', '2019', '2018']

for ano in anos_problema:
    if ano in config['mapas']['Território']:
        icon_folder = base / 'icons-mapa-interativo' / f'icons_{ano}' / 'territorio'
        
        print(f'\n📝 Corrigindo {ano}...')
        print(f'   Pasta de ícones: {icon_folder}')
        
        if not icon_folder.exists():
            print(f'   ⚠️  Pasta não existe!')
            continue
        
        # Listar ícones disponíveis
        icon_files = {f.name: f for f in icon_folder.glob('*.png')}
        print(f'   Ícones disponíveis: {len(icon_files)}')
        
        for mapa in config['mapas']['Território'][ano]:
            arquivo = mapa['arquivo']
            
            # Procurar o ícone com match case-insensitive
            icon_found = None
            for icon_name in icon_files.keys():
                if icon_name.lower() == arquivo.lower():
                    icon_found = icon_name
                    break
            
            if icon_found:
                mapa['icon'] = f'../icons-mapa-interativo/icons_{ano}/territorio/{icon_found}'
                mapa['caminho'] = f'../mapas-modo-interativo/mapas{ano}/territorio/{arquivo}'
                print(f"  ✓ {mapa['titulo']}: {icon_found}")
            else:
                # Se não encontrar o ícone exato, usar o primeiro disponível ou fallback
                print(f"  ⚠️  {mapa['titulo']}: ícone '{arquivo}' não encontrado!")
                # Mostrar ícones disponíveis
                print(f"      Ícones disponíveis: {list(icon_files.keys())[:3]}...")

# Salvar o arquivo atualizado
with open('config-mapas.json', 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print('\n✅ config-mapas.json salvo!')
