# Como Publicar o Anuário no GitHub Pages

## Passo 1: Instalar o Git
1. Baixe o Git em: https://git-scm.com/download/win
2. Execute o instalador e siga as opções padrão
3. Reinicie o VS Code após a instalação

## Passo 2: Configurar o Git (primeira vez)
Abra o terminal do VS Code e execute:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

## Passo 3: Inicializar o Repositório
No terminal, na pasta do projeto:
```bash
git init
git add .
git commit -m "Primeiro commit - Anuário 2024"
```

## Passo 4: Criar Repositório no GitHub
1. Acesse https://github.com
2. Faça login (ou crie uma conta se não tiver)
3. Clique no botão verde "New" para criar um novo repositório
4. Nome sugerido: `anuario2024`
5. Deixe como **Public**
6. **NÃO** marque "Initialize with README"
7. Clique em "Create repository"

## Passo 5: Conectar e Enviar os Arquivos
Copie os comandos que o GitHub mostrar na tela, algo como:
```bash
git remote add origin https://github.com/SEU-USUARIO/anuario2024.git
git branch -M main
git push -u origin main
```

## Passo 6: Ativar GitHub Pages
1. No seu repositório no GitHub, vá em **Settings** (⚙️)
2. No menu lateral esquerdo, clique em **Pages**
3. Em "Source", selecione **main** branch
4. Clique em **Save**
5. Aguarde 1-2 minutos

## Passo 7: Acessar o Site
Seu site estará disponível em:
```
https://SEU-USUARIO.github.io/anuario2024/mapas.html
```

## Arquivo .gitignore Recomendado
Crie um arquivo `.gitignore` na raiz do projeto com:
```
.DS_Store
Thumbs.db
*.log
node_modules/
.vscode/
```

## Para Atualizar o Site (após mudanças)
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

O GitHub Pages atualiza automaticamente em 1-2 minutos após o push.

---

**Dica:** Depois de publicado no GitHub Pages, o download dos mapas funcionará perfeitamente porque os arquivos estarão servidos via HTTPS!
