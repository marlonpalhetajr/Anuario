"""
Script para converter planilhas Excel das Tabelas 2025 em arquivos JSON
para uso no mapa interativo do Anuário Estatístico do Pará 2024
"""

import os
import json
import pandas as pd
from pathlib import Path
import re

# Diretórios
BASE_DIR = Path(__file__).parent.parent
TABELAS_DIR = BASE_DIR / "Tabelas 2025"
OUTPUT_DIR = BASE_DIR / "data" / "indicadores" / "2025"

# Mapeamento de categorias
CATEGORIAS = {
    "1. Demografia": "demografia",
    "2. Economia": "economia", 
    "3. Infraestrutura": "infraestrutura",
    "4. Meio Ambiente": "meio-ambiente",
    "5. Social": "social"
}

def limpar_nome_municipio(nome):
    """Remove espaços e caracteres especiais do nome do município"""
    if pd.isna(nome):
        return None
    nome = str(nome).strip()
    # Remove números de código se existirem (ex: "1500107 Abaetetuba" -> "Abaetetuba")
    nome = re.sub(r'^\d+\s+', '', nome)
    return nome

def extrair_ano_do_titulo(titulo):
    """Extrai o ano mais recente do título da tabela"""
    anos = re.findall(r'\d{4}', titulo)
    if anos:
        return int(anos[-1])  # Retorna o último ano mencionado
    return 2025

def processar_planilha(caminho_excel, categoria):
    """
    Processa uma planilha Excel e extrai dados por município
    Retorna um dicionário {município: valor} para o ano mais recente
    """
    try:
        # Lê o Excel (primeira aba)
        df = pd.read_excel(caminho_excel, sheet_name=0)
        
        # Procura pela coluna de municípios (geralmente primeira coluna ou coluna com "Município")
        coluna_municipio = None
        for col in df.columns:
            if 'município' in str(col).lower() or 'municí' in str(col).lower():
                coluna_municipio = col
                break
        
        # Se não encontrou, assume primeira coluna
        if coluna_municipio is None:
            coluna_municipio = df.columns[0]
        
        # Procura pela coluna do ano mais recente (última coluna numérica)
        colunas_anos = [col for col in df.columns if re.search(r'\d{4}', str(col))]
        if colunas_anos:
            coluna_valor = colunas_anos[-1]
        else:
            # Se não tem ano no nome, pega a última coluna numérica
            colunas_numericas = df.select_dtypes(include=['float64', 'int64']).columns
            if len(colunas_numericas) > 0:
                coluna_valor = colunas_numericas[-1]
            else:
                # Pega última coluna que não seja a de município
                coluna_valor = df.columns[-1]
        
        # Extrai dados
        dados = {}
        for _, row in df.iterrows():
            municipio = limpar_nome_municipio(row[coluna_municipio])
            if municipio and municipio not in ['Pará', 'Total', 'TOTAL', 'Estado']:
                try:
                    valor = row[coluna_valor]
                    if pd.notna(valor):
                        # Tenta converter para número
                        if isinstance(valor, str):
                            valor = valor.replace('.', '').replace(',', '.')
                        dados[municipio] = float(valor)
                except (ValueError, TypeError):
                    continue
        
        return dados
    
    except Exception as e:
        print(f"Erro ao processar {caminho_excel}: {e}")
        return {}

def gerar_catalogo():
    """Gera o arquivo catalogo_2025.json com todos os indicadores disponíveis"""
    catalogo = {cat: [] for cat in CATEGORIAS.values()}
    
    for pasta_categoria, slug_categoria in CATEGORIAS.items():
        pasta_path = TABELAS_DIR / pasta_categoria
        if not pasta_path.exists():
            continue
        
        # Processa apenas arquivos que começam com "Tab"
        arquivos = sorted([f for f in pasta_path.glob("Tab *.xlsx") if not f.name.startswith('~$')])
        
        for arquivo in arquivos:
            nome_arquivo = arquivo.stem  # Nome sem extensão
            
            # Extrai número da tabela (ex: "Tab 1.1" -> "1.1")
            match = re.match(r'Tab\s+([\d\.]+)\s+(.+)', nome_arquivo)
            if match:
                num_tab = match.group(1)
                titulo = match.group(2)
            else:
                titulo = nome_arquivo.replace("Tab ", "")
                num_tab = ""
            
            # Extrai ano do título
            ano = extrair_ano_do_titulo(titulo)
            
            # Gera slug
            slug = f"{slug_categoria}-{num_tab.replace('.', '-')}"
            
            # Determina unidade baseada no título
            unit = ""
            if any(word in titulo.lower() for word in ['população', 'habitantes']):
                unit = "hab"
            elif any(word in titulo.lower() for word in ['taxa', 'proporção', 'razão', 'índice']):
                unit = ""
            elif 'pib' in titulo.lower():
                unit = "R$"
            elif 'área' in titulo.lower():
                unit = "km²"
            elif 'densidade' in titulo.lower():
                unit = "hab/km²"
            
            catalogo[slug_categoria].append({
                "slug": slug,
                "label": titulo,
                "unit": unit,
                "year": ano,
                "path": f"data/indicadores/2025/{arquivo.name.replace('.xlsx', '.json')}"
            })
    
    return catalogo

def main():
    """Função principal"""
    print("=" * 80)
    print("CONVERSOR EXCEL → JSON PARA MAPA INTERATIVO")
    print("=" * 80)
    
    # Cria diretório de saída se não existir
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Contador de arquivos processados
    total_processados = 0
    total_erros = 0
    
    # Processa cada categoria
    for pasta_categoria, slug_categoria in CATEGORIAS.items():
        pasta_path = TABELAS_DIR / pasta_categoria
        if not pasta_path.exists():
            print(f"\n⚠️  Pasta não encontrada: {pasta_categoria}")
            continue
        
        print(f"\n📁 Processando categoria: {pasta_categoria}")
        print("-" * 80)
        
        # Processa apenas arquivos que começam com "Tab"
        arquivos = sorted([f for f in pasta_path.glob("Tab *.xlsx") if not f.name.startswith('~$')])
        
        for arquivo in arquivos:
            try:
                print(f"   Processando: {arquivo.name}...", end=" ")
                
                # Processa planilha
                dados = processar_planilha(arquivo, slug_categoria)
                
                if dados:
                    # Gera nome do arquivo JSON
                    json_filename = arquivo.name.replace('.xlsx', '.json')
                    json_path = OUTPUT_DIR / json_filename
                    
                    # Estrutura do JSON
                    output = {
                        "metadata": {
                            "source": arquivo.name,
                            "categoria": slug_categoria,
                            "municipios": len(dados)
                        },
                        "data": dados
                    }
                    
                    # Salva JSON
                    with open(json_path, 'w', encoding='utf-8') as f:
                        json.dump(output, f, ensure_ascii=False, indent=2)
                    
                    print(f"✅ {len(dados)} municípios")
                    total_processados += 1
                else:
                    print("⚠️  Nenhum dado extraído")
                    total_erros += 1
                    
            except Exception as e:
                print(f"❌ ERRO: {e}")
                total_erros += 1
    
    # Gera catálogo
    print("\n" + "=" * 80)
    print("📋 Gerando catálogo de indicadores...")
    catalogo = gerar_catalogo()
    
    catalogo_path = BASE_DIR / "data" / "catalogo_2025.json"
    with open(catalogo_path, 'w', encoding='utf-8') as f:
        json.dump(catalogo, f, ensure_ascii=False, indent=2)
    
    # Contagem total de indicadores
    total_indicadores = sum(len(indicadores) for indicadores in catalogo.values())
    print(f"✅ Catálogo gerado com {total_indicadores} indicadores")
    
    # Resumo final
    print("\n" + "=" * 80)
    print("RESUMO DA CONVERSÃO")
    print("=" * 80)
    print(f"✅ Arquivos processados com sucesso: {total_processados}")
    print(f"❌ Arquivos com erro: {total_erros}")
    print(f"📊 Total de indicadores no catálogo: {total_indicadores}")
    print("\n🎯 Arquivos JSON salvos em: {OUTPUT_DIR}")
    print(f"📋 Catálogo salvo em: {catalogo_path}")
    print("=" * 80)

if __name__ == "__main__":
    main()
