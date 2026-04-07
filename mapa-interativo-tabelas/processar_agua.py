"""
Processar arquivo de agua
"""

import pandas as pd
import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
TABELAS_DIR = BASE_DIR / "tabelas2025"
OUTPUT_DIR = BASE_DIR.parent / "data"
infra_dir = TABELAS_DIR / "3-Infraestrutura"

arquivo = infra_dir / "Tab 3.12 Abastecimento de Água Segundo Consumidores e Volume Consumido - 2018 a 2022.xlsx"

print("Processando: Abastecimento de Agua 2022")

if not arquivo.exists():
    print("  Arquivo nao encontrado")
else:
    try:
        df_raw = pd.read_excel(arquivo, header=None)
        
        # Linha 6 (indice 6) tem os anos
        # Coluna 5 (indice 5) = 2022 para "População atendida"
        linha_anos = df_raw.iloc[6]
        print(f"  Anos encontrados: {[x for x in linha_anos if pd.notna(x)]}")
        
        col_2022 = 5  # Coluna do ano 2022 para populacao atendida
        
        # Municipios comecam na linha 7
        dados = {}
        for idx in range(7, len(df_raw)):
            row = df_raw.iloc[idx]
            municipio = str(row[0]).strip() if pd.notna(row[0]) else None
            
            if not municipio or municipio in ['nan', 'NaN', 'Total', 'Para', 'Estado']:
                continue
            
            valor = row[col_2022]
            if pd.notna(valor):
                try:
                    dados[municipio] = float(valor)
                except:
                    pass
        
        if dados:
            output = OUTPUT_DIR / "consumidores_agua_2022.json"
            with open(output, 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            print(f"  OK: {len(dados)} municipios -> {output.name}")
        else:
            print("  AVISO: Nenhum dado extraido")
            
    except Exception as e:
        print(f"  ERRO: {e}")
