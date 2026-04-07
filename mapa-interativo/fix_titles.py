"""
Script para melhorar títulos de mapas com acentuação adequada
"""

import json
import re

def melhorar_titulo(titulo_original):
    """Aplica regras de formatação e acentuação aos títulos"""
    
    # Dicionário de substituições comuns
    substituicoes = {
        'Populacao': 'População',
        'Estimativa': 'Estimativa',
        'Indice': 'Índice',
        'Razao': 'Razão',
        'Dependencia': 'Dependência',
        'ICMS': 'ICMS',
        'Orcamentaria': 'Orçamentária',
        'Ora7amentaria': 'Orçamentária',
        'Balanca': 'Balança',
        'Balana7a': 'Balança',
        'PIB': 'PIB',
        'Per Capita': 'Per Capita',
        'Agropecuaria': 'Agropecuária',
        'Agropecua1ria': 'Agropecuária',
        'Industria': 'Indústria',
        'Servicos': 'Serviços',
        'Transferencias': 'Transferências',
        'Transf': 'Transferências',
        'Area': 'Área',
        'Familia': 'Família',
        'Familias': 'Famílias',
        'Distorcao': 'Distorção',
        'Distora7a3o': 'Distorção',
        'Serie': 'Série',
        'Sa9rie': 'Série',
        'Ens.': 'Ens.',
        'Ma9dio': 'Médio',
        'Medio': 'Médio',
        'Medicos': 'Médicos',
        'Leitos': 'Leitos',
        'Homicidio': 'Homicídio',
        'Transito': 'Trânsito',
        'Natalidade': 'Natalidade',
        'Mortalidade': 'Mortalidade',
        'Infantil': 'Infantil',
        'Infancia': 'Infância',
        'Aprovacao': 'Aprovação',
        'Reprovacao': 'Reprovação',
        'Vinculos': 'Vínculos',
        'Remuneracao': 'Remuneração',
        'Territorio': 'Território',
        'Geologico': 'Geológico',
        'Geomorfologico': 'Geomorfológico',
        'Hidrografia': 'Hidrografia',
        'Municipios': 'Municípios',
        'Pedologico': 'Pedológico',
        'Regiao': 'Região',
        'Imediata': 'Imediata',
        'Intermediaria': 'Intermediária',
        'Integracao': 'Integração',
        'Belem': 'Belém',
        'Metropolitana': 'Metropolitana',
        'Zoneamento': 'Zoneamento',
        'Fitoecologia': 'Fitoecologia',
        'Energia': 'Energia',
        'Consumidores': 'Consumidores',
        'Consumo': 'Consumo',
        'Frota': 'Frota',
        'Veiculos': 'Veículos'
    }
    
    titulo = titulo_original
    
    # Aplica substituições
    for antiga, nova in substituicoes.items():
        titulo = re.sub(r'\b' + antiga + r'\b', nova, titulo, flags=re.IGNORECASE)
    
    # Adiciona espaços antes de anos (2016, 2017, etc)
    titulo = re.sub(r'(\D)(20\d{2})', r'\1 \2', titulo)
    
    # Remove espaços múltiplos
    titulo = re.sub(r'\s+', ' ', titulo).strip()
    
    return titulo

def fix_titles():
    # Carrega o arquivo JSON
    with open('config-mapas.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    total_melhorado = 0
    
    # Para cada categoria
    for categoria, anos_data in config['mapas'].items():
        print(f"\n📂 {categoria}")
        
        # Para cada ano
        for ano, mapas in anos_data.items():
            melhorados = 0
            
            # Para cada mapa do ano
            for mapa in mapas:
                titulo_original = mapa['titulo']
                titulo_novo = melhorar_titulo(titulo_original)
                
                if titulo_original != titulo_novo:
                    mapa['titulo'] = titulo_novo
                    melhorados += 1
                    total_melhorado += 1
            
            if melhorados > 0:
                print(f"  {ano}: {melhorados} títulos melhorados")
    
    # Salva o arquivo atualizado
    with open('config-mapas.json', 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Total de títulos melhorados: {total_melhorado}")

if __name__ == '__main__':
    fix_titles()
