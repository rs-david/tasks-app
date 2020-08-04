import { search_name, clean_button, search_form, clean_icon } from "./elementosInterfaz.js";
import { cambiarIcono, deshabilitarElemento, enfocarElemento, habilitarElemento, vaciarFormulario } from "./funcionesInterfaz.js";
import { listarTareas } from "./listarTareas.js";

/* Limpiar Filtros */
export async function limpiarFiltros() {
    activarEstadoLimpiando();

    vaciarFormulario(search_form);
    await listarTareas(100);

    desactivarEstadoLimpiando();
    enfocarElemento(search_name);
}

function activarEstadoLimpiando() {
    deshabilitarElemento(clean_button);
    cambiarIcono(clean_icon, 'fa-eraser', ['fa-cog', 'fa-spin']);
}

function desactivarEstadoLimpiando() {
    habilitarElemento(clean_button);
    cambiarIcono(clean_icon, ['fa-cog', 'fa-spin'], 'fa-eraser');
}
