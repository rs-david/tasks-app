import { search_name, clean_button, search_form, clean_icon } from "./elementosInterfaz.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento } from "./funcionesInterfaz.js";
import { listarTareas } from "./listarTareas.js";

/* Limpiar Filtros */
export async function limpiarFiltros() {
    activarEstadoLimpiando();

    search_form.reset();
    await listarTareas(100);

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
