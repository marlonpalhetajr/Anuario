from __future__ import annotations

import argparse
import re
import unicodedata
import zipfile
from pathlib import Path

import pandas as pd


def normalizar_nome(valor: str) -> str:
    if pd.isna(valor):
        return "sem_nome"
    texto = unicodedata.normalize("NFKD", str(valor)).encode("ascii", "ignore").decode("ascii")
    texto = texto.lower().strip()
    texto = re.sub(r"[^a-z0-9]+", "_", texto)
    texto = re.sub(r"_+", "_", texto).strip("_")
    return texto or "sem_nome"


def garantir_colunas(df: pd.DataFrame, colunas: list[str]) -> None:
    faltantes = [c for c in colunas if c not in df.columns]
    if faltantes:
        raise ValueError(f"Colunas obrigatórias ausentes: {faltantes}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Cria repositório 2025 de tabelas a partir do Anuário_2025.zip")
    parser.add_argument(
        "--zip",
        default=r"c:\Users\Junior\OneDrive - Fapespa\anuario2024\repositorio\Anuário_2025.zip",
        help="Caminho para o arquivo ZIP com Anuário_2025.csv e Anuário_2025.xlsx",
    )
    parser.add_argument(
        "--output",
        default=r"c:\Users\Junior\OneDrive - Fapespa\anuario2024\repositorio_2025",
        help="Pasta de saída do novo repositório de tabelas 2025",
    )
    args = parser.parse_args()

    zip_path = Path(args.zip)
    out_dir = Path(args.output)
    if not zip_path.exists():
        raise FileNotFoundError(f"ZIP não encontrado: {zip_path}")

    fonte_dir = out_dir / "_fonte"
    por_tematica_dir = out_dir / "tabelas_por_tematica"
    por_subtema_dir = out_dir / "tabelas_por_tematica_subtema"
    for pasta in [fonte_dir, por_tematica_dir, por_subtema_dir]:
        pasta.mkdir(parents=True, exist_ok=True)

    for arquivo_antigo in por_tematica_dir.glob("*.csv"):
        arquivo_antigo.unlink()
    for arquivo_antigo in por_subtema_dir.glob("*.csv"):
        arquivo_antigo.unlink()

    with zipfile.ZipFile(zip_path) as zf:
        nomes = zf.namelist()
        csv_nome = next((n for n in nomes if n.lower().endswith(".csv")), None)
        xlsx_nome = next((n for n in nomes if n.lower().endswith(".xlsx")), None)
        if not csv_nome:
            raise ValueError("Nenhum CSV encontrado no ZIP")

        if xlsx_nome:
            zf.extract(xlsx_nome, path=fonte_dir)

        with zf.open(csv_nome) as f:
            df = pd.read_csv(f, encoding="utf-8")

    garantir_colunas(df, ["tematica", "subtema", "indicador", "localidade", "ano", "valor"])

    csv_path = fonte_dir / "Anuario_2025.csv"
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")

    cont_tematica = 0
    for tematica, grupo in df.groupby("tematica", dropna=False):
        nome = normalizar_nome(tematica)
        grupo.to_csv(por_tematica_dir / f"{nome}.csv", index=False, encoding="utf-8-sig")
        cont_tematica += 1

    cont_subtema = 0
    for (tematica, subtema), grupo in df.groupby(["tematica", "subtema"], dropna=False):
        nome_t = normalizar_nome(tematica)
        nome_s = normalizar_nome(subtema)
        grupo.to_csv(por_subtema_dir / f"{nome_t}__{nome_s}.csv", index=False, encoding="utf-8-sig")
        cont_subtema += 1

    resumo = out_dir / "README.md"
    resumo.write_text(
        "\n".join(
            [
                "# Repositório de Tabelas 2025",
                "",
                f"- Fonte: `{zip_path.name}`",
                f"- Registros totais: {len(df):,}".replace(",", "."),
                f"- Arquivos por temática: {cont_tematica}",
                f"- Arquivos por temática/subtema: {cont_subtema}",
                "",
                "## Estrutura",
                "- `_fonte/`: cópia dos arquivos originais extraídos e CSV consolidado.",
                "- `tabelas_por_tematica/`: um CSV para cada temática.",
                "- `tabelas_por_tematica_subtema/`: um CSV para cada combinação temática+subtema.",
            ]
        ),
        encoding="utf-8",
    )

    print(f"Repositório criado em: {out_dir}")
    print(f"Registros: {len(df)}")
    print(f"Temáticas: {cont_tematica}")
    print(f"Temática+Subtema: {cont_subtema}")


if __name__ == "__main__":
    main()