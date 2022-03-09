import { _tables } from "./variables.js";
import { table_tabs, table_title } from "./elementos.js";
import { listRecords } from "./listRecords.js";
import { loadSearchInputs } from "./loadSearchInputs.js";
import { loadListHeaders } from "./loadListHeaders.js";
import { loadSaveInputs } from "./loadSaveInputs.js";
import { prepareUpdate, cancelUpdate, resetSaveButton, toggleUpdate } from "./prepareUpdate.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { $ } from "./selectores.js";

table_tabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('table-tab')) {
    const tab = e.target;
    if (!tab.classList.contains('active')) {
      /* Load Table */
      const load = loadTable(tab.name);
      if (load) {
        /* Disable Active Tab */
        $('a.table-tab.active').classList.remove('active');
        /* Active New Tab */
        tab.classList.add('active');
      }
    }
    e.preventDefault();
  }
});

function loadTable(table) {
  if (!_tables[table]) {
    mostrarNotificacion('La Tabla No Existe', 'danger');
  } else {
    /* Current Table */
    resetSaveButton();
    /* New Table */
    loadSearchInputs(table);
    loadSaveInputs(table);
    loadListHeaders(table);
    listRecords({ table });
    updateTableTitle(table);

    if (_tables[table].savedata.savemode === 'update') {
      const { cardid } = _tables[table].savedata;
      prepareUpdate(table, cardid);
    }
    return true;
  }
}

function updateTableTitle(table) {
  table_title.textContent = table;
}
