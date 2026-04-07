const fs = require('fs');
const https = require('https');
const path = require('path');

const GEOJSON_OUTPUT = path.join(__dirname, '..', 'data', 'para_municipios.geojson');

console.log('🌐 Buscando GeoJSON detalhado dos municípios do Pará...');

// URL correta para municípios (não simplificada)
const url = 'https://servicodados.ibge.gov.br/api/v3/malhas/estados/15?formato=application/vnd.geo+json';

https.get(url, (res) => {
    let data = '';
    
    res.on('data', chunk => data += chunk);
    
    res.on('end', () => {
        try {
            const geojson = JSON.parse(data);
            
            // Verificar se é um FeatureCollection válido
            if (geojson.type === 'FeatureCollection' && geojson.features) {
                console.log(`✓ ${geojson.features.length} features encontradas`);
                
                // Se veio apenas 1 feature (o estado inteiro), precisamos buscar municípios separadamente
                if (geojson.features.length === 1) {
                    console.log('⚠️ GeoJSON retornou apenas o estado. Buscando municípios...');
                    buscarMunicipios();
                    return;
                }
                
                // Salvar GeoJSON
                fs.writeFileSync(GEOJSON_OUTPUT, JSON.stringify(geojson, null, 2), 'utf8');
                console.log(`✓ GeoJSON salvo em: ${GEOJSON_OUTPUT}`);
                
                // Mostrar alguns nomes de municípios
                console.log('\nExemplos de municípios:');
                geojson.features.slice(0, 5).forEach(f => {
                    console.log(`  - ${f.properties.name || f.properties.NM_MUN || f.properties.nome}`);
                });
                
            } else {
                console.error('❌ Formato de GeoJSON inválido');
            }
        } catch (error) {
            console.error('❌ Erro ao processar GeoJSON:', error.message);
        }
    });
}).on('error', (error) => {
    console.error('❌ Erro ao buscar GeoJSON:', error.message);
});

function buscarMunicipios() {
    // Alternativa: buscar arquivo do repositório do Brasil.io ou outras fontes
    console.log('\n📥 Tentando fonte alternativa...');
    const altUrl = 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-15-mun.json';
    
    https.get(altUrl, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        
        res.on('end', () => {
            try {
                const geojson = JSON.parse(data);
                fs.writeFileSync(GEOJSON_OUTPUT, JSON.stringify(geojson, null, 2), 'utf8');
                console.log(`✓ GeoJSON salvo em: ${GEOJSON_OUTPUT}`);
                console.log(`✓ ${geojson.features?.length || 0} municípios encontrados`);
            } catch (error) {
                console.error('❌ Erro:', error.message);
                console.log('\n⚠️ Baixe manualmente de:');
                console.log('https://github.com/tbrugz/geodata-br/tree/master/geojson');
            }
        });
    }).on('error', () => {
        console.log('\n⚠️ Não foi possível baixar automaticamente.');
        console.log('Baixe manualmente o arquivo geojson dos municípios do Pará');
    });
}
