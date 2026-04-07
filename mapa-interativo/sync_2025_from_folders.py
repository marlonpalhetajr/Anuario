import json
import os
import unicodedata

ROOT = os.path.dirname(__file__)
MAPS_ROOT = os.path.abspath(os.path.join(ROOT, "..", "mapas"))
ICONS_ROOT = os.path.abspath(os.path.join(ROOT, "..", "icons"))

CATEGORY_FOLDERS = {
    "Demografia": "demografia",
    "Economia": "economia",
    "Infraestrutura": "infraestrutura",
    "Meio Ambiente": "meio_ambiente",
    "Social": "social",
    "Território": "territorio",
}

VALID_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def list_files(folder):
    if not os.path.isdir(folder):
        return []
    files = []
    for name in os.listdir(folder):
        path = os.path.join(folder, name)
        if os.path.isfile(path) and os.path.splitext(name)[1].lower() in VALID_EXTS:
            files.append(name)
    return sorted(files)


def index_by_stem(files):
    indexed = {}
    for name in files:
        stem = os.path.splitext(name)[0]
        indexed[stem] = name
    return indexed


def filename_to_title(filename):
    base = os.path.splitext(filename)[0]
    title = base.replace("_", " ").replace("-", " ")
    return " ".join(title.split())


def normalize_key(filename):
    base = os.path.splitext(filename)[0].lower()
    base = "".join(
        ch for ch in unicodedata.normalize("NFD", base)
        if unicodedata.category(ch) != "Mn"
    )
    base = "".join(ch for ch in base if ch.isalnum())
    base = "".join(ch for ch in base if not ch.isdigit())
    return base


with open("config-mapas.json", "r", encoding="utf-8") as f:
    config = json.load(f)

mapas = config.get("mapas", {})

summary = []
missing_icons_total = 0
missing_maps_total = 0

for categoria, folder in CATEGORY_FOLDERS.items():
    maps_dir = os.path.join(MAPS_ROOT, folder)
    icons_dir = os.path.join(ICONS_ROOT, folder)

    map_files = list_files(maps_dir)
    icon_files = list_files(icons_dir)
    icons_by_stem = index_by_stem(icon_files)
    icons_by_norm = {normalize_key(name): name for name in icon_files}

    entries = []
    missing_icons = 0

    for fname in map_files:
        stem = os.path.splitext(fname)[0]
        icon_name = icons_by_stem.get(stem)
        if not icon_name and categoria == "Território":
            icon_name = icons_by_norm.get(normalize_key(fname))
        if not icon_name:
            missing_icons += 1
            icon_name = fname
        entries.append({
            "titulo": filename_to_title(fname),
            "arquivo": fname,
            "caminho": f"../mapas/{folder}/{fname}",
            "icon": f"../icons/{folder}/{icon_name}",
        })

    map_stems = {os.path.splitext(name)[0] for name in map_files}
    icon_stems = {os.path.splitext(name)[0] for name in icon_files}
    missing_maps = len([stem for stem in icon_stems if stem not in map_stems])

    mapas.setdefault(categoria, {})["2025"] = entries
    summary.append((categoria, len(entries), missing_icons, missing_maps))
    missing_icons_total += missing_icons
    missing_maps_total += missing_maps

config["mapas"] = mapas

with open("config-mapas.json", "w", encoding="utf-8") as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

print("2025 sincronizado a partir das pastas:")
for categoria, total, miss_icons, miss_maps in summary:
    print(f"- {categoria}: {total} mapas | icons faltando: {miss_icons} | maps faltando: {miss_maps}")

print(f"Total icons faltando: {missing_icons_total}")
print(f"Total maps faltando: {missing_maps_total}")
