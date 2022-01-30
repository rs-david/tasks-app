import { search_name, clean_button, search_form, clean_icon } from "./elementos.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento } from "./funciones.js";
import { listarTareas } from "./listarTareas.js";

/* Limpiar Filtros */
export async function limpiarFiltros() {
    activarEstadoLimpiando();
    search_form.reset();

    const listdata = { limit: 50 };
    await listarTareas(listdata);

    desactivarEstadoLimpiando();
    search_name.focus();
}

function activarEstadoLimpiando() {
    deshabilitarElemento(clean_button);
    cambiarIcono(clean_icon, 'fa-eraser', ['fa-cog', 'fa-spin']);
}

function desactivarEstadoLimpiando() {
    habilitarElemento(clean_button);
    cambiarIcono(clean_icon, ['fa-cog', 'fa-spin'], 'fa-eraser');
}
