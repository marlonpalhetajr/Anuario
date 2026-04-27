#!/usr/bin/env pwsh
# Repositório Anuário 2025 - Inicializador para PowerShell (Windows)

Clear-Host

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║ 📊 Repositório Anuário 2025 - Servidor                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se Python está instalado
$pythonExists = $null -ne (Get-Command python -ErrorAction SilentlyContinue)

if (-not $pythonExists) {
    Write-Host "❌ Python não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Você pode:" -ForegroundColor Yellow
    Write-Host "   1. Instalar Python em: https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "   2. Ou abrir diretamente: index.html no seu navegador" -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione ENTER para fechar"
    exit 1
}

Write-Host "✅ Python encontrado" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Iniciando servidor local..." -ForegroundColor Green
Write-Host ""

& python server.py

Read-Host "Pressione ENTER para fechar"
