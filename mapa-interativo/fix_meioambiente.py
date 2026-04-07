"""
Script para corrigir caminhos de meio_ambiente para meioambiente em 2017 e 2018
"""

import json

def corrigir_meio_ambiente():
    with open('config-mapas.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    print('🔧 Corrigindo caminhos de Meio Ambiente para 2017 e 2018...\n')
    
    total_corrigido_icons = 0
    total_corrigido_mapas = 0
    
    # Para categoria Meio Ambiente
    if 'Meio Ambiente' in config['mapas']:
        meio_ambiente = config['mapas']['Meio Ambiente']
        
        for ano in ['2017', '2018']:
            if ano not in meio_ambiente:
                continue
            
            icons_corrigidos = 0
            mapas_corrigidos = 0
            
            for mapa in meio_ambiente[ano]:
                # Corrige ícone: icons_XXXX/meio_ambiente/ deve ser icons_XXXX/meio_ambiente/
                if 'icon' in mapa:
                    icon_original = mapa['icon']
                    # Para icons, mantém meio_ambiente (com underscore)
                    # Não precisa correção
                
                # Corrige mapa: mapas20XX/meioambiente/ (sem underscore)
                if 'caminho' in mapa:
                    caminho_original = mapa['caminho']
                    if '/meio_ambiente/' in caminho_original or '/meioambiente/' in caminho_original:
                        # Garante que seja meioambiente (sem underscore) nos mapas
                        novo_caminho = caminho_original.replace('/meio_ambiente/', '/meioambiente/')
                        
                        if novo_caminho != caminho_original:
                            mapa['caminho'] = novo_caminho
                            mapas_corrigidos += 1
                            total_corrigido_mapas += 1
            
            if icons_corrigidos > 0 or mapas_corrigidos > 0:
                print(f'  {ano}: Ícones: {icons_corrigidos}, Mapas: {mapas_corrigidos}')
    
    # Salva o arquivo atualizado
    with open('config-mapas.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Total corrigido:')
    print(f'   Ícones: {total_corrigido_icons}')
    print(f'   Mapas: {total_corrigido_mapas}')
    print('📄 Arquivo atualizado: config-mapas.json')

if __name__ == '__main__':
    corrigir_meio_ambiente()
