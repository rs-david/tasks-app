import { clean_button, search_form, clean_icon } from "./elementos.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento } from "./funciones.js";
import { listarRegistros } from "./listarRegistros.js";
import { _actualtable, _tables } from "./variables.js";

/* Limpiar Filtros */
export async function limpiarFiltros() {
    activarEstadoLimpiando();
    search_form.reset();
    vaciarSearchData();

    const listdata = { limit: 50 };
    await listarRegistros(listdata);

    desactivarEstadoLimpiando();
}

function vaciarSearchData() {
    const table = _actualtable.name;
    const searchdata = _tables[table].searchdata;
    for (const key in searchdata) searchdata[key] = '';
}

function activarEstadoLimpiando() {
    deshabilitarElemento(clean_button);
    cambiarIcono(clean_icon, 'fa-eraser', ['fa-cog', 'fa-spin']);
}

function desactivarEstadoLimpiando() {
    habilitarElemento(clean_button);
    cambiarIcono(clean_icon, ['fa-cog', 'fa-spin'], 'fa-eraser');
}
