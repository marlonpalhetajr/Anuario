import json

with open('config-mapas.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('✅ JSON válido!')
print(f'📊 Total de mapas: {data["total"]}')
print(f'📅 Anos: {data["anos"]}')
print(f'📂 Categorias: {data["categorias"]}')

# Verifica se todos os mapas têm icon e caminho
total_verificado = 0
sem_icon = 0
sem_caminho = 0

for categoria, anos in data['mapas'].items():
    for ano, mapas in anos.items():
        for mapa in mapas:
            total_verificado += 1
            if 'icon' not in mapa:
                sem_icon += 1
            if 'caminho' not in mapa:
                sem_caminho += 1

print(f'\n🔍 Verificação:')
print(f'  Total de mapas verificados: {total_verificado}')
print(f'  Mapas sem campo "icon": {sem_icon}')
print(f'  Mapas sem campo "caminho": {sem_caminho}')

if sem_icon == 0 and sem_caminho == 0:
    print('\n✅ Todos os mapas estão com icon e caminho configurados!')
else:
    print('\n⚠️ Alguns mapas estão sem configuração completa')
