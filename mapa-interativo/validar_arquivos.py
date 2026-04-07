"""
Script para validar se todos os arquivos (ícones e mapas) 
referenciados no config-mapas.json realmente existem
"""

import json
import os
from pathlib import Path

def validar_arquivos():
    # Carrega o arquivo JSON
    script_dir = Path(__file__).parent
    base_dir = script_dir.parent  # Sobe um nível (para anuario2024)
    config_path = script_dir / 'config-mapas.json'
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    print('=' * 80)
    print('🔍 VALIDAÇÃO DE ARQUIVOS - MAPA INTERATIVO')
    print('=' * 80)
    
    # Contadores
    total_mapas = 0
    total_icons = 0
    total_mapas_completos = 0
    icons_ok = 0
    mapas_completos_ok = 0
    icons_faltando = []
    mapas_faltando = []
    
    # Para cada categoria
    for categoria, anos_data in config['mapas'].items():
        print(f'\n📂 {categoria}')
        
        # Para cada ano
        for ano, mapas in anos_data.items():
            icons_ano = 0
            mapas_ano = 0
            icons_ok_ano = 0
            mapas_ok_ano = 0
            
            for mapa in mapas:
                total_mapas += 1
                titulo = mapa.get('titulo', 'Sem título')
                
                # Verifica ícone
                if 'icon' in mapa:
                    total_icons += 1
                    icons_ano += 1
                    # Remove ../ e resolve a partir de base_dir
                    icon_rel_path = mapa['icon'].replace('../', '')
                    icon_path = base_dir / icon_rel_path
                    
                    if icon_path.exists():
                        icons_ok += 1
                        icons_ok_ano += 1
                    else:
                        icons_faltando.append({
                            'categoria': categoria,
                            'ano': ano,
                            'titulo': titulo,
                            'caminho': str(icon_path)
                        })
                
                # Verifica mapa completo
                if 'caminho' in mapa:
                    total_mapas_completos += 1
                    mapas_ano += 1
                    # Remove ../ e resolve a partir de base_dir
                    mapa_rel_path = mapa['caminho'].replace('../', '')
                    mapa_path = base_dir / mapa_rel_path
                    
                    if mapa_path.exists():
                        mapas_completos_ok += 1
                        mapas_ok_ano += 1
                    else:
                        mapas_faltando.append({
                            'categoria': categoria,
                            'ano': ano,
                            'titulo': titulo,
                            'caminho': str(mapa_path)
                        })
            
            # Relatório por ano
            status_icon = '✅' if icons_ok_ano == icons_ano else '⚠️'
            status_mapa = '✅' if mapas_ok_ano == mapas_ano else '⚠️'
            
            print(f'  {ano}: {status_icon} Icons: {icons_ok_ano}/{icons_ano} | '
                  f'{status_mapa} Mapas: {mapas_ok_ano}/{mapas_ano}')
    
    # Relatório Final
    print('\n' + '=' * 80)
    print('📊 RESUMO GERAL')
    print('=' * 80)
    print(f'Total de mapas cadastrados: {total_mapas}')
    print(f'\n📸 ÍCONES (Thumbnails):')
    print(f'  Total esperado: {total_icons}')
    print(f'  Encontrados: {icons_ok} ({icons_ok/total_icons*100:.1f}%)')
    print(f'  Faltando: {len(icons_faltando)}')
    
    print(f'\n🗺️ MAPAS COMPLETOS:')
    print(f'  Total esperado: {total_mapas_completos}')
    print(f'  Encontrados: {mapas_completos_ok} ({mapas_completos_ok/total_mapas_completos*100:.1f}%)')
    print(f'  Faltando: {len(mapas_faltando)}')
    
    # Lista arquivos faltando
    if icons_faltando:
        print(f'\n❌ ÍCONES FALTANDO ({len(icons_faltando)}):')
        print('-' * 80)
        for item in icons_faltando[:20]:  # Mostra no máximo 20
            print(f'  • {item["categoria"]} ({item["ano"]}): {item["titulo"]}')
            print(f'    Caminho: {item["caminho"]}')
        if len(icons_faltando) > 20:
            print(f'  ... e mais {len(icons_faltando) - 20} ícones')
    
    if mapas_faltando:
        print(f'\n❌ MAPAS COMPLETOS FALTANDO ({len(mapas_faltando)}):')
        print('-' * 80)
        for item in mapas_faltando[:20]:  # Mostra no máximo 20
            print(f'  • {item["categoria"]} ({item["ano"]}): {item["titulo"]}')
            print(f'    Caminho: {item["caminho"]}')
        if len(mapas_faltando) > 20:
            print(f'  ... e mais {len(mapas_faltando) - 20} mapas')
    
    # Status final
    print('\n' + '=' * 80)
    if len(icons_faltando) == 0 and len(mapas_faltando) == 0:
        print('✅ TODOS OS ARQUIVOS ESTÃO PRESENTES!')
    else:
        print('⚠️ ALGUNS ARQUIVOS ESTÃO FALTANDO - Verifique os caminhos acima')
    print('=' * 80)
    
    # Salva relatório em arquivo
    report_path = script_dir / 'relatorio_validacao.txt'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write('RELATÓRIO DE VALIDAÇÃO DE ARQUIVOS\n')
        f.write('=' * 80 + '\n\n')
        f.write(f'Total de mapas: {total_mapas}\n')
        f.write(f'Ícones OK: {icons_ok}/{total_icons} ({icons_ok/total_icons*100:.1f}%)\n')
        f.write(f'Mapas OK: {mapas_completos_ok}/{total_mapas_completos} ({mapas_completos_ok/total_mapas_completos*100:.1f}%)\n\n')
        
        if icons_faltando:
            f.write('\nÍCONES FALTANDO:\n')
            f.write('-' * 80 + '\n')
            for item in icons_faltando:
                f.write(f'{item["categoria"]} ({item["ano"]}): {item["titulo"]}\n')
                f.write(f'  {item["caminho"]}\n\n')
        
        if mapas_faltando:
            f.write('\nMAPAS COMPLETOS FALTANDO:\n')
            f.write('-' * 80 + '\n')
            for item in mapas_faltando:
                f.write(f'{item["categoria"]} ({item["ano"]}): {item["titulo"]}\n')
                f.write(f'  {item["caminho"]}\n\n')
    
    print(f'\n📄 Relatório completo salvo em: {report_path}')

if __name__ == '__main__':
    validar_arquivos()
