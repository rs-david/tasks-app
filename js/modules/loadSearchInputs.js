/* LOAD SEARCH INPUTS MODULE*/

//* ------------------------------------------------------------------------------------- Imports *//
import { cleanfilters_button, search_form } from "./elementos.js";
import { _tables } from "./variables.js";

//* ------------------------------------------------------------------------------------- Functions *//
export function loadSearchInputs(table) {
    /* Remover Inputs Actuales */
    const actualinputs = document.querySelectorAll('#search-form input');
    if (actualinputs) for (const input of actualinputs) input.remove();

    /* Crear Inputs Nuevos */
    const inputnames = _tables[table].searchinputs;
    const newinputs = [];
    if (inputnames.length > 0) {
        for (const inputname of inputnames) {
            const newinput = createSearchInput(inputname, table);
            newinputs.push(newinput);
        }
    }

    /* Insertar Inputs Nuevos Al Formulario De Búsqueda */
    if (newinputs.length > 0) {
        for (const newinput of newinputs) {
            search_form.insertBefore(newinput, cleanfilters_button);
        }
    }
}

function createSearchInput(inputname, table) {
    const searchinput = document.createElement("input");
    searchinput.id = `search-${inputname}`;
    searchinput.className = `search-${inputname} form-input`;
    searchinput.name = inputname;
    const typeinput = inputname == 'id' || inputname == 'price' ? 'number' : 'search';
    searchinput.type = typeinput;
    const typesearch = inputname == 'id' ? 'Clave' : inputname == 'name' ? 'Nombre' : inputname == 'description' ? 'Descripción' : inputname == 'price' ? 'Precio' : inputname == 'created' ? 'Creado' : inputname;
    searchinput.placeholder = `Buscar: ${typesearch}`;
    searchinput.value = _tables[table].searchdata[inputname];
    return searchinput;
}
