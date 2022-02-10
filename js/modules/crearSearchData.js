
export function crearSearchData() {
    const searchdata = {};

    /* Obtener Valores de Inputs de Búsqueda */
    const searchinputs = document.querySelectorAll('#search-form input');
    for (const searchinput of searchinputs) {
        const inputname = searchinput.name;
        const inputvalue = searchinput.value;
        searchdata[inputname] = inputvalue;
    }

    return searchdata;
}
