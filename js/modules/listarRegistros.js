import { _actualtable, _tables } from "./variables.js";
import { cards_container, counter_results, counter_totals } from "./elementos.js";
import { agregarClaseCSS, agregarContenido, cambiarContenido } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { actualizarEstadoEliminarVariasTareas } from "./estadoEliminarVariasTareas.js";

/* Funciones Para Listar Tareas */

// Datos: listdata = { table, limit, column, sort, columns }
// Datos: searchdata = { id, name, description, ... }
export async function listarRegistros(listdata, searchdata) {
    const requestdata = construirDatosDePeticion(listdata, searchdata);
    const json = await obtenerTareasDelServidor(requestdata);

    if (!json.error) {
        actualizarVariables(requestdata);
        crearListaDeTareas(json);

        actualizarEstadoEliminarVariasTareas();
        actualizarContadorTareasTotales(json.total);
        actualizarContadorTareasEncontradas(json.results);
    }
    else {
        console.log(json.error);
        mostrarNotificacion(json.message, json.type);
    }
}

function construirDatosDePeticion(listdata, searchdata) {
    // Datos de Lista.
    const table = listdata && 'table' in listdata ? listdata.table : _actualtable.name;
    const limit = listdata && 'limit' in listdata ? listdata.limit : _tables[table].list.limit;
    const column = listdata && 'column' in listdata ? listdata.column : _tables[table].list.column;
    const sort = listdata && 'sort' in listdata ? listdata.sort : _tables[table].list.sort;
    const columns = listdata && 'columns' in listdata ? listdata.columns : _tables[table].list.columns;
    /* list = final listdata */
    const list = { table, limit, column, sort, columns };

    // Datos de Búsqueda (Filtros).
    /* search = final searchdata */
    const search = searchdata ? searchdata : _tables[table].searchdata;

    const requestdata = { list: { ...list }, search: { ...search } }
    return requestdata
}

async function obtenerTareasDelServidor(requestdata) {
    const data = new FormData();
    data.append('data', JSON.stringify(requestdata));
    const response = await fetch('tasks-list.php', { method: 'post', body: data });
    const json = await response.json();
    return json;
}

function actualizarVariables(requestdata) {
    // Table
    const table = requestdata.list.table;
    _actualtable.name = table;

    // List Data
    _tables[table].list.limit = requestdata.list.limit;
    _tables[table].list.sort = requestdata.list.sort;
    _tables[table].list.column = requestdata.list.column;
    _tables[table].list.columns = requestdata.list.columns;

    // Search Data
    _tables[table].searchdata = requestdata.search;

    const tableinfo = _tables[table];
    return tableinfo
}

function crearListaDeTareas(json) {
    const table = json.table;
    const totalresults = json.results;
    cambiarContenido(cards_container, '');

    if (totalresults > 0) {
        cards_container.classList.remove('bg-green-tea', 'bg-happy-cup');

        const records = json.records;
        crearTarjetas(records, table);

        const finalcard = totalresults <= _tables[table].list.limit && totalresults > 7 ? crearTarjetaFinal() : _tables[table].list.limit <= totalresults ? crearBotonMostrarMas() : false;
        if (finalcard) agregarContenido(cards_container, finalcard);
    }
    else if (totalresults == 0) {
        const totalrecords = json.total;
        const background = totalrecords == 0 ? 'bg-green-tea' : 'bg-happy-cup';
        cambiarContenido(cards_container, '');
        agregarClaseCSS(cards_container, background);
    }
}

function crearTarjetas(records, table) {
    for (const record of records) {
        /* Atributos */
        const checkedattribute = _tables[table].deletedata.keys.memory.length > 0 && _tables[table].deletedata.keys.memory.includes(String(record.id)) ? 'checked' : '';
        const editclass = _tables[table].savedata.type == 'update' && _tables[table].savedata.cardid == record.id ? 'edit' : '';

        /* Crear Tarjeta */
        const card = document.createElement("div");
        card.id = `card-${record.id}`;
        card.className = `card ${editclass}`;
        card.setAttribute('data-id', `${record.id}`);

        /* Crear & Insertar Checkbox De La Tarjeta */
        const cardcheckbox = `
            <div class="card-content card-checkbox" data-id="${record.id}">
                <input id="checkbox-${record.id}" type="checkbox" class="custom-checkbox" data-id="${record.id}" ${checkedattribute}>
                <label for="checkbox-${record.id}" class="custom-label" data-id="${record.id}"></label>
            </div>
        `;
        card.innerHTML += cardcheckbox;

        /* Crear & Insertar Contenidos De La Tarjeta */
        for (let key in record) {
            const cardcontent = document.createElement("div");
            cardcontent.className = `card-content ${key}-content`;
            cardcontent.setAttribute('data-id', `${record.id}`);
            cardcontent.textContent = record[key];
            card.appendChild(cardcontent);
        }

        /* Crear & Insertar Botones De La Tarjeta */
        const cardactionbuttons = `
            <div class="card-content card-actions" data-id="${record.id}">
                <a id="button-edit-${record.id}" href="" class="boton-editar" title="Editar" data-id="${record.id}">
                    <i id="icon-edit-${record.id}" class="icono-editar fas fa-pen" data-id="${record.id}"></i>
                </a>
                <a id="button-delete-${record.id}" href="" class="boton-eliminar" title="Eliminar" data-id="${record.id}">
                    <i id="icon-delete-${record.id}" class="icono-eliminar fas fa-trash" data-id="${record.id}"></i>
                </a>
            </div>
        `;
        card.innerHTML += cardactionbuttons;

        /* Insertar Tarjeta En Crads Container */
        cards_container.appendChild(card);
    }
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

function actualizarContadorTareasEncontradas(results) {
    cambiarContenido(counter_results, results);
}

function actualizarContadorTareasTotales(total) {
    cambiarContenido(counter_totals, total);
}
