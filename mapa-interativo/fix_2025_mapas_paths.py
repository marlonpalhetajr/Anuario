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
updated = 0

for categoria, folder in CATEGORY_FOLDERS.items():
    cat_data = mapas.get(categoria)
    if not cat_data or "2025" not in cat_data:
        continue

    for item in cat_data["2025"]:
        if "arquivo" in item:
            arquivo = item["arquivo"]
            new_caminho = f"../mapas/{folder}/{arquivo}"
            new_icon = f"../icons/{folder}/{arquivo}"
            if item.get("caminho") != new_caminho:
                item["caminho"] = new_caminho
                updated += 1
            if item.get("icon") != new_icon:
                item["icon"] = new_icon
                updated += 1

with open("config-mapas.json", "w", encoding="utf-8") as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

print(f"Atualizacoes aplicadas: {updated}")
