#!/usr/bin/env python3
import os
from pathlib import Path

base = Path('c:\\Users\\marlon.junior\\OneDrive - Fapespa\\anuario2024')

# Comparar tamanhos
for ano in ['2024', '2023', '2022', '2021', '2020', '2019', '2018']:
    icon_path = base / 'icons-mapa-interativo' / f'icons_{ano}' / 'territorio'
    mapa_path = base / 'mapas-modo-interativo' / f'mapas{ano}' / 'territorio'
    
    if icon_path.exists():
        icon_size = sum(f.stat().st_size for f in icon_path.glob('*.png')) / (1024 * 1024)
        mapa_size = sum(f.stat().st_size for f in mapa_path.glob('*.png')) / (1024 * 1024)
        
        print(f"\n{ano}:")
        print(f"  Ícones: {icon_size:.2f} MB ({len(list(icon_path.glob('*.png')))} arquivos)")
        print(f"  Mapas:  {mapa_size:.2f} MB ({len(list(mapa_path.glob('*.png')))} arquivos)")
        print(f"  Diferença: {mapa_size / icon_size:.1f}x mais pesado")
