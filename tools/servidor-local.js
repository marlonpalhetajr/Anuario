const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BASE_DIR = path.join(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(BASE_DIR, req.url === '/' ? '/index.html' : req.url);
    
    // Previne acesso fora do diretório base
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403);
        res.end('Acesso negado');
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end(`Arquivo não encontrado: ${req.url}`);
            } else {
                res.writeHead(500);
                res.end(`Erro no servidor: ${err.code}`);
            }
        } else {
            const ext = path.extname(filePath);
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(80));
    console.log('🌐 SERVIDOR HTTP LOCAL - ANUÁRIO ESTATÍSTICO FAPESPA');
    console.log('='.repeat(80));
    console.log(`\n✅ Servidor rodando em: http://localhost:${PORT}`);
    console.log(`📁 Diretório base: ${BASE_DIR}`);
    console.log('\n📍 URLs disponíveis:');
    console.log(`   • Página principal: http://localhost:${PORT}/index.html`);
    console.log(`   • Mapa interativo: http://localhost:${PORT}/mapa-interativo/mapa-interativo.html`);
    console.log(`   • Mapas: http://localhost:${PORT}/mapas.html`);
    console.log('\n💡 Pressione Ctrl+C para parar o servidor');
    console.log('='.repeat(80));
});
