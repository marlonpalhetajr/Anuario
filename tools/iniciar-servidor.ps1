# Servidor HTTP simples em PowerShell para o Anuário FAPESPA
# Autor: GitHub Copilot
# Data: Janeiro 2026

$port = 8080
$baseDir = Split-Path $PSScriptRoot -Parent

Write-Host "=" * 80 -ForegroundColor Green
Write-Host "🌐 SERVIDOR HTTP LOCAL - ANUÁRIO ESTATÍSTICO FAPESPA" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Green
Write-Host ""
Write-Host "✅ Servidor será iniciado em: http://localhost:$port" -ForegroundColor Green
Write-Host "📁 Diretório base: $baseDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "📍 URLs disponíveis:" -ForegroundColor Cyan
Write-Host "   • Página principal: http://localhost:$port/index.html" -ForegroundColor White
Write-Host "   • Mapa interativo: http://localhost:$port/mapa-interativo/mapa-interativo.html" -ForegroundColor White
Write-Host "   • Mapas: http://localhost:$port/mapas.html" -ForegroundColor White
Write-Host ""
Write-Host "💡 Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host "🌐 Abrindo navegador..." -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Green
Write-Host ""

# Abrir navegador
Start-Sleep -Seconds 2
Start-Process "http://localhost:$port/mapa-interativo/mapa-interativo.html"

# Iniciar servidor HTTP
Set-Location $baseDir
npx --yes http-server -p $port --cors
