@echo off
chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║ 📊 Repositório Anuário 2025 - Iniciador de Servidor        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo.
    echo   Você pode:
    echo   1. Instalar Python em: https://www.python.org/downloads/
    echo   2. Ou abrir diretamente: index.html no seu navegador
    echo.
    pause
    exit /b 1
)

echo ✅ Python encontrado
echo.
echo 🚀 Iniciando servidor local...
echo.

:: Iniciar o servidor
python server.py

pause
