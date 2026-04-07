"""
Processador especial para arquivos de infraestrutura com estrutura pivot
"""

import pandas as pd
import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
TABELAS_DIR = BASE_DIR / "tabelas2025"
OUTPUT_DIR = BASE_DIR.parent / "data"
infra_dir = TABELAS_DIR / "3-Infraestrutura"

print("\n" + "="*60)
print("PROCESSAMENTO DE INFRAESTRUTURA - ESTRUTURA ESPECIAL")
print("="*60 + "\n")

def processar_portos():
    """
    Tab 3.7: Anos na linha 5 (primeira linha de dados)
    """
    arquivo = infra_dir / "Tab 3.7 Total de  Movimentação nos Portos - 2020 a 2024.xlsx"
    
    if not arquivo.exists():
        print("Arquivo de portos nao encontrado")
        return False
    
    print("Processando: Movimentacao nos Portos")
    
    try:
        # Ler sem header para ver estrutura bruta
        df_raw = pd.read_excel(arquivo, header=None)
        
        # Linha 4 (indice 4) = "Estado/Municipio"
        # Linha 5 (indice 5) = Anos: NaN, 2020, 2021, 2022, 2023, 2024
        
        # Encontrar indices dos anos na linha 5
        anos_linha = df_raw.iloc[5]
        print(f"  Linha de anos: {list(anos_linha)}")
        
        # Identificar coluna do ano 2024
        col_2024 = None
        for idx, valor in enumerate(anos_linha):
            if pd.notna(valor):
                try:
                    if int(float(valor)) == 2024:
                        col_2024 = idx
                        break
                except:
                    pass
        
        if col_2024 is None:
            print("  AVISO: Coluna 2024 nao encontrada")
            return False
        
        print(f"  Coluna 2024 encontrada: indice {col_2024}")
        
        # Extrair dados (municípios começam na linha 6)
        dados = {}
        for idx in range(6, len(df_raw)):
            row = df_raw.iloc[idx]
            municipio = str(row[0]).strip() if pd.notna(row[0]) else None
            
            if not municipio or municipio in ['nan', 'NaN', 'Total', 'Para', 'Estado']:
                continue
            
            valor = row[col_2024]
            if pd.notna(valor):
                try:
                    dados[municipio] = float(valor)
                except:
                    pass
        
        if dados:
            output = OUTPUT_DIR / "movimentacao_portos_2024.json"
            with open(output, 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            print(f"  OK: {len(dados)} municipios -> {output.name}")
            return True
        else:
            print("  AVISO: Nenhum dado extraido")
            return False
            
    except Exception as e:
        print(f"  ERRO: {e}")
        import traceback
        traceback.print_exc()
        return False

def processar_aviacao_simples(arquivo_path, ano, nome_output, coluna_total_idx=15):
    """
    Tab 3.10 e 3.11: Estrutura com subcategorias, usar coluna "Total"
    """
    if not arquivo_path.exists():
        return False
    
    print(f"Processando: {arquivo_path.name}")
    
    try:
        df_raw = pd.read_excel(arquivo_path, header=None)
        
        # Linha 6 (indice 6) tem subcategorias incluindo "Total"
        # Verificar qual coluna tem "Total"
        linha_subcats = df_raw.iloc[6]
        
        col_total = None
        for idx, valor in enumerate(linha_subcats):
            if pd.notna(valor) and str(valor).strip().lower() == 'total':
                col_total = idx
                break
        
        if col_total is None:
            print(f"  AVISO: Coluna Total nao encontrada")
            return False
        
        print(f"  Coluna Total encontrada: indice {col_total}")
        
        # Extrair dados (municípios começam na linha 7)
        dados = {}
        for idx in range(7, len(df_raw)):
            row = df_raw.iloc[idx]
            municipio = str(row[0]).strip() if pd.notna(row[0]) else None
            
            if not municipio or municipio in ['nan', 'NaN', 'Total', 'Para', 'Estado']:
                continue
            
            valor = row[col_total]
            if pd.notna(valor):
                try:
                    dados[municipio] = float(valor)
                except:
                    pass
        
        if dados:
            output = OUTPUT_DIR / f"{nome_output}.json"
            with open(output, 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            print(f"  OK: {len(dados)} municipios -> {output.name}")
            return True
        else:
            print("  AVISO: Nenhum dado extraido")
            return False
            
    except Exception as e:
        print(f"  ERRO: {e}")
        return False

# Processar cada arquivo
print("--- PORTOS (2024) ---")
processar_portos()

print("\n--- AVIACAO (2023) ---")
processar_aviacao_simples(
    infra_dir / "Tab 3.10 Total de Pouso mais decolagem de Aeronaves - 2019 a 2023.xlsx",
    2023,
    "aeronaves_total_2023"
)

processar_aviacao_simples(
    infra_dir / "Tab 3.11 Total de Embarque mais desembarque de passageiros - 2019 a 2023.xlsx",
    2023,
    "passageiros_aeroportos_2023"
)

print("\n" + "="*60)
print("PROCESSAMENTO CONCLUIDO")
print("="*60)
print(f"\nArquivos JSON salvos em: {OUTPUT_DIR}")
