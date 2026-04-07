import argparse
import json
import os
import re
from pathlib import Path

VALID_EXTS = {".xlsx", ".xls", ".csv", ".htm", ".html"}

# Regiões de integração do Pará
REGIOES_INTEGRACAO = {
  "01": "Pará",
  "02": "Araguaia",
  "03": "Baixo Amazonas",
  "04": "Carajás",
  "05": "Guajará",
  "06": "Guamá",
  "07": "Lago de Tucuruí",
  "08": "Marajó",
  "09": "Rio Caeté",
  "10": "Rio Capim",
  "11": "Tapajós",
  "12": "Tocantins",
  "13": "Xingu"
}

def infer_axis_theme(path_parts):
  axis_map = {
    "social": "Social",
    "economia": "Economia",
    "demografia": "Demografia",
    "infraestrutura": "Infraestrutura",
    "meio_ambiente": "Meio Ambiente",
    "meioambiente": "Meio Ambiente"
  }

  axis = ""
  theme = ""

  for i, part in enumerate(path_parts):
    key = part.lower().replace("-", "_").strip()
    if key in axis_map and not axis:
      axis = axis_map[key]
      if i + 1 < len(path_parts):
        theme = path_parts[i + 1].replace("_", " ").replace("-", " ").title()
      break

  return axis, theme

def infer_year(name, path_parts):
  year_match = re.search(r"(19|20)\d{2}", name)
  if year_match:
    return year_match.group(0)

  for p in path_parts:
    m = re.fullmatch(r"(19|20)\d{2}", p)
    if m:
      return m.group(0)

  return ""

def infer_region_municipality(filename, path_parts):
  region = ""
  municipality = ""
  
  path_lower = [p.lower() for p in path_parts]
  
  if any("munic" in p for p in path_lower):
    base = Path(filename).stem
    pieces = [p for p in re.split(r"[_\-\s]+", base) if p and not re.match(r"^\d{4}$", p)]
    if pieces and len(pieces) > 0:
      municipality = pieces[-1].replace("_", " ").title()
  
  return region, municipality

def infer_code(filename, axis, theme):
  stem = Path(filename).stem.upper()
  axis_code = (axis[:3] if axis else "GEN").upper().replace(" ", "")
  theme_code = re.sub(r"[^A-Z0-9]", "", theme.upper())[:3] if theme else "TBL"
  token = re.sub(r"[^A-Z0-9]", "", stem)[:5]
  return f"{axis_code}_{theme_code}_{token or '00001'}"

def build_record(file_path, source_root):
  rel = file_path.relative_to(source_root)
  parts = [p for p in rel.parts[:-1]]

  axis, theme = infer_axis_theme(parts)
  year = infer_year(file_path.name, parts)
  region, municipality = infer_region_municipality(file_path.name, parts)
  code = infer_code(file_path.name, axis, theme)

  title = Path(file_path.name).stem.replace("_", " ").replace("-", " ").title()
  arquivo_url = str(rel).replace("\\", "/")

  return {
    "ano": year,
    "eixo": axis,
    "tema": theme,
    "regiao": region,
    "municipio": municipality,
    "codigo": code,
    "titulo": title,
    "indicador": "",
    "arquivo_nome": file_path.name,
    "arquivo_url": arquivo_url
  }

def main():
  parser = argparse.ArgumentParser(description="Gera índice unificado de tabelas para o Repositório 2025")
  parser.add_argument("--source", required=True, help="Pasta raiz com as tabelas de todos os anos")
  parser.add_argument("--output", required=True, help="Arquivo JSON de saída")
  args = parser.parse_args()

  source_root = Path(args.source).resolve()
  output_file = Path(args.output).resolve()

  rows = []
  for root, _, files in os.walk(source_root):
    root_path = Path(root)
    for name in files:
      ext = Path(name).suffix.lower()
      if ext not in VALID_EXTS:
        continue
      file_path = root_path / name
      rows.append(build_record(file_path, source_root))

  rows.sort(key=lambda r: (r["ano"], r["eixo"], r["tema"], r["regiao"], r["municipio"], r["titulo"]))

  output_file.parent.mkdir(parents=True, exist_ok=True)
  with output_file.open("w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

  print(f"Índice gerado com {len(rows)} registros em: {output_file}")

if __name__ == "__main__":
  main()
