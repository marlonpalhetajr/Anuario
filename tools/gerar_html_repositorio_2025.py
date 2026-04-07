from __future__ import annotations

import html
from pathlib import Path

import pandas as pd


BASE_DIR = Path(r"c:\Users\Junior\OneDrive - Fapespa\anuario2024\repositorio_2025")
TEMATICA_DIR = BASE_DIR / "tabelas_por_tematica"
SUBTEMA_DIR = BASE_DIR / "tabelas_por_tematica_subtema"
HTML_DIR = BASE_DIR / "html"


def slug_to_title(nome: str) -> str:
    texto = nome.replace("__", " | ").replace("_", " ")
    return " ".join(parte.capitalize() for parte in texto.split())


def dataframe_preview_html(df: pd.DataFrame, table_id: str, max_rows: int = 500) -> str:
    preview = df.head(max_rows).copy()
    preview.columns = [str(c) for c in preview.columns]
    return preview.to_html(
        index=False,
        table_id=table_id,
        classes=["table", "table-striped", "table-hover", "js-data-table"],
        border=0,
    )


def format_num(valor: int) -> str:
    return f"{valor:,}".replace(",", ".")


def page_template(title: str, body: str, back_link: str | None = None) -> str:
    back_html = f'<a class="btn btn-default btn-sm" href="{html.escape(back_link)}">Voltar</a>' if back_link else ""
    return f"""<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} - Repositório 2025</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/dataTables.bootstrap.min.css">
  <style>
    body {{
      background: #f5f5f5;
      padding-top: 60px;
      font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }}
    .navbar-inverse {{
      border-radius: 0;
      background-color: #222;
      border-color: #121212;
    }}
    .navbar-brand {{
      color: #fff !important;
      font-size: 20px;
      font-weight: 600;
    }}
    .chart-wrapper {{
      background: #fff;
      border: 1px solid #dfdfdf;
      border-radius: 3px;
      margin-bottom: 12px;
    }}
    .chart-title {{
      border-bottom: 1px solid #dfdfdf;
      padding: 9px 12px;
      font-size: 16px;
      color: #2b2b2b;
    }}
    .chart-stage {{
      padding: 12px;
    }}
    .table-meta {{
      margin-bottom: 10px;
      color: #666;
    }}
    .filters-wrap {{
      background: #fafafa;
      border: 1px solid #ececec;
      border-radius: 3px;
      padding: 10px;
      margin-bottom: 10px;
    }}
    .filters-wrap .form-group {{
      margin-right: 8px;
      margin-bottom: 8px;
      min-width: 200px;
      display: inline-block;
      vertical-align: top;
    }}
    .filters-wrap label {{
      display: block;
      font-size: 12px;
      color: #555;
      margin-bottom: 4px;
      font-weight: 600;
    }}
    .dataTables_wrapper .dataTables_filter {{
      display: none;
    }}
    .table > thead > tr > th {{
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }}
  </style>
</head>
<body>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <span class="navbar-brand">Anuário Estátístico</span>
      </div>
      {back_html}
    </div>
  </nav>
  <main class="container" style="padding-bottom:20px;">
    {body}
  </main>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.8/js/dataTables.bootstrap.min.js"></script>
  <script>
    function escapeRegex(text) {{
      return $.fn.dataTable.util.escapeRegex(text);
    }}

    function buildFilters(dt, tableId) {{
      var panel = document.querySelector('[data-filters-for="' + tableId + '"]');
      if (!panel) return;

      var row = document.createElement('div');
      row.className = 'row';

      var cols = dt.columns().header().toArray().map(function(h) {{ return h.textContent.trim(); }});
      cols.forEach(function(colName, idx) {{
        if (!colName || colName.toLowerCase().indexOf('unnamed') !== -1) return;

        var values = dt.column(idx).data().toArray().filter(function(v) {{
          return v !== null && v !== undefined && String(v).trim() !== '';
        }}).map(function(v) {{ return String(v).trim(); }});

        var unique = Array.from(new Set(values)).sort(function(a, b) {{
          return a.localeCompare(b, 'pt-BR', {{ numeric: true }});
        }});

        if (unique.length === 0 || unique.length > 250) return;

        var group = document.createElement('div');
        group.className = 'form-group';

        var label = document.createElement('label');
        label.textContent = colName;

        var select = document.createElement('select');
        select.className = 'form-control input-sm';

        var optAll = document.createElement('option');
        optAll.value = '';
        optAll.textContent = 'Todos';
        select.appendChild(optAll);

        unique.forEach(function(v) {{
          var op = document.createElement('option');
          op.value = v;
          op.textContent = v;
          select.appendChild(op);
        }});

        select.addEventListener('change', function() {{
          var val = this.value;
          if (val) {{
            dt.column(idx).search('^' + escapeRegex(val) + '$', true, false).draw();
          }} else {{
            dt.column(idx).search('', true, false).draw();
          }}
        }});

        group.appendChild(label);
        group.appendChild(select);
        row.appendChild(group);
      }});

      panel.appendChild(row);
    }}

    function initDataTables() {{
      $('.js-data-table').each(function() {{
        var tableId = this.id;
        var dt = $(this).DataTable({{
        pageLength: 25,
        lengthMenu: [10, 25, 50, 100],
          order: [],
        language: {{
          url: 'https://cdn.datatables.net/plug-ins/1.13.8/i18n/pt-BR.json'
        }}
      }});

        var searchInput = document.querySelector('[data-search-for="' + tableId + '"]');
        var clearBtn = document.querySelector('[data-clear-for="' + tableId + '"]');

        if (searchInput) {{
          searchInput.addEventListener('input', function() {{
            dt.search(this.value).draw();
          }});
        }}

        buildFilters(dt, tableId);

        if (clearBtn) {{
          clearBtn.addEventListener('click', function() {{
            dt.search('');
            dt.columns().search('');
            dt.draw();
            if (searchInput) searchInput.value = '';
            document.querySelectorAll('[data-filters-for="' + tableId + '"] select').forEach(function(s) {{
              s.value = '';
            }});
          }});
        }}
      }});
    }}

    document.addEventListener('DOMContentLoaded', initDataTables);
  </script>
</body>
</html>
"""


def main() -> None:
    if not TEMATICA_DIR.exists() or not SUBTEMA_DIR.exists():
        raise FileNotFoundError("Pastas de CSV não encontradas em repositorio_2025")

    temas_out = HTML_DIR / "temas"
    subtemas_out = HTML_DIR / "subtemas"
    temas_out.mkdir(parents=True, exist_ok=True)
    subtemas_out.mkdir(parents=True, exist_ok=True)

    tema_files = sorted(TEMATICA_DIR.glob("*.csv"))
    subtema_files = sorted(SUBTEMA_DIR.glob("*.csv"))

    links_temas = []
    for csv_file in tema_files:
        slug = csv_file.stem
        out_file = temas_out / f"{slug}.html"
        df = pd.read_csv(csv_file, nrows=500, low_memory=False)
        table_id = "tbl-main"
        tabela = dataframe_preview_html(df, table_id=table_id)
        total = sum(1 for _ in open(csv_file, "r", encoding="utf-8-sig", errors="ignore")) - 1
        csv_rel = Path("../../") / csv_file.relative_to(BASE_DIR)
        body = f"""
<div class="chart-wrapper">
  <div class="chart-title"><strong>{html.escape(slug_to_title(slug))}</strong></div>
  <div class="chart-stage">
    <div class="table-meta">Preview das primeiras 500 linhas. Total estimado: <strong>{format_num(total)}</strong> linhas.</div>
    <div class="filters-wrap">
      <div class="form-inline" style="margin-bottom:8px;">
        <div class="form-group" style="min-width:300px;">
          <label>Busca geral</label>
          <input type="text" class="form-control input-sm" data-search-for="{table_id}" placeholder="Pesquisar na tabela...">
        </div>
        <div class="form-group" style="min-width:120px;">
          <label>&nbsp;</label>
          <button type="button" class="btn btn-default btn-sm form-control" data-clear-for="{table_id}">Limpar filtros</button>
        </div>
        <div class="form-group" style="min-width:180px;">
          <label>&nbsp;</label>
          <a class="btn btn-primary btn-sm form-control" href="{csv_rel.as_posix()}">Baixar CSV completo</a>
        </div>
      </div>
      <div data-filters-for="{table_id}"></div>
    </div>
    <div class="table-responsive">{tabela}</div>
  </div>
</div>
"""
        out_file.write_text(page_template(f"Tema - {slug_to_title(slug)}", body, "../index.html"), encoding="utf-8")
        links_temas.append((slug_to_title(slug), f"temas/{slug}.html"))

    links_subtemas = []
    for csv_file in subtema_files:
        slug = csv_file.stem
        out_file = subtemas_out / f"{slug}.html"
        df = pd.read_csv(csv_file, nrows=500, low_memory=False)
        table_id = "tbl-main"
        tabela = dataframe_preview_html(df, table_id=table_id)
        total = sum(1 for _ in open(csv_file, "r", encoding="utf-8-sig", errors="ignore")) - 1
        csv_rel = Path("../../") / csv_file.relative_to(BASE_DIR)
        body = f"""
<div class="chart-wrapper">
  <div class="chart-title"><strong>{html.escape(slug_to_title(slug))}</strong></div>
  <div class="chart-stage">
    <div class="table-meta">Preview das primeiras 500 linhas. Total estimado: <strong>{format_num(total)}</strong> linhas.</div>
    <div class="filters-wrap">
      <div class="form-inline" style="margin-bottom:8px;">
        <div class="form-group" style="min-width:300px;">
          <label>Busca geral</label>
          <input type="text" class="form-control input-sm" data-search-for="{table_id}" placeholder="Pesquisar na tabela...">
        </div>
        <div class="form-group" style="min-width:120px;">
          <label>&nbsp;</label>
          <button type="button" class="btn btn-default btn-sm form-control" data-clear-for="{table_id}">Limpar filtros</button>
        </div>
        <div class="form-group" style="min-width:180px;">
          <label>&nbsp;</label>
          <a class="btn btn-primary btn-sm form-control" href="{csv_rel.as_posix()}">Baixar CSV completo</a>
        </div>
      </div>
      <div data-filters-for="{table_id}"></div>
    </div>
    <div class="table-responsive">{tabela}</div>
  </div>
</div>
"""
        out_file.write_text(page_template(f"Subtema - {slug_to_title(slug)}", body, "../index.html"), encoding="utf-8")
        links_subtemas.append((slug_to_title(slug), f"subtemas/{slug}.html"))

    temas_list = "\n".join(
        f'<li class="list-group-item"><a href="{html.escape(link)}">{html.escape(nome)}</a></li>'
        for nome, link in links_temas
    )
    subtemas_list = "\n".join(
        f'<li class="list-group-item"><a href="{html.escape(link)}">{html.escape(nome)}</a></li>'
        for nome, link in links_subtemas
    )

    index_body = f"""
<div class="chart-wrapper">
  <div class="chart-title"><strong>Repositório de Tabelas 2025</strong></div>
  <div class="chart-stage">
    <p>Selecione uma tabela por temática ou subtema.</p>
  </div>
</div>
<div class="row">
  <div class="col-sm-6">
    <div class="chart-wrapper"><div class="chart-title"><strong>Tabelas por temática ({len(links_temas)})</strong></div><div class="chart-stage">
      <ul class="list-group">{temas_list}</ul>
    </div></div>
  </div>
  <div class="col-sm-6">
    <div class="chart-wrapper"><div class="chart-title"><strong>Tabelas por subtema ({len(links_subtemas)})</strong></div><div class="chart-stage">
      <ul class="list-group">{subtemas_list}</ul>
    </div></div>
  </div>
</div>
"""

    (HTML_DIR / "index.html").write_text(page_template("Repositório 2025", index_body), encoding="utf-8")

    print(f"Páginas geradas em: {HTML_DIR}")
    print(f"Temas: {len(links_temas)} | Subtemas: {len(links_subtemas)}")


if __name__ == "__main__":
    main()