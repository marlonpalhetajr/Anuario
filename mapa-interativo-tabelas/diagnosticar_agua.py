"""
Diagnostico do arquivo de agua
"""

import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).parent
TABELAS_DIR = BASE_DIR / "tabelas2025"
infra_dir = TABELAS_DIR / "3-Infraestrutura"

arquivo = infra_dir / "Tab 3.12 Abastecimento de Água Segundo Consumidores e Volume Consumido - 2018 a 2022.xlsx"

if arquivo.exists():
    print("Estrutura do arquivo de Agua:")
    print("="*80)
    
    df_raw = pd.read_excel(arquivo, header=None, nrows=10)
    print("\nPrimeiras 10 linhas:")
    print(df_raw)
    
    print("\n\nLinhas 4-6 (possivel header e dados):")
    for i in range(4, 7):
        print(f"\nLinha {i}: {list(df_raw.iloc[i])}")
