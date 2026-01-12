Conteúdo do pacote 'anuario_moderno'
Arquivos:
- index.html           -> página principal (atualizada)
- style.css            -> estilos (tema claro/escuro e daltônico)
 main.js              -> scripts frontend (modal, tema)
 Feedback e sugestões removidos do projeto.
Como testar localmente:
1) Coloque este conteúdo em uma pasta.
2) Crie pasta 'public' com imagens (img/anuario.png, img/fapespa2.png, img/equipe2.png) ou atualize caminhos.
3) Rode:
   npm install
   node server.js
4) Abra http://localhost:3000/index.html

Para acessar os feedbacks:
GET /api/feedbacks?key=SEU_ADMIN_KEY   (defina a variável de ambiente ADMIN_KEY ao iniciar o server)

Obs: Em hospedagem estática sem backend, você pode apontar o endpoint /api/feedback para um backend separado ou usar um serviço serverless.
