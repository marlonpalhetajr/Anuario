// Hierarchical filter behavior for repository table filters.
(function() {
  function normalizeLabel(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function toPlainText(value) {
    return $("<div>").html(value == null ? "" : String(value)).text().trim();
  }

  function normalizeValue(value) {
    return normalizeLabel(toPlainText(value));
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || value === "") return [];

    if (typeof value === "string") {
      var trimmed = value.trim();
      if ((trimmed.charAt(0) === "[" && trimmed.charAt(trimmed.length - 1) === "]") ||
          (trimmed.charAt(0) === '"' && trimmed.charAt(trimmed.length - 1) === '"')) {
        try {
          var parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (_e) {
          // Keep fallback below when value is not valid JSON.
        }
      }
    }

    return [value];
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(function(v) { return v !== null && v !== undefined && v !== ""; })))
      .map(function(v) { return toPlainText(v); })
      .sort(function(a, b) { return a.localeCompare(b, "pt-BR"); });
  }

  function findColumnIndexes(table) {
    var idx = {
      indicador: -1,
      categoria: -1,
      regiao: -1,
      localidade: -1
    };

    table.columns().every(function(colIdx) {
      var label = normalizeLabel($(table.column(colIdx).header()).text());
      if (label.indexOf("indicador") !== -1) idx.indicador = colIdx;
      if (label.indexOf("categoria") !== -1) idx.categoria = colIdx;
      if (label.indexOf("regiao de integracao") !== -1 || label.indexOf("regiao") !== -1) idx.regiao = colIdx;
      if (label.indexOf("localidade") !== -1 || label.indexOf("municipio") !== -1) idx.localidade = colIdx;
    });

    return idx;
  }

  function getSelectizeForColumn(table, colIdx) {
    if (colIdx < 0) return null;
    var filterRowCells = $(table.table().header()).find("tr:last th, tr:last td");
    var td = filterRowCells.eq(colIdx);
    if (!td.length) return null;
    var input = td.find(".selectized").eq(0).get(0);
    return input && input.selectize ? input.selectize : null;
  }

  function rebuildChildOptions(childSelectize, allowedValues) {
    if (!childSelectize) return;
    var allowed = uniqueSorted(allowedValues);
    var allowedSet = new Set(allowed);
    var current = asArray(childSelectize.getValue()).map(function(v) { return String(v); });
    var kept = current.filter(function(v) { return allowedSet.has(v); });

    childSelectize.clearOptions();
    childSelectize.addOption(
      allowed.map(function(v) {
        return { value: v, text: v };
      })
    );
    childSelectize.refreshOptions(false);
    childSelectize.setValue(kept, true);
  }

  function setupHierarchyForTable(table) {
    var tableNode = table.table().node();
    if (tableNode.__hierarchyFiltersSetupDone) return;

    var idx = findColumnIndexes(table);
    var hasIndicatorCategory = idx.indicador >= 0 && idx.categoria >= 0;
    var hasRegionLocality = idx.regiao >= 0 && idx.localidade >= 0;
    if (!hasIndicatorCategory && !hasRegionLocality) return;

    var rows = table.rows().data().toArray();
    var selectizeByColumn = {};

    table.columns().every(function(colIdx) {
      var sel = getSelectizeForColumn(table, colIdx);
      if (sel) selectizeByColumn[colIdx] = sel;
    });

    function collectSelections() {
      var selections = {};
      Object.keys(selectizeByColumn).forEach(function(colKey) {
        selections[colKey] = new Set(
          asArray(selectizeByColumn[colKey].getValue()).map(function(v) {
            return normalizeValue(v);
          })
        );
      });
      return selections;
    }

    function valuesByParent(parentIdx, childIdx, selectedParents) {
      var selectedSet = new Set(selectedParents.map(function(v) { return normalizeValue(v); }));
      var selections = collectSelections();

      return rows
        .filter(function(row) {
          if (selectedSet.size && !selectedSet.has(normalizeValue(row[parentIdx]))) return false;

          for (var colKey in selections) {
            var colIdx = Number(colKey);
            if (colIdx === childIdx) continue;
            var selectedForCol = selections[colKey];
            if (selectedForCol.size && !selectedForCol.has(normalizeValue(row[colIdx]))) {
              return false;
            }
          }

          return true;
        })
        .map(function(row) { return toPlainText(row[childIdx]); });
    }

    var boundAnyHierarchy = false;

    if (hasIndicatorCategory) {
      var indicadorSel = getSelectizeForColumn(table, idx.indicador);
      var categoriaSel = getSelectizeForColumn(table, idx.categoria);
      if (indicadorSel && categoriaSel) {
        var syncCategoria = function() {
          var selectedIndicadores = asArray(indicadorSel.getValue());
          var categoriaValues = valuesByParent(idx.indicador, idx.categoria, selectedIndicadores);
          rebuildChildOptions(categoriaSel, categoriaValues);
        };
        indicadorSel.on("change", syncCategoria);
        syncCategoria();
        boundAnyHierarchy = true;
      }
    }

    if (hasRegionLocality) {
      var regiaoSel = getSelectizeForColumn(table, idx.regiao);
      var localidadeSel = getSelectizeForColumn(table, idx.localidade);
      if (regiaoSel && localidadeSel) {
        var syncLocalidade = function() {
          var selectedRegioes = asArray(regiaoSel.getValue());
          var localidadeValues = valuesByParent(idx.regiao, idx.localidade, selectedRegioes);
          rebuildChildOptions(localidadeSel, localidadeValues);
        };
        regiaoSel.on("change", syncLocalidade);
        syncLocalidade();
        boundAnyHierarchy = true;
      }
    }

    if (boundAnyHierarchy) {
      tableNode.__hierarchyFiltersSetupDone = true;
      tableNode.__hierarchyRetryCount = 0;
    } else {
      var retryCount = tableNode.__hierarchyRetryCount || 0;
      if (retryCount < 30) {
        tableNode.__hierarchyRetryCount = retryCount + 1;
        setTimeout(function() {
          setupHierarchyForTable(table);
        }, 200);
      }
    }
  }

  function initializeHierarchies() {
    $.fn.dataTable.tables({ api: true }).every(function() {
      setupHierarchyForTable(this);
    });
  }

  $(document).ready(function() {
    initializeHierarchies();
    $(document).on("init.dt", function(_e, settings) {
      setupHierarchyForTable(new $.fn.dataTable.Api(settings));
    });
  });
})();
