import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "Tabelas 2025"
OUT_DIR = ROOT / "data" / "indicadores" / "2025"
CATALOG = ROOT / "data" / "catalogo_2025.json"

MUNICIPALITY_CANDIDATES = [
    "Município", "Municipio", "MUNICÍPIO", "MUNICIPIO",
    "Municípios", "Município/UF", "Município (IBGE)",
    "Município - IBGE", "Nome do Município", "Municipality"
]
CODE_CANDIDATES = [
    "Código IBGE", "Cod IBGE", "Código do Município", "Cod Município", "CD_MUN"
]

IGNORED_PREFIXES = ("~$",)  # arquivos temporários do Excel
IGNORED_FILES = {"Thumbs.db"}

YEAR_RE = re.compile(r"(20\d{2})")


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[\s_/]+", "-", text)
    text = re.sub(r"[^a-z0-9\-]", "", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def flatten_columns(df: pd.DataFrame) -> pd.DataFrame:
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [" ".join([str(x) for x in tup if str(x) != "nan"]).strip() for tup in df.columns]
    else:
        df.columns = [str(c).strip() for c in df.columns]
    return df


def choose_municipality_column(df: pd.DataFrame) -> Tuple[str, str]:
    for c in MUNICIPALITY_CANDIDATES:
        if c in df.columns:
            return c, "name"
    for c in CODE_CANDIDATES:
        if c in df.columns:
            return c, "code"
    # fallback: first object/string column
    obj_cols = [c for c in df.columns if df[c].dtype == object]
    if obj_cols:
        return obj_cols[0], "name"
    raise KeyError("Nenhuma coluna de município encontrada")


def pick_latest_year_column(df: pd.DataFrame) -> Tuple[str, int]:
    candidates: List[Tuple[int, str]] = []
    for col in df.columns:
        m = YEAR_RE.search(col)
        if m:
            year = int(m.group(1))
            if pd.api.types.is_numeric_dtype(df[col]):
                candidates.append((year, col))
    if candidates:
        year, col = max(candidates, key=lambda x: x[0])
        return col, year
    # fallback: pick the first numeric column
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            return col, None
    raise KeyError("Nenhuma coluna numérica encontrada")


def infer_unit(colname: str) -> str:
    c = colname.lower()
    if "r$" in c or "preço" in c or "valor" in c:
        return "R$"
    if "percent" in c or "%" in c:
        return "%"
    if "idh" in c:
        return ""
    if "hab/km" in c:
        return "hab/km²"
    if "hab" in c or "popula" in c:
        return "hab"
    if "km2" in c or "km²" in c:
        return "km²"
    return ""


def clean_label(filename: str, colname: str, year) -> str:
    base = Path(filename).stem
    base = re.sub(r"^tab\s*\d+[\w.\s-]*\s*", "", base, flags=re.IGNORECASE)
    base = base.replace("_", " ").strip()
    label = base
    if year:
        label = f"{label} ({year})"
    else:
        label = f"{label}"
    if colname not in base:
        label = f"{label} - {colname}"
    return re.sub(r"\s+", " ", label).strip()


def process_file(xlsx_path: Path, category_key: str) -> List[Dict]:
    indicators = []
    try:
        df = pd.read_excel(xlsx_path)
    except Exception:
        # tenta primeira aba forçada
        df = pd.read_excel(xlsx_path, sheet_name=0)
    df = flatten_columns(df)

    try:
        mun_col, mun_type = choose_municipality_column(df)
    except Exception:
        return indicators

    # drop linhas sem municipio
    df = df[df[mun_col].notna()].copy()
    df[mun_col] = df[mun_col].astype(str).str.strip()

    try:
        val_col, year = pick_latest_year_column(df)
    except Exception:
        return indicators

    unit = infer_unit(val_col)
    label = clean_label(xlsx_path.name, val_col, year)
    slug = slugify(f"{category_key}-{xlsx_path.stem}-{val_col}-{year or 'latest'}")

    # monta mapping municipio -> valor (float)
    mapping = {}
    for _, row in df.iterrows():
        mun = str(row[mun_col]).strip()
        val = row[val_col]
        if pd.notna(val):
            try:
                val = float(val)
            except Exception:
                continue
            mapping[mun] = val

    if not mapping:
        return indicators

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{slug}.json"
    payload = {
        "category": category_key,
        "label": label,
        "unit": unit,
        "year": year,
        "source_file": str(xlsx_path.relative_to(ROOT)),
        "data": mapping,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)

    indicators.append({
        "slug": slug,
        "label": label,
        "unit": unit,
        "year": year,
        "path": str(out_path.relative_to(ROOT)).replace("\\", "/"),
    })
    return indicators


def main():
    if not SRC_DIR.exists():
        raise FileNotFoundError(f"Pasta não encontrada: {SRC_DIR}")

    categories = [
        ("demografia", "1. Demografia"),
        ("economia", "2. Economia"),
        ("infraestrutura", "3. Infraestrutura"),
        ("meio-ambiente", "4. Meio Ambiente"),
        ("social", "5. Social"),
    ]

    catalog: Dict[str, List[Dict]] = {k: [] for k, _ in categories}

    for key, folder_name in categories:
        folder = SRC_DIR / folder_name
        if not folder.exists():
            continue
        # arquivos diretos
        for path in folder.glob("*.xlsx"):
            if path.name.startswith(IGNORED_PREFIXES) or path.name in IGNORED_FILES:
                continue
            catalog[key].extend(process_file(path, key))
        # subpastas
        for sub in folder.rglob("*.xlsx"):
            if sub.parent == folder:
                continue  # já tratado acima
            if sub.name.startswith(IGNORED_PREFIXES) or sub.name in IGNORED_FILES:
                continue
            catalog[key].extend(process_file(sub, key))

    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    print(f"Catálogo gerado: {CATALOG}")


if __name__ == "__main__":
    main()
