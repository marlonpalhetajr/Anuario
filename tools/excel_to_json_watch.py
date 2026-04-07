#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Conversor Excel → JSON com Watch Automático
Monitora pasta tabelas-excel/ e converte em tempo real
"""

import pandas as pd
import json
import os
from pathlib import Path
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import sys

class ConversorExcelJSON:
    def __init__(self, pasta_excel='tabelas-excel', pasta_saida='data'):
        self.pasta_excel = Path(pasta_excel).absolute()
        self.pasta_saida = Path(pasta_saida).absolute()
        self.criar_pasta_saida()
        self.log_file = Path('tools/conversao.log')
    
    def criar_pasta_saida(self):
        """Cria pasta data/ se não existir"""
        self.pasta_saida.mkdir(exist_ok=True)
        print(f"📁 Pasta saída: {self.pasta_saida}")
    
    def log(self, mensagem):
        """Registra log com timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        msg_completa = f"[{timestamp}] {mensagem}"
        print(msg_completa)
        
        # Salvar em arquivo de log
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(msg_completa + '\n')
    
    def processar_excel(self, arquivo_excel):
        """
        Processa um arquivo Excel individual
        Excel deve ter colunas: municipio, valor (e opcionalmente: ano, regiao)
        """
        try:
            arquivo_path = Path(arquivo_excel)
            
            # Ignorar arquivos temporários do Excel
            if arquivo_path.name.startswith('~$'):
                return False
            
            self.log(f"📖 Processando: {arquivo_path.name}")
            
            # Ler Excel
            df = pd.read_excel(arquivo_excel, engine='openpyxl')
            
            # Normalizar nomes de colunas
            df.columns = [col.strip().lower() for col in df.columns]
            
            # Validar colunas essenciais
            if 'municipio' not in df.columns:
                self.log(f"❌ Erro: Excel deve ter coluna 'municipio'")
                return False
            
            if 'valor' not in df.columns:
                self.log(f"❌ Erro: Excel deve ter coluna 'valor'")
                return False
            
            # Limpeza dos dados
            df['municipio'] = df['municipio'].str.strip()
            df['valor'] = pd.to_numeric(df['valor'], errors='coerce')
            
            # Remover valores nulos
            df_limpo = df.dropna(subset=['valor'])
            
            if len(df_limpo) == 0:
                self.log(f"❌ Erro: Nenhum dado válido encontrado")
                return False
            
            # Gerar nome do arquivo de saída
            nome_arquivo = arquivo_path.stem  # sem extensão
            arquivo_json = self.pasta_saida / f"{nome_arquivo}.json"
            
            # Formato: Dicionário simples {município: valor}
            dados = {}
            for idx, row in df_limpo.iterrows():
                municipio = row['municipio']
                valor = float(row['valor'])
                dados[municipio] = valor
            
            # Salvar JSON
            with open(arquivo_json, 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            
            qtd_municipios = len(dados)
            self.log(f"✅ Convertido: {nome_arquivo}.json ({qtd_municipios} municípios)")
            return True
            
        except Exception as e:
            self.log(f"❌ Erro ao processar {arquivo_excel}: {str(e)}")
            return False
    
    def processar_todos(self):
        """Processa todos os .xlsx da pasta"""
        self.log(f"\n{'='*60}")
        self.log(f"🚀 Conversão Manual: {self.pasta_excel}/ → {self.pasta_saida}/")
        self.log(f"{'='*60}")
        
        # Listar todos os xlsx
        arquivos = list(self.pasta_excel.glob('*.xlsx'))
        
        if not arquivos:
            self.log(f"⚠️  Nenhum arquivo .xlsx encontrado")
            return 0
        
        sucessos = 0
        for arquivo in sorted(arquivos):
            if self.processar_excel(str(arquivo)):
                sucessos += 1
        
        self.log(f"\n📊 Resumo: {sucessos}/{len(arquivos)} convertidos")
        self.log(f"{'='*60}\n")
        
        return sucessos


class MonitorExcelHandler(FileSystemEventHandler):
    """Handler que detecta mudanças em arquivos Excel"""
    
    def __init__(self, conversor):
        self.conversor = conversor
        self.processando = False
    
    def on_modified(self, event):
        """Chamado quando arquivo é modificado"""
        if event.is_directory:
            return
        
        if not event.src_path.endswith('.xlsx'):
            return
        
        # Evitar processar múltiplas vezes rápido
        if self.processando:
            return
        
        self.processando = True
        time.sleep(1)  # Aguarda arquivo terminar de salvar
        
        try:
            self.conversor.processar_excel(event.src_path)
        finally:
            self.processando = False
    
    def on_created(self, event):
        """Chamado quando novo arquivo é criado"""
        self.on_modified(event)


class WatcherExcel:
    """Monitora pasta Excel em tempo real"""
    
    def __init__(self, pasta_excel='tabelas-excel'):
        self.pasta_excel = Path(pasta_excel).absolute()
        self.conversor = ConversorExcelJSON(pasta_excel)
        self.observer = Observer()
    
    def iniciar(self):
        """Inicia monitoramento"""
        self.conversor.log(f"\n{'='*60}")
        self.conversor.log(f"👀 WATCH INICIADO")
        self.conversor.log(f"{'='*60}")
        self.conversor.log(f"📁 Monitorando: {self.pasta_excel}")
        self.conversor.log(f"💾 Salvando em: {self.conversor.pasta_saida}")
        self.conversor.log(f"📋 Log: {self.conversor.log_file}")
        self.conversor.log(f"\n🟢 Aguardando mudanças... (Ctrl+C para parar)")
        self.conversor.log(f"{'='*60}\n")
        
        # Processa Excel já existentes
        self.conversor.processar_todos()
        
        # Configura observer
        handler = MonitorExcelHandler(self.conversor)
        self.observer.schedule(handler, str(self.pasta_excel), recursive=False)
        
        try:
            self.observer.start()
            
            # Mantém rodando
            while True:
                time.sleep(1)
        
        except KeyboardInterrupt:
            self.parar()
    
    def parar(self):
        """Para monitoramento"""
        self.observer.stop()
        self.observer.join()
        self.conversor.log(f"\n🔴 Watch parado")


def modo_manual(pasta_excel='tabelas-excel'):
    """Executa uma única conversão (sem watch)"""
    conversor = ConversorExcelJSON(pasta_excel)
    conversor.processar_todos()


def modo_watch(pasta_excel='tabelas-excel'):
    """Inicia watch automático"""
    watcher = WatcherExcel(pasta_excel)
    watcher.iniciar()


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Conversor Excel → JSON com Watch Automático',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos de uso:
  python excel_to_json_watch.py --watch              # Inicia watch automático
  python excel_to_json_watch.py --once               # Converte uma vez
  python excel_to_json_watch.py --watch --pasta tabelas-excel
        """
    )
    
    parser.add_argument(
        '--watch', 
        action='store_true', 
        help='Inicia modo watch automático (padrão)'
    )
    parser.add_argument(
        '--once', 
        action='store_true', 
        help='Converte uma única vez e sai'
    )
    parser.add_argument(
        '--pasta',
        default='tabelas-excel',
        help='Pasta com arquivos Excel (padrão: tabelas-excel)'
    )
    
    args = parser.parse_args()
    
    try:
        if args.once:
            modo_manual(args.pasta)
        else:
            # Padrão é watch
            modo_watch(args.pasta)
    except KeyboardInterrupt:
        print("\n\n⏹️  Interrompido pelo usuário")
        sys.exit(0)
