/* CAMBIAR SEARCH INPUTS */

import { clean_button, search_form } from "./elementos.js";
import { _tables } from "./variables.js";

export function changeSearchInputs(table) {
    /* Eliminar Inputs Actuales */
    const actualinputs = document.querySelectorAll('#search-form input');
    if (actualinputs) for (const input of actualinputs) input.remove();

    /* Crear Inputs Nuevos */
    const memoryinputs = _tables[table].searchinputs;
    const newinputs = [];
    if (memoryinputs.length > 0) {
        for (const memoryinput of memoryinputs) {
            const newinput = createSearchInput(memoryinput, table);
            newinputs.push(newinput);
        }
    }

    /* Insertar Inputs Nuevos al Formulario de Búsqueda */
    if (newinputs.length > 0) {
        for (const newinput of newinputs) {
            search_form.insertBefore(newinput, clean_button);
        }
    }
}

function createSearchInput(memoryinput, table) {
    const searchinput = document.createElement("input");
    searchinput.id = `search-${memoryinput}`;
    searchinput.className = `search-${memoryinput} form-input`;
    searchinput.name = memoryinput;
    const typeinput = memoryinput == 'id' || memoryinput == 'price' ? 'number' : 'search';
    searchinput.type = typeinput;
    const typesearch = memoryinput == 'id' ? 'Clave' : memoryinput == 'name' ? 'Nombre' : memoryinput == 'description' ? 'Descripción' : memoryinput == 'price' ? 'Precio' : memoryinput == 'created' ? 'Creado' : memoryinput;
    searchinput.placeholder = `Buscar: ${typesearch}`;
    searchinput.value = _tables[table].searchdata[memoryinput];
    return searchinput;
}