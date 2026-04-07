"""
Diagnostico detalhado dos arquivos de infraestrutura
"""

import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).parent
TABELAS_DIR = BASE_DIR / "tabelas2025"
infra_dir = TABELAS_DIR / "3-Infraestrutura"

arquivos = [
    "Tab 3.7 Total de  Movimentação nos Portos - 2020 a 2024.xlsx",
    "Tab 3.10 Total de Pouso mais decolagem de Aeronaves - 2019 a 2023.xlsx",
    "Tab 3.11 Total de Embarque mais desembarque de passageiros - 2019 a 2023.xlsx",
    "Tab 3.12 Abastecimento de Água Segundo Consumidores e Volume Consumido - 2018 a 2022.xlsx",
]

for arquivo_nome in arquivos:
    caminho = infra_dir / arquivo_nome
    
    if not caminho.exists():
        print(f"\nArquivo nao encontrado: {arquivo_nome}")
        continue
    
    print(f"\n{'='*80}")
    print(f"Arquivo: {arquivo_nome}")
    print('='*80)
    
    try:
        # Ver estrutura bruta (primeiras 8 linhas)
        df_raw = pd.read_excel(caminho, header=None, nrows=8)
        print("\nPrimeiras 8 linhas (estrutura bruta):")
        print(df_raw)
        
        # Tentar com header=4
        df = pd.read_excel(caminho, header=4, nrows=5)
        print(f"\n\nColunas com header=4:")
        for i, col in enumerate(df.columns):
            print(f"  [{i}] {col}")
        
        print(f"\nPrimeiras 3 linhas de dados:")
        print(df.head(3))
        
        # Tentar identificar colunas de anos
        print(f"\n\nTentando identificar colunas de anos:")
        for col in df.columns:
            col_str = str(col).strip()
            print(f"  {col} -> tipo: {type(col).__name__}, str: '{col_str}'")
        
    except Exception as e:
        print(f"\nERRO: {e}")
        import traceback
        traceback.print_exc()
