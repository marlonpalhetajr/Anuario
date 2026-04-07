const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const PUBLIC_DIR = __dirname;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.geojson': 'application/geo+json',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.ico': 'image/x-icon'
};

function ensureMime(ext) {
  const type = MIME_TYPES[ext];
  if (type) return type;
  if (ext === '' || ext === '.html') return 'text/html; charset=utf-8';
  return 'application/octet-stream';
}

async function statPath(target) {
  try {
    return await fs.promises.stat(target);
  } catch (err) {
    return null;
  }
}

// Resolve o arquivo solicitado protegendo contra path traversal
async function resolveFilePath(requestPath) {
  const normalized = path
    .normalize(decodeURIComponent(requestPath))
    .replace(/^([./\\])+/, '')
    .replace(/\\/g, '/');

  let filePath = path.join(PUBLIC_DIR, normalized);
  let stats = await statPath(filePath);

  if (stats && stats.isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (await statPath(indexPath)) return indexPath;

    // Ex.: /mapa-interativo -> /mapa-interativo/mapa-interativo.html
    const dirName = path.basename(filePath);
    const fallbackHtml = path.join(filePath, `${dirName}.html`);
    if (await statPath(fallbackHtml)) return fallbackHtml;
  }

  if (!stats && path.extname(filePath) === '') {
    const htmlCandidate = `${filePath}.html`;
    if (await statPath(htmlCandidate)) return htmlCandidate;
  }

  return stats ? filePath : null;
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const filePath = await resolveFilePath(parsedUrl.pathname);

    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - Arquivo não encontrado</h1><p>Requisição: ' + parsedUrl.pathname + '</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = ensureMime(ext);

    const data = await fs.promises.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    console.error('Erro ao servir arquivo:', err);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>500 - Erro no servidor</h1>');
  }
});

server.listen(PORT, 'localhost', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Diretório: ${__dirname}`);
  console.log('🔗 Rotas amigáveis: /mapa-interativo, /apresentacao, /economia');
  console.log('⌨️  Pressione Ctrl+C para parar o servidor');
});
