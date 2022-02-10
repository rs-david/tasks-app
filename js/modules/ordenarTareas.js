import { listarRegistros } from "./listarRegistros.js";
import { _actualtable, _tables } from "./variables.js";

/* Ordenar Tareas */
export async function ordenarTareas(headerlink) {
    const table = _actualtable.name;
    quitarEstadoOrdenar(table);
    
    const column = headerlink.name;
    const sort = _tables[table].list.sort == 'DESC' ? 'ASC' : 'DESC';
    const listdata = { column, sort };

    await listarRegistros(listdata);
    agregarEstadoOrdenar(headerlink, table);
}

/* Estado Ordenar:
    - Activar Header (Resaltar).
    - Agregar Indicador De Orden.
*/

function agregarEstadoOrdenar(headerlink, table) {
    const indicador = _tables[table].list.sort == 'ASC' ? 'ascendente' : 'descendente';
    headerlink.classList.add('active', `${indicador}`);
}

function quitarEstadoOrdenar(table) {
    const indicador = _tables[table].list.sort == 'ASC' ? 'ascendente' : 'descendente';
    const activelink = document.querySelector('.header a.active');
    activelink.classList.remove('active', `${indicador}`);
}
