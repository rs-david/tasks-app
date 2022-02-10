/* CAMBIAR HEADERS */

import { actions_header, headerslist } from "./elementos.js";
import { _tables } from "./variables.js";

export function changeHeaders(table) {

    /* Eliminar & Ocultar Headers Actuales */
    const permanentheaders = document.querySelectorAll('#headers .header.perm-header');
    if (permanentheaders) for (const permheader of permanentheaders) permheader.classList.add('display-none');
    
    const temporaryheaders = document.querySelectorAll('#headers .header.temp-header');
    if (temporaryheaders) for (const tempheader of temporaryheaders) tempheader.remove();
    
    /* Crear Headers Nuevos */
    const memoryheaders = _tables[table].headers;
    const newtempheaders = [];
    if (memoryheaders.length > 0) {
        for (const memoryheader of memoryheaders) {
            const newtempheader = createTempHeader(memoryheader, table);
            newtempheaders.push(newtempheader);
        }
    }
    
    /* Agregar & Mostrar Headers Nuevos */
    if (permanentheaders) for (const permheader of permanentheaders) permheader.classList.remove('display-none');
    if (newtempheaders.length > 0) {
        for (const newtempheader of newtempheaders) {
            headerslist.insertBefore(newtempheader, actions_header);
        }
    }
    
}


function createTempHeader(memoryheader, table) {
    /* Crear Header */
    const tempheader = document.createElement("li");
    tempheader.className = `header ${memoryheader}-header temp-header`;

    /* Crear Header Link */
    const tempheaderlink = document.createElement("a");
    tempheaderlink.id = `${memoryheader}-header`;
    const activeclass = memoryheader == _tables[table].list.column ? 'active' : '';
    const sortclass = activeclass == 'active' && _tables[table].list.sort == 'ASC' ? 'ascendente' : activeclass == 'active' && _tables[table].list.sort == 'DESC' ? 'descendente' : '';
    tempheaderlink.className = `header-link ${activeclass} ${sortclass}`;
    tempheaderlink.name = `${memoryheader}`;
    tempheaderlink.href = ``;
    const tempheadertitle = memoryheader == 'id' ? 'Clave' : memoryheader == 'name' ? 'Nombre' : memoryheader == 'description' ? 'Descripción' : memoryheader == 'price' ? 'Precio' : memoryheader == 'created' ? 'Creado' : memoryheader;
    tempheaderlink.title = `Ordenar × ${tempheadertitle}`;
    const tempheadertext = memoryheader == 'id' ? '#' : memoryheader == 'name' ? 'Nombre' : memoryheader == 'description' ? 'Descripción' : memoryheader == 'price' ? 'Precio' : memoryheader == 'created' ? 'Creado' : memoryheader;
    tempheaderlink.textContent = tempheadertext;

    /* Insertar Header Link en Header */
    tempheader.appendChild(tempheaderlink);

    return tempheader;
}