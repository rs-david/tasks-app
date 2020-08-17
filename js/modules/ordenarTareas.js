import { actual } from "./variables.js";
import { listarTareas } from "./listarTareas.js";

/* Ordenar Tareas */
export async function ordenarTareas(e) {
    quitarEstadoOrdenar();

    const column = e.target.name;
    const sort = actual.sort == 'DESC' ? 'ASC' : 'DESC';
    await listarTareas(false, column, sort);

    agregarEstadoOrdenar(e);
}

function agregarEstadoOrdenar(e) {
    const link = e.target;
    const header = link.parentElement;
    const indicador = actual.sort == 'ASC' ? 'ascendente' : 'descendente';

    link.classList.add('active');
    header.classList.add(`${indicador}`);
}

function quitarEstadoOrdenar() {
    const activelink = document.querySelector('.encabezado a.active');
    const indicador = actual.sort == 'ASC' ? 'ascendente' : 'descendente';
    const activeheader = document.querySelector(`.encabezado.${indicador}`);

    activelink.classList.remove('active');
    activeheader.classList.remove(`${indicador}`);
}
