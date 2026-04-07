#!/usr/bin/env powershell
# Script para iniciar o Watch Excel→JSON automaticamente

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Conversor Excel → JSON com Watch         ║" -ForegroundColor Cyan
Write-Host "║  Monitoramento Automático de Pastas       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verifica se está na pasta correta
if (-not (Test-Path "tools\excel_to_json_watch.py")) {
    Write-Host "❌ Erro: Arquivo 'tools\excel_to_json_watch.py' não encontrado" -ForegroundColor Red
    Write-Host "   Execute este script da pasta raiz (anuario2024/)" -ForegroundColor Yellow
    exit 1
}

# Verifica se Python está instalado
$pythonExe = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonExe) {
    Write-Host "❌ Erro: Python não está instalado ou não está no PATH" -ForegroundColor Red
    Write-Host "   Instale Python 3.7+ em https://python.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Python encontrado: " -ForegroundColor Green -NoNewline
Write-Host ($pythonExe.Source) -ForegroundColor White

# Verifica dependências
Write-Host "`n📦 Verificando dependências..." -ForegroundColor Yellow

$dependenciasOK = $true

foreach ($pacote in @("pandas", "openpyxl", "watchdog")) {
    $resultado = python -c "import $pacote" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ $pacote - OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $pacote - FALTA" -ForegroundColor Red
        $dependenciasOK = $false
    }
}

if (-not $dependenciasOK) {
    Write-Host "`n📥 Instalando dependências..." -ForegroundColor Yellow
    python -m pip install -r tools/requirements.txt -q
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n✅ Todas as dependências estão instaladas!" -ForegroundColor Green
}

# Verifica se pasta tabelas-excel existe
Write-Host "`n📁 Verificando pastas..." -ForegroundColor Yellow
if (-not (Test-Path "tabelas-excel")) {
    Write-Host "   ⚠️  Pasta 'tabelas-excel' não existe - criando..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "tabelas-excel" -Force | Out-Null
    Write-Host "   ✅ Pasta criada!" -ForegroundColor Green
} else {
    Write-Host "   ✅ Pasta tabelas-excel - OK" -ForegroundColor Green
}

if (-not (Test-Path "data")) {
    Write-Host "   ⚠️  Pasta 'data' não existe - criando..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "data" -Force | Out-Null
    Write-Host "   ✅ Pasta criada!" -ForegroundColor Green
} else {
    Write-Host "   ✅ Pasta data - OK" -ForegroundColor Green
}

# Inicia o watch
Write-Host "`n🚀 Iniciando Watch Excel→JSON..." -ForegroundColor Cyan
Write-Host "   Coloque seus arquivos em: tabelas-excel/" -ForegroundColor Gray
Write-Host "   JSONs serão salvos em: data/" -ForegroundColor Gray
Write-Host "   Pressione Ctrl+C para parar" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White

python tools/excel_to_json_watch.py --watch

Write-Host "`n🔴 Watch parado" -ForegroundColor Yellow
