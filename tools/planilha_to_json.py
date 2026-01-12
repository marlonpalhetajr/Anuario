import argparse
import json
from pathlib import Path

import pandas as pd

"""
Converte uma planilha Excel (XLSX) com indicadores municipais em JSON para o mapa interativo.

Pré-requisitos:
  pip install -r tools/requirements.txt

Uso básico:
  python tools/planilha_to_json.py \
    --xlsx "planilhas/demografia/tab-1.1-populacao-total-estimativas-populacionais-e-censo-deografico-2020-a-2024.xlsx" \
    --abas "2024" \
    --col-municipio "Município" \
    --map-colunas populacao:"População Total" pib:"PIB" idh:"IDH" densidade:"Densidade Demográfica" \
    --saida "data/indicadores_municipios_2024.json"

Notas:
- Ajuste os nomes das colunas conforme sua planilha.
- Para ler de várias abas, liste em --abas separadas por vírgula e a última encontrada para cada município será usada.
- Se uma coluna não existir, será ignorada.
"""


def parse_args():
    p = argparse.ArgumentParser(description="Converte XLSX de indicadores municipais para JSON do mapa")
    p.add_argument("--xlsx", required=True, help="Caminho do arquivo .xlsx")
    p.add_argument("--abas", default=None, help="Nomes das abas a ler, separados por vírgula. Se vazio, lê a primeira aba")
    p.add_argument("--col-municipio", default="Município", help="Nome da coluna com o município")
    p.add_argument(
        "--map-colunas",
        nargs="+",
        default=["populacao:População", "pib:PIB", "idh:IDH", "densidade:Densidade"],
        help="Mapeamentos no formato chave:ColunaDaPlanilha (ex: populacao:População Total)"
    )
    p.add_argument("--saida", required=True, help="Arquivo JSON de saída")
    return p.parse_args()


def build_column_map(mappings):
    out = {}
    for m in mappings:
        if ":" not in m:
            raise ValueError(f"Mapeamento inválido: {m}. Use chave:Coluna")
        k, col = m.split(":", 1)
        out[k.strip()] = col.strip()
    return out


def normalize_municipio(name: str) -> str:
    return name.strip()


def main():
    args = parse_args()
    xlsx_path = Path(args.xlsx)
    if not xlsx_path.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {xlsx_path}")

    abas = None if not args.abas else [a.strip() for a in args.abas.split(",") if a.strip()]
    col_map = build_column_map(args.map_colunas)

    frames = []
    if abas:
        for aba in abas:
            try:
                frames.append(pd.read_excel(xlsx_path, sheet_name=aba))
            except Exception as e:
                print(f"Aviso: não foi possível ler a aba '{aba}': {e}")
    else:
        frames.append(pd.read_excel(xlsx_path))

    # Concatena e mantém últimas ocorrências
    if not frames:
        raise RuntimeError("Nenhuma aba válida foi lida da planilha")
    df = pd.concat(frames, ignore_index=True)

    if args.col_municipio not in df.columns:
        raise KeyError(f"Coluna de município '{args.col_municipio}' não encontrada. Colunas: {list(df.columns)}")

    # Seleciona apenas colunas relevantes que existem
    cols_presentes = [c for c in col_map.values() if c in df.columns]
    sel_cols = [args.col_municipio] + cols_presentes
    df = df[sel_cols].copy()
    df[args.col_municipio] = df[args.col_municipio].astype(str).map(normalize_municipio)

    # Agrega por município, mantendo última linha (caso haja duplicidade)
    df = df.groupby(args.col_municipio, as_index=False).last()

    # Monta estrutura JSON
    out = {}
    for _, row in df.iterrows():
        mun = row[args.col_municipio]
        item = {}
        for k, col in col_map.items():
            if col in row and pd.notna(row[col]):
                val = row[col]
                try:
                    val = float(val)
                except Exception:
                    pass
                item[k] = val
        # Campos opcionais que você pode adicionar manualmente depois (regiao, coords)
        out[mun] = item

    # Salva
    saida_path = Path(args.saida)
    saida_path.parent.mkdir(parents=True, exist_ok=True)
    with open(saida_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"OK: JSON gerado em {saida_path}")


if __name__ == "__main__":
    main()
