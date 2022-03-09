/* SORT RECORDS MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { headers } from "./elementos.js";
import { listRecords } from "./listRecords.js";
import { _tables } from "./variables.js";


//* ------------------------------------------------------------------------------------- Events *//
headers.addEventListener('click', e => {
    if (e.target.nodeName == 'A') {
        const headerlink = e.target;
        ordenarTareas(headerlink);
        e.preventDefault();
    }
});

//* ------------------------------------------------------------------------------------- Functions *//
async function ordenarTareas(headerlink) {
    const table = _tables.current;
    quitarEstadoOrdenar(table);
    
    const column = headerlink.name;
    const sort = _tables[table].list.sort == 'DESC' ? 'ASC' : 'DESC';
    const listdata = { column, sort };

    await listRecords(listdata);
    agregarEstadoOrdenar(headerlink, table);
}

function agregarEstadoOrdenar(headerlink, table) {
    const indicador = _tables[table].list.sort == 'ASC' ? 'ascendente' : 'descendente';
    headerlink.classList.add('active', `${indicador}`);
}

function quitarEstadoOrdenar(table) {
    const indicador = _tables[table].list.sort == 'ASC' ? 'ascendente' : 'descendente';
    const activelink = document.querySelector('.header a.active');
    activelink.classList.remove('active', `${indicador}`);
}

/* Estado Ordenar:
    - Activar Header (Resaltar).
    - Agregar Indicador De Orden.
*/