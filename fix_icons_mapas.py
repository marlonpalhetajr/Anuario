import os
import re

# Ler o arquivo mapas.html
with open('mapas.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Corrigir ícones de economia que usam "pip.png"
content = content.replace('src="icons/economia/pip.png"', 'src="icons/economia/Economia_PIB2021.png"')

# Salvar o arquivo
with open('mapas.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Ícones corrigidos com sucesso!")
