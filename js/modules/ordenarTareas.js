import { _list } from "./variables.js";
import { buscarTareas } from "./buscarTareas.js";

/* Ordenar Tareas */
export async function ordenarTareas(link, header) {
    quitarEstadoOrdenar();

    const column = link.name;
    const sort = _list.sort == 'DESC' ? 'ASC' : 'DESC';
    const listdata = { column, sort };

    await buscarTareas(listdata);
    agregarEstadoOrdenar(link, header);
}

/* Estado Ordenar:
    - Link De Encabezado Resaltado (color verde).
    - Encabezado Con Indicador De Orden (triángulo verde).
*/

function agregarEstadoOrdenar(link, header) {
    const indicador = _list.sort == 'ASC' ? 'ascendente' : 'descendente';
    
    link.classList.add('active');
    header.classList.add(`${indicador}`);
}

function quitarEstadoOrdenar() {
    const indicador = _list.sort == 'ASC' ? 'ascendente' : 'descendente';
    const activelink = document.querySelector('.encabezado a.active');
    const activeheader = document.querySelector(`.encabezado.${indicador}`);

    activelink.classList.remove('active');
    activeheader.classList.remove(`${indicador}`);
}
