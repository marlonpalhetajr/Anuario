// Dados expandidos para mapa interativo com histórico
const MUNICIPIOS_EXPANDIDOS = {
    "Belém": {
        coords: [-1.4564, -48.5044],
        regiao: "Metropolitana de Belém",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [1499641, 1485123, 1470485, 1456892, 1445230],
                densidade: [1315.26, 1305.12, 1295.45, 1286.78, 1278.45]
            },
            economia: {
                pib: [35.8, 36.2, 35.5, 34.9, 33.8],
                desemprego: [8.5, 8.2, 8.9, 9.1, 9.5],
                salario_minimo: [1412, 1386, 1363, 1342, 1320]
            },
            infraestrutura: {
                saneamento: [92.5, 91.8, 91.2, 90.5, 89.8],
                energia: [99.2, 99.1, 99.0, 98.9, 98.8]
            },
            social: {
                idh: [0.746, 0.742, 0.738, 0.734, 0.730],
                escolaridade: [8.5, 8.4, 8.3, 8.2, 8.1]
            }
        }
    },
    "Ananindeua": {
        coords: [-1.3758, -48.3770],
        regiao: "Metropolitana de Belém",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [531902, 525841, 520156, 514892, 509675],
                densidade: [1185.45, 1172.33, 1160.28, 1148.92, 1137.95]
            },
            economia: {
                pib: [12.5, 12.8, 12.3, 12.0, 11.8],
                desemprego: [9.2, 8.9, 9.5, 9.7, 10.1],
                salario_minimo: [1398, 1372, 1349, 1328, 1306]
            },
            infraestrutura: {
                saneamento: [88.5, 87.8, 87.1, 86.3, 85.5],
                energia: [98.9, 98.8, 98.7, 98.6, 98.5]
            },
            social: {
                idh: [0.695, 0.691, 0.687, 0.683, 0.679],
                escolaridade: [7.8, 7.7, 7.6, 7.5, 7.4]
            }
        }
    },
    "Santarém": {
        coords: [-2.4366, -54.7044],
        regiao: "Tapajós",
        mesorregiao: "Oeste Paraense",
        data: {
            demografia: {
                populacao: [296749, 291845, 287342, 283156, 279284],
                densidade: [45.2, 44.6, 43.9, 43.2, 42.6]
            },
            economia: {
                pib: [8.5, 8.7, 8.4, 8.2, 8.0],
                desemprego: [7.8, 7.5, 8.2, 8.4, 8.8],
                salario_minimo: [1420, 1394, 1371, 1350, 1328]
            },
            infraestrutura: {
                saneamento: [75.5, 74.2, 72.9, 71.5, 70.1],
                energia: [97.8, 97.6, 97.4, 97.2, 97.0]
            },
            social: {
                idh: [0.698, 0.694, 0.690, 0.686, 0.682],
                escolaridade: [7.9, 7.8, 7.7, 7.6, 7.5]
            }
        }
    },
    "Marabá": {
        coords: [-5.3675, -49.3483],
        regiao: "Carajás",
        mesorregiao: "Sudeste Paraense",
        data: {
            demografia: {
                populacao: [251885, 247562, 243456, 239635, 236089],
                densidade: [20.5, 20.2, 19.9, 19.6, 19.3]
            },
            economia: {
                pib: [7.8, 8.0, 7.9, 7.6, 7.4],
                desemprego: [8.9, 8.6, 9.1, 9.3, 9.6],
                salario_minimo: [1438, 1412, 1389, 1368, 1346]
            },
            infraestrutura: {
                saneamento: [68.5, 67.2, 65.8, 64.3, 62.8],
                energia: [97.5, 97.3, 97.1, 96.9, 96.7]
            },
            social: {
                idh: [0.681, 0.677, 0.673, 0.669, 0.665],
                escolaridade: [7.5, 7.4, 7.3, 7.2, 7.1]
            }
        }
    },
    "Castanhal": {
        coords: [-1.2968, -47.9219],
        regiao: "Nordeste",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [189459, 186542, 183845, 181356, 179062],
                densidade: [195.3, 192.5, 189.8, 187.2, 184.7]
            },
            economia: {
                pib: [5.2, 5.4, 5.3, 5.1, 4.9],
                desemprego: [9.1, 8.8, 9.3, 9.5, 9.8],
                salario_minimo: [1405, 1379, 1356, 1335, 1313]
            },
            infraestrutura: {
                saneamento: [72.5, 71.2, 69.8, 68.3, 66.8],
                energia: [98.2, 98.1, 98.0, 97.9, 97.8]
            },
            social: {
                idh: [0.702, 0.698, 0.694, 0.690, 0.686],
                escolaridade: [8.0, 7.9, 7.8, 7.7, 7.6]
            }
        }
    },
    "Parauapebas": {
        coords: [-6.0667, -49.9139],
        regiao: "Carajás",
        mesorregiao: "Sudeste Paraense",
        data: {
            demografia: {
                populacao: [181935, 178562, 175456, 172589, 169954],
                densidade: [12.5, 12.3, 12.1, 11.9, 11.7]
            },
            economia: {
                pib: [6.8, 7.1, 6.9, 6.7, 6.5],
                desemprego: [7.9, 7.6, 8.1, 8.3, 8.6],
                salario_minimo: [1456, 1430, 1407, 1386, 1364]
            },
            infraestrutura: {
                saneamento: [85.5, 84.2, 82.8, 81.3, 79.8],
                energia: [99.1, 99.0, 98.9, 98.8, 98.7]
            },
            social: {
                idh: [0.728, 0.724, 0.720, 0.716, 0.712],
                escolaridade: [8.3, 8.2, 8.1, 8.0, 7.9]
            }
        }
    },
    "Altamira": {
        coords: [-3.2023, -52.2629],
        regiao: "Xingu",
        mesorregiao: "Oeste Paraense",
        data: {
            demografia: {
                populacao: [114894, 113456, 112145, 110956, 109879],
                densidade: [2.8, 2.75, 2.7, 2.65, 2.6]
            },
            economia: {
                pib: [3.5, 3.7, 3.6, 3.4, 3.2],
                desemprego: [8.5, 8.2, 8.7, 8.9, 9.2],
                salario_minimo: [1428, 1402, 1379, 1358, 1336]
            },
            infraestrutura: {
                saneamento: [62.5, 61.2, 59.8, 58.3, 56.8],
                energia: [96.5, 96.3, 96.1, 95.9, 95.7]
            },
            social: {
                idh: [0.671, 0.667, 0.663, 0.659, 0.655],
                escolaridade: [7.2, 7.1, 7.0, 6.9, 6.8]
            }
        }
    },
    "Marituba": {
        coords: [-1.3861, -48.1697],
        regiao: "Metropolitana de Belém",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [124568, 122456, 120612, 118935, 117428],
                densidade: [285.6, 282.3, 279.2, 276.2, 273.4]
            },
            economia: {
                pib: [3.8, 3.9, 3.8, 3.7, 3.6],
                desemprego: [9.5, 9.2, 9.7, 9.9, 10.2],
                salario_minimo: [1395, 1369, 1346, 1325, 1303]
            },
            infraestrutura: {
                saneamento: [86.5, 85.2, 83.8, 82.3, 80.8],
                energia: [98.5, 98.4, 98.3, 98.2, 98.1]
            },
            social: {
                idh: [0.712, 0.708, 0.704, 0.700, 0.696],
                escolaridade: [8.1, 8.0, 7.9, 7.8, 7.7]
            }
        }
    },
    "Tucuruí": {
        coords: [-3.7597, -49.6719],
        regiao: "Lago de Tucuruí",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [105678, 104256, 102945, 101748, 100652],
                densidade: [18.5, 18.2, 17.9, 17.6, 17.3]
            },
            economia: {
                pib: [3.2, 3.4, 3.3, 3.1, 3.0],
                desemprego: [8.2, 7.9, 8.4, 8.6, 8.9],
                salario_minimo: [1425, 1399, 1376, 1355, 1333]
            },
            infraestrutura: {
                saneamento: [71.5, 70.2, 68.8, 67.3, 65.8],
                energia: [98.8, 98.7, 98.6, 98.5, 98.4]
            },
            social: {
                idh: [0.695, 0.691, 0.687, 0.683, 0.679],
                escolaridade: [7.8, 7.7, 7.6, 7.5, 7.4]
            }
        }
    },
    "Capanema": {
        coords: [-0.9728, -47.2456],
        regiao: "Nordeste",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [18456, 18125, 17812, 17515, 17234],
                densidade: [52.3, 51.8, 51.3, 50.8, 50.3]
            },
            economia: {
                pib: [0.8, 0.85, 0.82, 0.79, 0.76],
                desemprego: [10.2, 9.9, 10.4, 10.6, 10.9],
                salario_minimo: [1380, 1354, 1331, 1310, 1288]
            },
            infraestrutura: {
                saneamento: [55.5, 54.2, 52.8, 51.3, 49.8],
                energia: [97.2, 97.1, 97.0, 96.9, 96.8]
            },
            social: {
                idh: [0.652, 0.648, 0.644, 0.640, 0.636],
                escolaridade: [6.8, 6.7, 6.6, 6.5, 6.4]
            }
        }
    },
    "Marapanim": {
        coords: [-0.5808, -47.6228],
        regiao: "Nordeste",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [28945, 28512, 28105, 27712, 27333],
                densidade: [35.8, 35.3, 34.8, 34.3, 33.8]
            },
            economia: {
                pib: [1.2, 1.25, 1.22, 1.19, 1.16],
                desemprego: [9.8, 9.5, 10.0, 10.2, 10.5],
                salario_minimo: [1390, 1364, 1341, 1320, 1298]
            },
            infraestrutura: {
                saneamento: [58.5, 57.2, 55.8, 54.3, 52.8],
                energia: [97.5, 97.4, 97.3, 97.2, 97.1]
            },
            social: {
                idh: [0.668, 0.664, 0.660, 0.656, 0.652],
                escolaridade: [7.0, 6.9, 6.8, 6.7, 6.6]
            }
        }
    },
    "Soure": {
        coords: [-0.7336, -48.6092],
        regiao: "Marajó",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [24567, 24156, 23762, 23384, 23021],
                densidade: [12.5, 12.3, 12.1, 11.9, 11.7]
            },
            economia: {
                pib: [0.95, 1.0, 0.97, 0.94, 0.91],
                desemprego: [11.5, 11.2, 11.7, 11.9, 12.2],
                salario_minimo: [1375, 1349, 1326, 1305, 1283]
            },
            infraestrutura: {
                saneamento: [48.5, 47.2, 45.8, 44.3, 42.8],
                energia: [96.8, 96.7, 96.6, 96.5, 96.4]
            },
            social: {
                idh: [0.645, 0.641, 0.637, 0.633, 0.629],
                escolaridade: [6.5, 6.4, 6.3, 6.2, 6.1]
            }
        }
    },
    "Oriximiná": {
        coords: [0.7667, -55.8500],
        regiao: "Ouest",
        mesorregiao: "Oeste Paraense",
        data: {
            demografia: {
                populacao: [56234, 55456, 54702, 53968, 53254],
                densidade: [1.8, 1.75, 1.7, 1.65, 1.6]
            },
            economia: {
                pib: [1.8, 1.9, 1.85, 1.8, 1.75],
                desemprego: [8.1, 7.8, 8.3, 8.5, 8.8],
                salario_minimo: [1435, 1409, 1386, 1365, 1343]
            },
            infraestrutura: {
                saneamento: [45.5, 44.2, 42.8, 41.3, 39.8],
                energia: [95.5, 95.3, 95.1, 94.9, 94.7]
            },
            social: {
                idh: [0.638, 0.634, 0.630, 0.626, 0.622],
                escolaridade: [6.3, 6.2, 6.1, 6.0, 5.9]
            }
        }
    },
    "Breves": {
        coords: [-0.8925, -50.4808],
        regiao: "Marajó",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [42156, 41542, 40951, 40381, 39831],
                densidade: [8.5, 8.3, 8.1, 7.9, 7.7]
            },
            economia: {
                pib: [1.5, 1.6, 1.55, 1.5, 1.45],
                desemprego: [10.8, 10.5, 11.0, 11.2, 11.5],
                salario_minimo: [1385, 1359, 1336, 1315, 1293]
            },
            infraestrutura: {
                saneamento: [52.5, 51.2, 49.8, 48.3, 46.8],
                energia: [96.2, 96.1, 96.0, 95.9, 95.8]
            },
            social: {
                idh: [0.655, 0.651, 0.647, 0.643, 0.639],
                escolaridade: [6.7, 6.6, 6.5, 6.4, 6.3]
            }
        }
    },
    "Abaetetuba": {
        coords: [-1.9231, -48.8789],
        regiao: "Nordeste",
        mesorregiao: "Nordeste Paraense",
        data: {
            demografia: {
                populacao: [156234, 153845, 151562, 149384, 147308],
                densidade: [55.2, 54.5, 53.8, 53.1, 52.4]
            },
            economia: {
                pib: [4.5, 4.7, 4.6, 4.4, 4.2],
                desemprego: [9.4, 9.1, 9.6, 9.8, 10.1],
                salario_minimo: [1410, 1384, 1361, 1340, 1318]
            },
            infraestrutura: {
                saneamento: [65.5, 64.2, 62.8, 61.3, 59.8],
                energia: [97.8, 97.7, 97.6, 97.5, 97.4]
            },
            social: {
                idh: [0.678, 0.674, 0.670, 0.666, 0.662],
                escolaridade: [7.4, 7.3, 7.2, 7.1, 7.0]
            }
        }
    }
};

// Categorias e indicadores com labels português
const CATEGORIAS_CONFIG = {
    "demografia": {
        label: "Demografia",
        color: "#3498db",
        indicadores: {
            "populacao": { label: "População", unit: "hab", decimals: 0 },
            "densidade": { label: "Densidade", unit: "hab/km²", decimals: 2 }
        }
    },
    "economia": {
        label: "Economia",
        color: "#e74c3c",
        indicadores: {
            "pib": { label: "PIB", unit: "bilhões R$", decimals: 2 },
            "desemprego": { label: "Desemprego", unit: "%", decimals: 1 },
            "salario_minimo": { label: "Salário Mínimo", unit: "R$", decimals: 0 }
        }
    },
    "infraestrutura": {
        label: "Infraestrutura",
        color: "#f39c12",
        indicadores: {
            "saneamento": { label: "Saneamento", unit: "%", decimals: 1 },
            "energia": { label: "Eletrificação", unit: "%", decimals: 1 }
        }
    },
    "social": {
        label: "Social",
        color: "#27ae60",
        indicadores: {
            "idh": { label: "IDH", unit: "índice", decimals: 3 },
            "escolaridade": { label: "Escolaridade", unit: "anos", decimals: 1 }
        }
    }
};

// Função helper para obter dados
function getMunicipioData(nome, categoria, indicador) {
    const mun = MUNICIPIOS_EXPANDIDOS[nome];
    if (!mun || !mun.data[categoria] || !mun.data[categoria][indicador]) {
        return null;
    }
    // Retorna o valor mais recente (primeiro item do array)
    return mun.data[categoria][indicador][0];
}

// Função para obter histórico (últimos 5 anos)
function getHistorico(nome, categoria, indicador) {
    const mun = MUNICIPIOS_EXPANDIDOS[nome];
    if (!mun || !mun.data[categoria] || !mun.data[categoria][indicador]) {
        return [];
    }
    return mun.data[categoria][indicador].reverse(); // Inverte para mais antigo ao mais recente
}

// Função para calcular estatísticas por indicador
function calcularEstatisticas(categoria, indicador) {
    const valores = [];
    
    for (const nome in MUNICIPIOS_EXPANDIDOS) {
        const valor = getMunicipioData(nome, categoria, indicador);
        if (valor !== null && !isNaN(valor)) {
            valores.push({ nome, valor });
        }
    }
    
    valores.sort((a, b) => b.valor - a.valor);
    
    const media = valores.reduce((sum, item) => sum + item.valor, 0) / valores.length;
    const max = valores[0];
    const min = valores[valores.length - 1];
    
    return { valores, media, max, min };
}

// Função para obter municípios por região
function getMunicipiosPorRegiao(regiao = null) {
    const resultado = {};
    
    for (const nome in MUNICIPIOS_EXPANDIDOS) {
        const mun = MUNICIPIOS_EXPANDIDOS[nome];
        const munRegiao = mun.regiao;
        
        if (!regiao || munRegiao === regiao) {
            if (!resultado[munRegiao]) {
                resultado[munRegiao] = [];
            }
            resultado[munRegiao].push(nome);
        }
    }
    
    return resultado;
}
