# Script para configurar Git Portable e fazer commit no GitHub
# Execute este arquivo com: powershell -ExecutionPolicy Bypass -File setup-github.ps1

Write-Host "======================================"
Write-Host "Setup GitHub Pages - Anuário 2024"
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Passo 1: Baixar Git Portable
Write-Host "Passo 1: Baixando Git Portable..." -ForegroundColor Cyan
$GitPortablePath = "$env:USERPROFILE\PortableGit"
$GitZipPath = "$env:USERPROFILE\Downloads\PortableGit.7z.exe"

if (-not (Test-Path $GitPortablePath)) {
    Write-Host "Baixando Git Portable (este processo pode levar alguns minutos)..."
    
    # URL do Git Portable mais recente
    $url = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/PortableGit-2.43.0-64-bit.7z.exe"
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $url -OutFile $GitZipPath -UseBasicParsing
        Write-Host "✓ Download concluído!" -ForegroundColor Green
        
        Write-Host "Extraindo Git Portable..."
        & $GitZipPath -o"$GitPortablePath" -y | Out-Null
        Write-Host "✓ Extração concluída!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Erro ao baixar Git Portable" -ForegroundColor Red
        Write-Host "Tente baixar manualmente em: https://github.com/git-for-windows/git/releases" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✓ Git Portable já existe em: $GitPortablePath" -ForegroundColor Green
}

Write-Host ""

# Passo 2: Adicionar Git ao PATH
Write-Host "Passo 2: Configurando PATH..." -ForegroundColor Cyan
$env:Path = "$GitPortablePath\bin;$env:Path"
Write-Host "✓ PATH configurado!" -ForegroundColor Green

Write-Host ""

# Passo 3: Configurar Git
Write-Host "Passo 3: Configurando Git..." -ForegroundColor Cyan
$name = Read-Host "Digite seu nome completo"
$email = Read-Host "Digite seu email do GitHub"

& "$GitPortablePath\bin\git.exe" config --global user.name "$name"
& "$GitPortablePath\bin\git.exe" config --global user.email "$email"
Write-Host "✓ Git configurado para: $name <$email>" -ForegroundColor Green

Write-Host ""

# Passo 4: Inicializar repositório
Write-Host "Passo 4: Inicializando repositório..." -ForegroundColor Cyan
$projectPath = Get-Location

cd $projectPath

# Verificar se já existe .git
if (-not (Test-Path .git)) {
    & "$GitPortablePath\bin\git.exe" init
    Write-Host "✓ Repositório inicializado!" -ForegroundColor Green
} else {
    Write-Host "✓ Repositório já existe!" -ForegroundColor Green
}

Write-Host ""

# Passo 5: Adicionar todos os arquivos
Write-Host "Passo 5: Adicionando arquivos..." -ForegroundColor Cyan
& "$GitPortablePath\bin\git.exe" add .
Write-Host "✓ Arquivos adicionados!" -ForegroundColor Green

Write-Host ""

# Passo 6: Fazer primeiro commit
Write-Host "Passo 6: Fazendo commit..." -ForegroundColor Cyan
& "$GitPortablePath\bin\git.exe" commit -m "Primeiro commit - Anuário 2024"
Write-Host "✓ Commit realizado!" -ForegroundColor Green

Write-Host ""

# Passo 7: Adicionar remote origin
Write-Host "Passo 7: Conectando ao GitHub..." -ForegroundColor Cyan
$username = Read-Host "Digite seu usuário do GitHub"
$repo = Read-Host "Digite o nome do repositório (ex: anuario2024)"

$remoteUrl = "https://github.com/$username/$repo.git"

# Verificar se remote já existe
$existingRemote = & "$GitPortablePath\bin\git.exe" remote get-url origin 2>$null
if ($existingRemote -ne $remoteUrl) {
    & "$GitPortablePath\bin\git.exe" remote remove origin 2>$null
    & "$GitPortablePath\bin\git.exe" remote add origin $remoteUrl
}

Write-Host "✓ Remote configurado: $remoteUrl" -ForegroundColor Green

Write-Host ""

# Passo 8: Fazer push
Write-Host "Passo 8: Enviando para GitHub..." -ForegroundColor Cyan
& "$GitPortablePath\bin\git.exe" branch -M main
& "$GitPortablePath\bin\git.exe" push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Push realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "⚠ Houve um erro no push. Verifique:" -ForegroundColor Yellow
    Write-Host "1. Você criou o repositório em https://github.com/new ?" -ForegroundColor Yellow
    Write-Host "2. O repositório está vazio (sem README inicial)?" -ForegroundColor Yellow
    Write-Host "3. Sua senha/token está correta?" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================"
Write-Host "Setup concluído!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/$username/$repo/settings/pages" -ForegroundColor White
Write-Host "2. Em 'Source', selecione 'main' branch" -ForegroundColor White
Write-Host "3. Aguarde 1-2 minutos" -ForegroundColor White
Write-Host "4. Seu site estará em: https://$username.github.io/$repo/" -ForegroundColor White
Write-Host ""
