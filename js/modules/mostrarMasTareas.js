import { _actualtable, _tables } from "./variables.js";
import { cambiarIcono } from "./funciones.js";
import { listarRegistros } from "./listarRegistros.js";

/* Mostrar Más Tareas */
export function mostrarMasTareas() {
    const table = _actualtable.name;
    inhabilitarBotonMostrar();
    const limit = _tables[table].list.limit + 50;
    const listdata = { limit };
    listarRegistros(listdata);
}

function inhabilitarBotonMostrar() {
    const show_button = document.querySelector('#button-show');
    const show_icon = document.querySelector('#icon-show');
    show_button.classList.remove('active');
    cambiarIcono(show_icon, 'fa-plus', ['fa-cog', 'fa-spin']);
}
