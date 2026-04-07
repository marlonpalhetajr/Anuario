#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de teste para o conversor Excel → JSON
Cria um arquivo Excel de exemplo e testa a conversão
"""

import pandas as pd
import json
from pathlib import Path

def criar_excel_exemplo():
    """Cria um arquivo Excel de exemplo para teste"""
    
    # Cria pasta se não existir
    Path('tabelas-excel').mkdir(exist_ok=True)
    
    # Dados de exemplo (população 2025)
    dados = {
        'municipio': [
            'Belém', 'Ananindeua', 'Marabá', 'Parauapebas', 
            'Altamira', 'Barcarena', 'Santarém', 'Maraba',
            'Redenção', 'Itaituba', 'Capanema', 'Abel Figueiredo',
            'Tucumã', 'Araguaina', 'Xinguara', 'Jacareacanga'
        ],
        'valor': [
            1465575, 509227, 281756, 228621, 138749, 139076,
            315226, 281756, 187543, 137462, 95321, 6275,
            12543, 45123, 32156, 43211
        ]
    }
    
    df = pd.DataFrame(dados)
    arquivo = 'tabelas-excel/exemplo_dados_teste.xlsx'
    df.to_excel(arquivo, index=False)
    
    print(f"✅ Arquivo de exemplo criado: {arquivo}")
    print(f"   {len(df)} municípios")
    print(f"\nConteúdo:")
    print(df.to_string())
    
    return arquivo

def testar_conversao():
    """Testa conversão automática"""
    
    import sys
    sys.path.insert(0, 'tools')
    from excel_to_json_watch import ConversorExcelJSON
    
    arquivo = 'tabelas-excel/exemplo_dados_teste.xlsx'
    
    if not Path(arquivo).exists():
        print(f"❌ Arquivo de teste não encontrado: {arquivo}")
        return False
    
    conversor = ConversorExcelJSON()
    
    print(f"\n{'='*60}")
    print(f"🧪 TESTANDO CONVERSÃO")
    print(f"{'='*60}\n")
    
    if conversor.processar_excel(arquivo):
        # Verifica resultado
        arquivo_json = Path('data/exemplo_dados_teste.json')
        if arquivo_json.exists():
            with open(arquivo_json) as f:
                dados = json.load(f)
            
            print(f"\n✅ TESTE PASSOU!")
            print(f"   JSON gerado com {len(dados)} registros:")
            
            for municipio, valor in list(dados.items())[:5]:
                print(f"   - {municipio}: {valor:,.0f}")
            print(f"   ... ({len(dados)} no total)")
            
            return True
    
    print(f"\n❌ TESTE FALHOU!")
    return False

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🧪 TESTE DO CONVERSOR EXCEL → JSON")
    print("="*60 + "\n")
    
    try:
        # Criar arquivo de exemplo
        criar_excel_exemplo()
        
        # Testar conversão
        testar_conversao()
        
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
