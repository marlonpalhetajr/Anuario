# Script simples para remover emojis
import re

with open('processar_dados_pendentes.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Remover emojis (caracteres acima de U+00FF)
content_clean = re.sub(r'[^\x00-\x7F]+', '', content)

with open('processar_dados_pendentes.py', 'w', encoding='utf-8') as f:
    f.write(content_clean)

print("Emojis removidos com sucesso!")
