import { _tables } from "./variables.js";
import { cards_container, results_counter, totals_counter } from "./elementos.js";
import { vaciarElemento } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { updateMultipleDeleteStatus } from "./multipleDeleteStatus.js";

/* Funciones Para Listar Regitros */
export async function listRecords(listdata, searchdata) {
    const requestdata = construirDatosDePeticion(listdata, searchdata);
    const response = await obtenerRegistrosDelServidor(requestdata);

    if (!response.error) {
        updateTableData(requestdata);
        createList(response.records, response.table, response['total-records'], response['total-results']);

        updateMultipleDeleteStatus(response.table);
        // Actualizar Datos De Los Contadores.
        totals_counter.textContent = response['total-records'];
        results_counter.textContent = response['total-results'];
    }
    else {
        mostrarNotificacion('Error En El Servidor', 'danger', 3000);
        console.log(response.error);
    }
}

function construirDatosDePeticion(listdata, searchdata) {
    const table = listdata?.table ? listdata.table : _tables.current;
    const limit = listdata?.limit ? listdata.limit : _tables[table].list.limit;
    const column = listdata?.column ? listdata.column : _tables[table].list.column;
    const sort = listdata?.sort ? listdata.sort : _tables[table].list.sort;
    const columns = listdata?.columns ? listdata.columns : _tables[table].list.columns;

    // Datos De Lista.
    const requestlistdata = { table, limit, column, sort, columns };

    // Datos De Búsqueda (Filtros).
    const requestsearchdata = searchdata ? searchdata : _tables[table].searchdata;

    // Request Data.
    const requestdata = { listdata: { ...requestlistdata }, searchdata: { ...requestsearchdata } };
    return requestdata;
}

async function obtenerRegistrosDelServidor(requestdata) {
    const data = new FormData();
    data.append('data', JSON.stringify(requestdata));
    const response = await fetch('get-records.php', { method: 'post', body: data });
    const json = await response.json();
    return json;
}

function updateTableData(requestdata) {
    // Table
    const { table } = requestdata.listdata;
    _tables.current = table;

    // List Data
    _tables[table].list.limit = requestdata.listdata.limit;
    _tables[table].list.sort = requestdata.listdata.sort;
    _tables[table].list.column = requestdata.listdata.column;
    _tables[table].list.columns = requestdata.listdata.columns;

    // Search Data
    _tables[table].searchdata = requestdata.searchdata;

    const tabledata = _tables[table];
    return tabledata
}

// function createList(response) {
function createList(records, table, sumrecords, sumresults) {
    // Vaciar Lista
    vaciarElemento(cards_container);

    // Llenar Lista
    if (sumresults > 0) {
        // Remover Imagen Background.
        cards_container.classList.remove('bg-green-tea', 'bg-happy-cup');

        // Insertar Tarjetas.
        const cards = createCards(records, table);
        if (cards.length > 0) for (const card of cards) cards_container.append(card);

        // Insertar Elemento Final.
        const finalelement = sumresults <= _tables[table].list.limit && sumresults > 7 ? crearTarjetaFinal() : _tables[table].list.limit <= sumresults ? crearBotonMostrarMas() : false;
        if (finalelement) cards_container.insertAdjacentHTML('beforeend', finalelement);
    }
    else if (sumresults == 0) {
        // Agregar Imagen Background.
        const background = sumrecords == 0 ? 'bg-green-tea' : 'bg-happy-cup';
        cards_container.classList.add(background);
    }
}

function createCards(records, table) {

    const cards = [];

    for (const record of records) {

        // Crear Tarjeta.
        const card = document.createElement("div");
        card.id = `card-${record.id}`;
        const editclass = _tables[table].savedata.savemode == 'update' && _tables[table].savedata.cardid == record.id ? 'edit' : '';
        card.className = `card ${editclass}`;
        card.setAttribute('data-id', `${record.id}`);

        // Crear & Insertar Checkbox En La Tarjeta.
        const checkedattribute = _tables[table].delete.keys.memory.length > 0 && _tables[table].delete.keys.memory.includes(String(record.id)) ? 'checked' : '';
        const checkbox = `
            <div class="card-content card-checkbox" data-id="${record.id}">
                <input id="checkbox-${record.id}" type="checkbox" class="custom-checkbox" data-id="${record.id}" ${checkedattribute}>
                <label for="checkbox-${record.id}" class="custom-label" data-id="${record.id}"></label>
            </div>
        `;
        card.insertAdjacentHTML('afterbegin', checkbox);

        // Crear & Insertar Contenidos En La Tarjeta
        for (let column in record) {
            const content = document.createElement("div");
            content.className = `card-content ${column}-content`;
            content.setAttribute('data-id', `${record.id}`);
            content.textContent = record[column];
            card.append(content);
        }

        // Crear & Insertar Botones En La Tarjeta
        const actionbuttons = `
            <div class="card-content card-actions" data-id="${record.id}">
                <a id="button-edit-${record.id}" href="" class="boton-editar" title="Editar" data-id="${record.id}">
                    <i id="icon-edit-${record.id}" class="icono-editar fas fa-pen" data-id="${record.id}"></i>
                </a>
                <a id="button-delete-${record.id}" href="" class="boton-eliminar" title="Eliminar" data-id="${record.id}">
                    <i id="icon-delete-${record.id}" class="icono-eliminar fas fa-trash" data-id="${record.id}"></i>
                </a>
            </div>
        `;
        card.insertAdjacentHTML('beforeend', actionbuttons);

        // Agregar Tarjeta A "Cards"
        cards.push(card);
    }

    return cards;

}

function crearTarjetaFinal() {
    const finalcard = `
        <div id="end-card" class="final-card">
            <i class="fas fa-flag fa-sm"></i>
            <i class="fas fa-flag fa-lg flag-center" title="Final"></i>
            <i class="fas fa-flag fa-sm"></i>
        </div>
    `;
    return finalcard;
}

function crearBotonMostrarMas() {
    const showbutton = `
        <button id="button-show" class="boton-mostrar boton active" title="Mostrar Más Tareas">
            <i id="icon-show" class="fas fa-plus fa-lg"></i>
        </button>
    `;
    return showbutton;
}
