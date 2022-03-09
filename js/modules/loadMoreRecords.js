/* LOAD MORE RECORDS MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { _tables } from "./variables.js";
import { cambiarIcono } from "./funciones.js";
import { listRecords } from "./listRecords.js";
import { cards_container } from "./elementos.js";

//* ------------------------------------------------------------------------------------- Events *//
cards_container.addEventListener('click', e => {
    if (e.target.id == 'icon-show' || e.target.id == 'button-show') {
        loadMoreRecords();
    }
});

//* ------------------------------------------------------------------------------------- Functions *//
function loadMoreRecords() {
    const table = _tables.current;
    inhabilitarBotonMostrar();
    const limit = _tables[table].list.limit + 50;
    const listdata = { limit };
    listRecords(listdata);
}

function inhabilitarBotonMostrar() {
    const show_button = document.querySelector('#button-show');
    const show_icon = document.querySelector('#icon-show');
    show_button.classList.remove('active');
    cambiarIcono(show_icon, 'fa-plus', ['fa-cog', 'fa-spin']);
}
