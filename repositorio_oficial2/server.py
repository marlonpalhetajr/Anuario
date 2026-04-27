#!/usr/bin/env python3
"""
Servidor local para o Repositório Anuário 2025
Acesse em: http://localhost:8000
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        # Adicionar headers para evitar cache
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        return super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"""
╔{'=' * 60}╗
║ 📊 Repositório Anuário 2025 - Servidor Local           ║
╠{'=' * 60}╣
║ URL: http://localhost:{PORT}{' ' * 42}║
║ Diretório: {str(DIRECTORY):<48} ║
║                                                        ║
║ Pressione CTRL+C para parar o servidor                ║
╚{'=' * 60}╝
            """)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✋ Servidor parado.")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Port in use
            print(f"\n❌ Porta {PORT} já está em uso!")
            print("   Tente fechar outras aplicações ou use outra porta.")
        else:
            print(f"\n❌ Erro: {e}")
        sys.exit(1)
