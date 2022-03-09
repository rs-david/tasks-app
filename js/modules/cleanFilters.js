/* CLEAN FILTERS MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { cleanfilters_button, search_form, cleanfilters_icon } from "./elementos.js";
import { cambiarIcono, disableElement, enableElement } from "./funciones.js";
import { listRecords } from "./listRecords.js";
import { _tables } from "./variables.js";

//* ------------------------------------------------------------------------------------- Events *//
cleanfilters_button.addEventListener('click', () => cleanFilters());

//* ------------------------------------------------------------------------------------- Functions *//
async function cleanFilters() {
  activarEstadoLimpiando();
  search_form.reset();
  resetSearchData();

  const listdata = { limit: 50 };
  await listRecords(listdata);

  desactivarEstadoLimpiando();
}

function resetSearchData() {
  const table = _tables.current;
  const { searchdata } = _tables[table];
  for (const key in searchdata) searchdata[key] = '';
}

function activarEstadoLimpiando() {
  disableElement(cleanfilters_button);
  cambiarIcono(cleanfilters_icon, 'fa-eraser', ['fa-cog', 'fa-spin']);
}

function desactivarEstadoLimpiando() {
  enableElement(cleanfilters_button);
  cambiarIcono(cleanfilters_icon, ['fa-cog', 'fa-spin'], 'fa-eraser');
}
