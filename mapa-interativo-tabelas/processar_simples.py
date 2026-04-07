"""
Script simples para processar dados pendentes do Anuario 2025
"""

import pandas as pd
import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
TABELAS_DIR = BASE_DIR / "tabelas2025"
OUTPUT_DIR = BASE_DIR.parent / "data"

print("\n" + "="*60)
print("PROCESSAMENTO DE DADOS PENDENTES")
print("="*60 + "\n")

def processar_arquivo(caminho, ano, nome_output):
    """Processa um arquivo Excel e salva como JSON"""
    try:
        print(f"Processando: {caminho.name}")
        
        # Ler Excel com header na linha 4
        df = pd.read_excel(caminho, header=4)
        
        # Primeira coluna = municipios
        col_mun = df.columns[0]
        
        # Encontrar coluna do ano
        col_ano = None
        for col in df.columns[1:]:  # Pula primeira coluna
            try:
                col_str = str(col).replace('.0', '').strip()
                if col_str == str(ano):
                    col_ano = col
                    break
            except:
                continue
        
        if col_ano is None:
            print(f"  AVISO: Ano {ano} nao encontrado")
            return False
        
        # Extrair dados
        dados = {}
        for _, row in df.iterrows():
            mun = str(row[col_mun]).strip()
            
            # Pular linhas vazias e totalizadores
            if not mun or mun in ['nan', 'NaN', 'Total', 'Para', 'Estado']:
                continue
            
            valor = row[col_ano]
            if pd.notna(valor):
                try:
                    dados[mun] = float(valor)
                except:
                    pass
        
        if not dados:
            print(f"  AVISO: Nenhum dado extraido")
            return False
        
        # Salvar JSON
        output = OUTPUT_DIR / f"{nome_output}.json"
        with open(output, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        
        print(f"  OK: {len(dados)} municipios -> {output.name}")
        return True
        
    except Exception as e:
        print(f"  ERRO: {e}")
        return False

# PIB 2021
print("\n--- PIB E VALOR AGREGADO (2021) ---")
pib_dir = TABELAS_DIR / "2-Economia" / "2.4 PIB"

for arquivo in pib_dir.glob("Tab 2.4.1*.xlsx"):
    processar_arquivo(arquivo, 2021, "pib_total_2021")

for arquivo in pib_dir.glob("Tab 2.4.8*.xlsx"):
    processar_arquivo(arquivo, 2021, "pib_per_capita_2021")

# Mercado de Trabalho 2023
print("\n--- MERCADO DE TRABALHO (2023) ---")
merc_dir = TABELAS_DIR / "5-Social" / "5.3 MERCADO DE TRABALHO"

for arquivo in merc_dir.glob("Tab 5.3.1*.xlsx"):
    processar_arquivo(arquivo, 2023, "vinculos_emprego_formal_2023")

for arquivo in merc_dir.glob("Tab 5.3.6*.xlsx"):
    processar_arquivo(arquivo, 2023, "remuneracao_media_2023")

# Infraestrutura
print("\n--- INFRAESTRUTURA (2024) ---")
infra_dir = TABELAS_DIR / "3-Infraestrutura"

for arquivo in infra_dir.glob("Tab 3.7*.xlsx"):
    processar_arquivo(arquivo, 2024, "movimentacao_portos_2024")

print("\n" + "="*60)
print("PROCESSAMENTO CONCLUIDO")
print("="*60)
print(f"\nArquivos JSON salvos em: {OUTPUT_DIR}")
