@echo off
echo ================================================================================
echo  SERVIDOR HTTP LOCAL - ANUARIO ESTATISTICO FAPESPA
echo ================================================================================
echo.
echo Iniciando servidor na porta 8080...
echo.
echo URLs disponiveis:
echo   - Pagina principal: http://localhost:8080/index.html
echo   - Mapa interativo: http://localhost:8080/mapa-interativo/mapa-interativo.html
echo   - Mapas: http://localhost:8080/mapas.html
echo.
echo Pressione Ctrl+C para parar o servidor
echo ================================================================================
echo.

cd ..
start http://localhost:8080/mapa-interativo/mapa-interativo.html

npx --yes http-server -p 8080 --cors
