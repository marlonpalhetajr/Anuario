(function () {
  "use strict";

  const DATA_URL = "./data/tables-index.json";

  const state = {
    raw: [],
    filtered: [],
    filters: {
      ano: "",
      eixo: "",
      tema: "",
      regiao: "",
      municipio: "",
      busca: ""
    }
  };

  const els = {
    ano: document.getElementById("filter-ano"),
    eixo: document.getElementById("filter-eixo"),
    tema: document.getElementById("filter-tema"),
    regiao: document.getElementById("filter-regiao"),
    municipio: document.getElementById("filter-municipio"),
    busca: document.getElementById("filter-busca"),
    btnLimpar: document.getElementById("btn-limpar"),
    tbody: document.getElementById("results-body"),
    count: document.getElementById("results-count"),
    empty: document.getElementById("empty-state")
  };

  function normalizeText(value) {
    return (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function uniqueValues(items, field) {
    return [...new Set(items.map((x) => (x[field] || "").toString().trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
  }

  function fillSelect(selectEl, values, keepValue) {
    const current = keepValue || "";
    const firstOption = '<option value="">Todos</option>';
    const options = values.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
    selectEl.innerHTML = firstOption + options;
    if (current && values.includes(current)) {
      selectEl.value = current;
    } else {
      selectEl.value = "";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function matchFilters(row) {
    const byAno = !state.filters.ano || row.ano === state.filters.ano;
    const byEixo = !state.filters.eixo || row.eixo === state.filters.eixo;
    const byTema = !state.filters.tema || row.tema === state.filters.tema;
    const byRegiao = !state.filters.regiao || row.regiao === state.filters.regiao;
    const byMunicipio = !state.filters.municipio || row.municipio === state.filters.municipio;

    const search = normalizeText(state.filters.busca);
    const haystack = normalizeText(
      [
        row.ano,
        row.eixo,
        row.tema,
        row.regiao,
        row.municipio,
        row.codigo,
        row.titulo,
        row.indicador
      ].join(" ")
    );
    const byBusca = !search || haystack.includes(search);

    return byAno && byEixo && byTema && byRegiao && byMunicipio && byBusca;
  }

  function applyFilters() {
    state.filtered = state.raw.filter(matchFilters);
    renderResults();
    syncDependentFilters();
  }

  function syncDependentFilters() {
    const base = state.raw.filter((row) => {
      const byAno = !state.filters.ano || row.ano === state.filters.ano;
      const byEixo = !state.filters.eixo || row.eixo === state.filters.eixo;
      const byTema = !state.filters.tema || row.tema === state.filters.tema;
      const byRegiao = !state.filters.regiao || row.regiao === state.filters.regiao;
      const byMunicipio = !state.filters.municipio || row.municipio === state.filters.municipio;
      return byAno && byEixo && byTema && byRegiao && byMunicipio;
    });

    fillSelect(els.ano, uniqueValues(base, "ano"), state.filters.ano);
    fillSelect(els.eixo, uniqueValues(base, "eixo"), state.filters.eixo);
    fillSelect(els.tema, uniqueValues(base, "tema"), state.filters.tema);
    fillSelect(els.regiao, uniqueValues(base, "regiao"), state.filters.regiao);
    fillSelect(els.municipio, uniqueValues(base, "municipio"), state.filters.municipio);

    state.filters.ano = els.ano.value;
    state.filters.eixo = els.eixo.value;
    state.filters.tema = els.tema.value;
    state.filters.regiao = els.regiao.value;
    state.filters.municipio = els.municipio.value;
  }

  function renderResults() {
    const html = state.filtered
      .map((row) => {
        const href = escapeHtml(row.arquivo_url || "#");
        const fileName = escapeHtml(row.arquivo_nome || "Abrir");
        return `
          <tr>
            <td>${escapeHtml(row.ano || "")}</td>
            <td>${escapeHtml(row.eixo || "")}</td>
            <td>${escapeHtml(row.tema || "")}</td>
            <td>${escapeHtml(row.regiao || "")}</td>
            <td>${escapeHtml(row.municipio || "")}</td>
            <td>${escapeHtml(row.codigo || "")}</td>
            <td>${escapeHtml(row.titulo || "")}</td>
            <td><a href="${href}" target="_blank" rel="noopener noreferrer">${fileName}</a></td>
          </tr>
        `;
      })
      .join("");

    els.tbody.innerHTML = html;
    els.count.textContent = `${state.filtered.length} resultado(s)`;
    els.empty.classList.toggle("hidden", state.filtered.length > 0);
  }

  function bindEvents() {
    els.ano.addEventListener("change", () => {
      state.filters.ano = els.ano.value;
      applyFilters();
    });

    els.eixo.addEventListener("change", () => {
      state.filters.eixo = els.eixo.value;
      applyFilters();
    });

    els.tema.addEventListener("change", () => {
      state.filters.tema = els.tema.value;
      applyFilters();
    });

    els.regiao.addEventListener("change", () => {
      state.filters.regiao = els.regiao.value;
      applyFilters();
    });

    els.municipio.addEventListener("change", () => {
      state.filters.municipio = els.municipio.value;
      applyFilters();
    });

    els.busca.addEventListener("input", () => {
      state.filters.busca = els.busca.value || "";
      applyFilters();
    });

    els.btnLimpar.addEventListener("click", () => {
      state.filters = {
        ano: "",
        eixo: "",
        tema: "",
        regiao: "",
        municipio: "",
        busca: ""
      };
      els.ano.value = "";
      els.eixo.value = "";
      els.tema.value = "";
      els.regiao.value = "";
      els.municipio.value = "";
      els.busca.value = "";
      applyFilters();
    });
  }

  function parseRow(row) {
    return {
      ano: (row.ano || "").toString().trim(),
      eixo: (row.eixo || "").toString().trim(),
      tema: (row.tema || "").toString().trim(),
      regiao: (row.regiao || "").toString().trim(),
      municipio: (row.municipio || "").toString().trim(),
      codigo: (row.codigo || "").toString().trim(),
      titulo: (row.titulo || "").toString().trim(),
      indicador: (row.indicador || "").toString().trim(),
      arquivo_nome: (row.arquivo_nome || "Abrir tabela").toString().trim(),
      arquivo_url: (row.arquivo_url || "#").toString().trim()
    };
  }

  async function loadData() {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Falha ao carregar ${DATA_URL}: ${response.status}`);
    }
    const json = await response.json();
    if (!Array.isArray(json)) {
      throw new Error("Formato inválido: esperado array JSON");
    }
    state.raw = json.map(parseRow);
  }

  async function init() {
    try {
      await loadData();

      fillSelect(els.ano, uniqueValues(state.raw, "ano"), "");
      fillSelect(els.eixo, uniqueValues(state.raw, "eixo"), "");
      fillSelect(els.tema, uniqueValues(state.raw, "tema"), "");
      fillSelect(els.regiao, uniqueValues(state.raw, "regiao"), "");
      fillSelect(els.municipio, uniqueValues(state.raw, "municipio"), "");

      bindEvents();
      applyFilters();
    } catch (err) {
      console.error(err);
      els.empty.classList.remove("hidden");
      els.empty.textContent = "Erro ao carregar dados do repositório. Verifique o arquivo JSON.";
    }
  }

  init();
})();
