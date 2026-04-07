import pandas as pd
import json
import requests
from pathlib import Path

# Caminhos
BASE_DIR = Path(__file__).parent.parent
EXCEL_FILE = BASE_DIR / "Tabelas 2025" / "1. Demografia" / "Tab 1.1 População Total - Estimativas Populacionais e Censo Demográfico - 2021 a 2025.xlsx"
OUTPUT_JSON = BASE_DIR / "data" / "populacao_2025.json"
GEOJSON_OUTPUT = BASE_DIR / "data" / "para_municipios.geojson"

print("🔄 Processando dados de população...")

# Ler Excel
try:
    df = pd.read_excel(EXCEL_FILE)
    print(f"✓ Arquivo Excel lido: {len(df)} linhas")
    print(f"Colunas: {df.columns.tolist()}")
    print("\nPrimeiras linhas:")
    print(df.head())
except Exception as e:
    print(f"❌ Erro ao ler Excel: {e}")
    exit(1)

# Identificar coluna de município e população 2025
# Ajustar conforme estrutura real do Excel
municipio_col = None
pop_2025_col = None

for col in df.columns:
    col_lower = str(col).lower()
    if 'município' in col_lower or 'municipio' in col_lower:
        municipio_col = col
    if '2025' in str(col):
        pop_2025_col = col

print(f"\n📍 Coluna município: {municipio_col}")
print(f"📊 Coluna população 2025: {pop_2025_col}")

if not municipio_col or not pop_2025_col:
    print("❌ Não foi possível identificar as colunas automaticamente")
    print("Por favor, ajuste o script manualmente")
    exit(1)

# Extrair dados
dados = {}
for idx, row in df.iterrows():
    municipio = str(row[municipio_col]).strip()
    try:
        populacao = int(row[pop_2025_col])
        dados[municipio] = populacao
        print(f"  {municipio}: {populacao:,}")
    except (ValueError, TypeError):
        continue

print(f"\n✓ {len(dados)} municípios processados")

# Salvar JSON
with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(dados, f, ensure_ascii=False, indent=2)

print(f"✓ Dados salvos em: {OUTPUT_JSON}")

# Buscar GeoJSON do IBGE
print("\n🌐 Buscando GeoJSON dos municípios do Pará...")
try:
    # API do IBGE - malha municipal do Pará (código 15)
    url = "https://servicodados.ibge.gov.br/api/v3/malhas/estados/15?formato=application/vnd.geo+json&qualidade=minima"
    
    print(f"Fazendo requisição para: {url}")
    response = requests.get(url, timeout=30)
    
    if response.status_code == 200:
        geojson_data = response.json()
        
        # Salvar GeoJSON
        with open(GEOJSON_OUTPUT, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False)
        
        print(f"✓ GeoJSON salvo em: {GEOJSON_OUTPUT}")
        
        # Verificar features
        if 'features' in geojson_data:
            print(f"✓ {len(geojson_data['features'])} features encontradas")
    else:
        print(f"❌ Erro HTTP {response.status_code}")
        
except Exception as e:
    print(f"⚠️ Erro ao buscar GeoJSON: {e}")
    print("Você pode baixar manualmente de:")
    print("https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/")

print("\n✅ Processamento concluído!")
