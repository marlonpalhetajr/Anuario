"""
Script para corrigir caminhos de 2018 removendo subpastas incorretas
"""

import json

def corrigir_caminhos_2018():
    with open('config-mapas.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    print('🔧 Corrigindo caminhos do ano 2018...\n')
    
    total_corrigido = 0
    
    # Para cada categoria
    for categoria, anos_data in config['mapas'].items():
        if '2018' not in anos_data:
            continue
        
        corrigidos_cat = 0
        mapas_2018 = anos_data['2018']
        
        for mapa in mapas_2018:
            caminho_original = mapa.get('caminho', '')
            icon_original = mapa.get('icon', '')
            
            # Remove subpastas do caminho (mantém apenas a pasta principal)
            # Exemplo: mapas2018/economia/balanca_comercial/arquivo.png
            # Vira: mapas2018/economia/arquivo.png
            
            if 'mapas2018' in caminho_original:
                # Divide o caminho em partes
                partes = caminho_original.split('/')
                # Encontra o índice de 'mapas2018'
                try:
                    idx_mapas = partes.index('mapas2018')
                    # Mantém: ../mapas-modo-interativo/mapas2018/categoria/arquivo.png
                    nome_arquivo = partes[-1]  # arquivo.png
                    categoria_pasta = partes[idx_mapas + 1]  # economia, social, etc
                    
                    novo_caminho = f"../mapas-modo-interativo/mapas2018/{categoria_pasta}/{nome_arquivo}"
                    
                    # Corrige nome da pasta meio_ambiente para meioambiente
                    novo_caminho = novo_caminho.replace('/meio_ambiente/', '/meioambiente/')
                    
                    if novo_caminho != caminho_original:
                        mapa['caminho'] = novo_caminho
                        corrigidos_cat += 1
                        total_corrigido += 1
                except ValueError:
                    pass
            
            if 'icons_2018' in icon_original:
                # Divide o caminho em partes
                partes = icon_original.split('/')
                # Encontra o índice de 'icons_2018'
                try:
                    idx_icons = partes.index('icons_2018')
                    # Mantém: ../icons-mapa-interativo/icons_2018/categoria/arquivo.png
                    nome_arquivo = partes[-1]  # arquivo.png
                    categoria_pasta = partes[idx_icons + 1]  # economia, social, etc
                    
                    novo_icon = f"../icons-mapa-interativo/icons_2018/{categoria_pasta}/{nome_arquivo}"
                    
                    if novo_icon != icon_original:
                        mapa['icon'] = novo_icon
                except ValueError:
                    pass
        
        if corrigidos_cat > 0:
            print(f'  {categoria}: {corrigidos_cat} caminhos corrigidos')
    
    # Salva o arquivo atualizado
    with open('config-mapas.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Total de caminhos corrigidos: {total_corrigido}')
    print('📄 Arquivo atualizado: config-mapas.json')

if __name__ == '__main__':
    corrigir_caminhos_2018()
