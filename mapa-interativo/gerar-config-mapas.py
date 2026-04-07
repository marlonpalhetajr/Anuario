#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para gerar configuração de mapas do modo interativo
Escaneia a pasta mapas-modo-interativo e gera um JSON com todos os mapas organizados
"""

import os
import json
import re
from pathlib import Path

# Caminho base
BASE_DIR = Path(r"c:\Users\marlon.junior\OneDrive - Fapespa\anuario2024")
MAPAS_DIR = BASE_DIR / "mapas-modo-interativo"
OUTPUT_FILE = BASE_DIR / "mapa-interativo" / "config-mapas.json"

# Anos disponíveis
ANOS = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"]

# Mapeamento de categorias
CATEGORIAS = {
    "demografia": "Demografia",
    "economia": "Economia",
    "infraestrutura": "Infraestrutura",
    "meio_ambiente": "Meio Ambiente",
    "meioambiente": "Meio Ambiente",
    "social": "Social",
    "territorio": "Território"
}

def normalizar_nome_arquivo(nome_arquivo):
    """Remove extensão e normaliza nome do arquivo"""
    nome = nome_arquivo.replace('.png', '').replace('.jpg', '')
    return nome

def extrair_info_mapa(nome_arquivo, categoria, ano):
    """Extrai informações do mapa a partir do nome do arquivo"""
    nome_normalizado = normalizar_nome_arquivo(nome_arquivo)
    
    # Remove prefixos numéricos comuns
    nome_limpo = re.sub(r'^\d+[-_]', '', nome_normalizado)
    nome_limpo = re.sub(r'^[a-z]+\d+[-_]', '', nome_limpo, flags=re.IGNORECASE)
    
    # Substitui underscores e hífens por espaços
    titulo = nome_limpo.replace('_', ' ').replace('-', ' ')
    
    # Capitaliza palavras
    titulo = ' '.join(word.capitalize() for word in titulo.split())
    
    # Correções específicas
    titulo = titulo.replace('Pib', 'PIB')
    titulo = titulo.replace('Icms', 'ICMS')
    titulo = titulo.replace('Ideb', 'IDEB')
    titulo = titulo.replace('Rmb', 'RMB')
    titulo = titulo.replace('Va ', 'VA ')
    titulo = titulo.replace('A7', 'ç')  # Corrige encoding
    titulo = titulo.replace('A3', 'ã')
    titulo = titulo.replace('A9', 'é')
    titulo = titulo.replace('B3', 'ó')
    
    return {
        "arquivo": nome_arquivo,
        "titulo": titulo,
        "ano": ano,
        "categoria": CATEGORIAS.get(categoria.lower(), categoria)
    }

def escanear_mapas():
    """Escaneia todos os mapas e organiza por ano e categoria"""
    mapas = []
    
    for ano in ANOS:
        pasta_ano = MAPAS_DIR / f"mapas{ano}"
        
        if not pasta_ano.exists():
            print(f"⚠️ Pasta não encontrada: {pasta_ano}")
            continue
        
        print(f"📂 Escaneando {pasta_ano.name}...")
        
        # Escaneia categorias
        for categoria_dir in pasta_ano.iterdir():
            if not categoria_dir.is_dir():
                continue
            
            categoria_nome = categoria_dir.name
            print(f"  📁 {categoria_nome}")
            
            # Escaneia mapas (pode ter subpastas)
            arquivos_encontrados = []
            
            # Primeiro nível
            for arquivo in categoria_dir.glob("*.png"):
                if arquivo.name.lower() != 'thumbs.db':
                    arquivos_encontrados.append((arquivo, categoria_nome))
            
            # Segundo nível (subpastas)
            for subpasta in categoria_dir.iterdir():
                if subpasta.is_dir():
                    for arquivo in subpasta.glob("*.png"):
                        if arquivo.name.lower() != 'thumbs.db':
                            arquivos_encontrados.append((arquivo, categoria_nome))
            
            # Processa arquivos encontrados
            for arquivo, cat_nome in arquivos_encontrados:
                info_mapa = extrair_info_mapa(arquivo.name, cat_nome, ano)
                
                # Caminho relativo a partir da pasta mapa-interativo
                caminho_relativo = f"../mapas-modo-interativo/mapas{ano}/{cat_nome}"
                if arquivo.parent.name != cat_nome:
                    caminho_relativo += f"/{arquivo.parent.name}"
                caminho_relativo += f"/{arquivo.name}"
                
                info_mapa["caminho"] = caminho_relativo
                mapas.append(info_mapa)
                print(f"    ✓ {info_mapa['titulo']}")
    
    return mapas

def organizar_por_categoria_e_ano(mapas):
    """Organiza mapas por categoria e ano"""
    organizados = {}
    
    for mapa in mapas:
        categoria = mapa["categoria"]
        ano = mapa["ano"]
        
        if categoria not in organizados:
            organizados[categoria] = {}
        
        if ano not in organizados[categoria]:
            organizados[categoria][ano] = []
        
        organizados[categoria][ano].append({
            "titulo": mapa["titulo"],
            "arquivo": mapa["arquivo"],
            "caminho": mapa["caminho"]
        })
    
    return organizados

def gerar_config():
    """Gera arquivo de configuração JSON"""
    print("=" * 60)
    print("GERADOR DE CONFIGURAÇÃO DE MAPAS")
    print("=" * 60)
    print()
    
    # Escaneia mapas
    mapas = escanear_mapas()
    
    print()
    print(f"✅ Total de mapas encontrados: {len(mapas)}")
    print()
    
    # Organiza por categoria e ano
    mapas_organizados = organizar_por_categoria_e_ano(mapas)
    
    # Estatísticas
    print("📊 ESTATÍSTICAS:")
    print("-" * 60)
    for categoria in sorted(mapas_organizados.keys()):
        total_categoria = sum(len(mapas_organizados[categoria][ano]) 
                             for ano in mapas_organizados[categoria])
        print(f"  {categoria}: {total_categoria} mapas")
        for ano in sorted(mapas_organizados[categoria].keys()):
            qtd = len(mapas_organizados[categoria][ano])
            print(f"    - {ano}: {qtd} mapas")
    print()
    
    # Salva configuração
    config = {
        "anos": ANOS,
        "categorias": list(set(CATEGORIAS.values())),
        "mapas": mapas_organizados,
        "total": len(mapas)
    }
    
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Configuração salva em: {OUTPUT_FILE}")
    print()
    print("=" * 60)

if __name__ == "__main__":
    gerar_config()
