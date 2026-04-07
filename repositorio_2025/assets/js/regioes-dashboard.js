(function () {
  "use strict";

  const CONFIG_URL = "./data/regioes-config.json";

  async function loadRegioes() {
    try {
      const response = await fetch(CONFIG_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Falha ao carregar ${CONFIG_URL}: ${response.status}`);
      }
      const json = await response.json();
      return json.regioes_integracao || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  function renderRegioes(regioes) {
    const grid = document.getElementById("regioes-grid");
    
    if (!regioes || regioes.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #5d6a62;">Nenhuma região carregada.</p>';
      return;
    }

    const html = regioes
      .map((regiao) => {
        return `
          <a href="./index.html?regiao=${encodeURIComponent(regiao.nome)}" class="regiao-card">
            <span class="regiao-card-code">${regiao.id}</span>
            <h3 class="regiao-card-title">${escapeHtml(regiao.nome)}</h3>
            <p class="regiao-card-desc">${escapeHtml(regiao.descricao)}</p>
            <div class="regiao-card-footer">
              Explorar → 
            </div>
          </a>
        `;
      })
      .join("");

    grid.innerHTML = html;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function init() {
    const regioes = await loadRegioes();
    renderRegioes(regioes);
  }

  init();
})();
