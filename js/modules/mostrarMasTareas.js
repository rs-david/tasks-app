import { _list } from "./variables.js";
import { cambiarIcono } from "./funciones.js";
import { listarTareas } from "./listarTareas.js";

/* Mostrar Más Tareas */
export function mostrarMasTareas() {
    agregarEstadoMostrando();
    const limit = _list.limit + 50;
    listarTareas(limit);
}

function agregarEstadoMostrando() {
    const show_button = document.querySelector('#button-show');
    const show_icon = document.querySelector('#icon-show');
    show_button.classList.remove('active');
    cambiarIcono(show_icon, 'fa-plus', ['fa-cog', 'fa-spin']);
}
