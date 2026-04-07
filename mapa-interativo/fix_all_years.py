"""
Script para corrigir todos os anos (2017-2023) no config-mapas.json
Adiciona campo 'icon' e corrige 'caminho' para apontar aos mapas completos
"""

import json
import re

def fix_config():
    # Carrega o arquivo JSON
    with open('config-mapas.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # Para cada categoria
    for categoria, anos_data in config['mapas'].items():
        print(f"\n📂 Processando categoria: {categoria}")
        
        # Para cada ano (exceto 2024 que já está correto)
        for ano in ['2017', '2018', '2019', '2020', '2021', '2022', '2023']:
            if ano not in anos_data:
                continue
            
            print(f"  📅 Ano {ano}: {len(anos_data[ano])} mapas")
            
            # Para cada mapa do ano
            for mapa in anos_data[ano]:
                caminho_atual = mapa.get('caminho', '')
                
                # Se já tem campo 'icon', pula
                if 'icon' in mapa:
                    continue
                
                # Detecta se o caminho atual aponta para icons ou mapas
                if '/icons-mapa-interativo/' in caminho_atual or '/icons_' in caminho_atual:
                    # Caminho atual é de ícone, precisa criar caminho do mapa completo
                    
                    # Extrai partes do caminho
                    # Exemplo: ../icons-mapa-interativo/icons_2023/social/Social_Leitos2022.png
                    # Deve virar:
                    # icon: ../icons-mapa-interativo/icons_2023/social/Social_Leitos2022.png
                    # caminho: ../mapas-modo-interativo/mapas2023/social/Social_Leitos2022.png
                    
                    mapa['icon'] = caminho_atual
                    
                    # Cria caminho do mapa completo
                    caminho_mapa = caminho_atual.replace('/icons-mapa-interativo/icons_', '/mapas-modo-interativo/mapas')
                    mapa['caminho'] = caminho_mapa
                    
                elif '/mapas-modo-interativo/' in caminho_atual:
                    # Caminho atual é de mapa completo, precisa criar caminho do ícone
                    
                    # Mantém o caminho como está
                    # Cria caminho do ícone
                    # Exemplo: ../mapas-modo-interativo/mapas2017/demografia/dem1_populacao_total_2016.png
                    # Deve virar:
                    # icon: ../icons-mapa-interativo/icons_2017/demografia/dem1_populacao_total_2016.png
                    # caminho: ../mapas-modo-interativo/mapas2017/demografia/dem1_populacao_total_2016.png
                    
                    caminho_icon = caminho_atual.replace('/mapas-modo-interativo/mapas', '/icons-mapa-interativo/icons_')
                    mapa['icon'] = caminho_icon
                    # caminho já está correto
    
    # Salva o arquivo atualizado
    with open('config-mapas.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Arquivo atualizado com sucesso!")
    print(f"📊 Total de mapas: {config['total']}")

if __name__ == '__main__':
    fix_config()
