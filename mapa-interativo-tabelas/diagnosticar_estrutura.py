"""
Script de diagnóstico para entender a estrutura dos arquivos Excel
"""

import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).parent
TABELAS_DIR = BASE_DIR / "tabelas2025"

def diagnosticar_excel(caminho):
    """Mostra a estrutura de um arquivo Excel"""
    print(f"\n{'='*80}")
    print(f"Arquivo: {caminho.name}")
    print('='*80)
    
    try:
        # Ler sem header para ver a estrutura bruta
        df_raw = pd.read_excel(caminho, header=None, nrows=6)
        
        print(f"\nLinhas 0-5 (estrutura bruta):")
        print(df_raw)
        
        # Ler com header=3
        df = pd.read_excel(caminho, header=3, nrows=5)
        
        print(f"\n\nColunas encontradas com header=3 ({len(df.columns)}):")
        for i, col in enumerate(df.columns):
            print(f"   [{i}] {col} (tipo: {type(col).__name__})")
        
        print(f"\nPrimeiras 3 linhas com header=3:")
        print(df.head(3))
        
    except Exception as e:
        print(f"   Erro: {e}")
        import traceback
        traceback.print_exc()

# Testar alguns arquivos de cada categoria
arquivos_teste = [
    TABELAS_DIR / "2-Economia" / "2.4 PIB" / "Tab 2.4.1 Produto Interno Bruto a Preços Correntes (Mil Reais) - 2017 a 2021.xlsx",
    TABELAS_DIR / "5-Social" / "5.3 MERCADO DE TRABALHO" / "Tab 5.3.1 Vínculos Empregatícios Total no Emprego Formal - 2019 a 2023.xlsx",
    TABELAS_DIR / "3-Infraestrutura" / "Tab 3.7 Total de  Movimentação nos Portos - 2020 a 2024.xlsx",
]

for arquivo in arquivos_teste:
    if arquivo.exists():
        diagnosticar_excel(arquivo)
    else:
        print(f"\n⚠️  Arquivo não encontrado: {arquivo}")
