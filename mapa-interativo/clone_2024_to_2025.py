import copy
import json

CATEGORY_FOLDERS = {
    "Demografia": "demografia",
    "Economia": "economia",
    "Infraestrutura": "infraestrutura",
    "Meio Ambiente": "meio_ambiente",
    "Social": "social",
    "Território": "territorio",
}

with open("config-mapas.json", "r", encoding="utf-8") as f:
    config = json.load(f)

mapas = config.get("mapas", {})

for categoria, folder in CATEGORY_FOLDERS.items():
    if categoria not in mapas:
        continue
    if "2024" not in mapas[categoria]:
        continue

    base_2024 = mapas[categoria]["2024"]
    cloned = copy.deepcopy(base_2024)

    for item in cloned:
        if "caminho" in item:
            item["caminho"] = item["caminho"].replace(
                f"../mapas-modo-interativo/mapas2024/{folder}/",
                f"../mapas/{folder}/",
            )
        if "icon" in item:
            item["icon"] = item["icon"].replace(
                f"../icons-mapa-interativo/icons_2024/{folder}/",
                f"../icons/{folder}/",
            )

    mapas[categoria]["2025"] = cloned

# Garantir o ano na lista de anos
anos = config.get("anos", [])
if "2025" not in anos:
    anos.append("2025")

with open("config-mapas.json", "w", encoding="utf-8") as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

print("2025 criado a partir de 2024 com caminhos atualizados.")
