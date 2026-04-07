@echo off
REM Conversor Excel → JSON com Watch Automático
REM Script para Windows (CMD)

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║  Conversor Excel → JSON com Watch         ║
echo ║  Monitoramento Automático de Pastas       ║
echo ╚════════════════════════════════════════════╝
echo.

REM Verifica se está na pasta correta
if not exist "tools\excel_to_json_watch.py" (
    echo ❌ Erro: Arquivo 'tools\excel_to_json_watch.py' não encontrado
    echo    Execute este script da pasta raiz (anuario2024/)
    pause
    exit /b 1
)

REM Verifica se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Erro: Python não está instalado ou não está no PATH
    echo    Instale Python 3.7+ em https://python.org
    pause
    exit /b 1
)

echo ✅ Python encontrado
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo    Versão: %PYTHON_VERSION%

REM Verifica e instala dependências
echo.
echo 📦 Verificando dependências...

python -c "import pandas" >nul 2>&1
if errorlevel 1 (
    echo    ❌ pandas - FALTA
    set "INSTALAR=1"
) else (
    echo    ✅ pandas - OK
)

python -c "import openpyxl" >nul 2>&1
if errorlevel 1 (
    echo    ❌ openpyxl - FALTA
    set "INSTALAR=1"
) else (
    echo    ✅ openpyxl - OK
)

python -c "import watchdog" >nul 2>&1
if errorlevel 1 (
    echo    ❌ watchdog - FALTA
    set "INSTALAR=1"
) else (
    echo    ✅ watchdog - OK
)

if defined INSTALAR (
    echo.
    echo 📥 Instalando dependências...
    python -m pip install -r tools/requirements.txt -q
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas com sucesso!
) else (
    echo.
    echo ✅ Todas as dependências estão instaladas!
)

REM Verifica pastas
echo.
echo 📁 Verificando pastas...

if not exist "tabelas-excel" (
    echo    ⚠️  Pasta 'tabelas-excel' não existe - criando...
    mkdir "tabelas-excel"
    echo    ✅ Pasta criada!
) else (
    echo    ✅ Pasta tabelas-excel - OK
)

if not exist "data" (
    echo    ⚠️  Pasta 'data' não existe - criando...
    mkdir "data"
    echo    ✅ Pasta criada!
) else (
    echo    ✅ Pasta data - OK
)

REM Inicia o watch
echo.
echo 🚀 Iniciando Watch Excel→JSON...
echo    Coloque seus arquivos em: tabelas-excel/
echo    JSONs serão salvos em: data/
echo    Pressione Ctrl+C para parar
echo.

python tools/excel_to_json_watch.py --watch

echo.
echo 🔴 Watch parado
pause
