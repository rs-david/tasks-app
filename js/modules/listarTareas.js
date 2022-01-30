import { _list, _save, _delete } from "./variables.js";
import { cards_container, counter_results, counter_totals, save_name, save_description } from "./elementos.js";
import { agregarClaseCSS, agregarContenido, cambiarContenido } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { actualizarEstadoEliminarVariasTareas } from "./estadoEliminarVariasTareas.js";

/* Funciones Para Listar Tareas */

// (object) listdata = { limit, column, sort }
// (object) searchdata = { id, name, description }
export async function listarTareas(listdata, searchdata) {
    const requestdata = generarDatosDePeticion(listdata, searchdata);
    const json = await obtenerTareasDelServidor(requestdata);
    
    if (!json.error) {
        actualizarVariables(requestdata.limit, requestdata.column, requestdata.sort);
        crearListaDeTareas(json);
        
        // console.log(); return
        actualizarEstadoEliminarVariasTareas();
        actualizarContadorTareasTotales(json.total);
        actualizarContadorTareasEncontradas(json.results);
    }
    else {
        console.log(json.error);
        mostrarNotificacion(json.message, json.type);
    }
}

function generarDatosDePeticion(listdata, searchdata) {
    // Datos de Lista.
    const limit = listdata && 'limit' in listdata ? listdata.limit : _list.limit;
    const column = listdata && 'column' in listdata ? listdata.column : _list.column;
    const sort = listdata && 'sort' in listdata ? listdata.sort : _list.sort;

    // Datos de Búsqueda (Filtros).
    const id = searchdata && 'id' in searchdata ? searchdata.id : '';
    const name = searchdata && 'name' in searchdata ? searchdata.name : '';
    const description = searchdata && 'description' in searchdata ? searchdata.description : '';

    const data = { limit, column, sort, id, name, description };
    return data;
}

async function obtenerTareasDelServidor(requestdata) {
    const data = new FormData();
    data.append('data', JSON.stringify(requestdata));
    const response = await fetch('tasks-list.php', { method: 'post', body: data });
    const json = await response.json();
    return json;
}

function actualizarVariables(limit, column, sort) {
    _list.limit = limit;
    _list.column = column;
    _list.sort = sort;
}

function crearListaDeTareas(json) {
    const results = json.results;

    if (results > 0) {
        cards_container.classList.remove('bg-green-tea', 'bg-happy-cup');

        const tasks = json.tasks;
        const cards = crearTarjetas(tasks);
        cambiarContenido(cards_container, cards);

        const finalcard = results <= _list.limit && results > 7 ? crearTarjetaFinal() : _list.limit <= results ? crearBotonMostrarMas() : false;
        if (finalcard) agregarContenido(cards_container, finalcard);
    }
    else if (results == 0) {

        const total = json.total;
        const background = total == 0 ? 'bg-green-tea' : 'bg-happy-cup';
        cambiarContenido(cards_container, '');
        agregarClaseCSS(cards_container, background);
    }
}

function crearTarjetas(tasks) {
    let cards = '';

    for (const task of tasks) {
        /* Atributos */
        // const taskidstring = String(task.id);
        const checkedattribute = _delete.keys.memory.length > 0 && _delete.keys.memory.includes(String(task.id)) ? 'checked' : '';
        const editclass = _save.type == 'update' && _save.id == task.id ? 'edit' : '';
        /* Contenido */
        const taskname = _save.type == 'update' && _save.id == task.id ? save_name.value : task.name;
        const taskdescription = _save.type == 'update' && _save.id == task.id ? save_description.value : task.description;

        const card = `
            <div id="tarjeta-${task.id}" class="tarjeta ${editclass}" data-id="${task.id}">
                <div class="contenido marcar" data-id="${task.id}">
                    <input id="checkbox-${task.id}" type="checkbox" class="checkbox" data-id="${task.id}" ${checkedattribute}>
                    <label for="checkbox-${task.id}" class="custom-checkbox" data-id="${task.id}"></label>
                </div>
                <div class="contenido id" data-id="${task.id}">${task.id}</div>
                <div class="contenido name" data-id="${task.id}">${taskname}</div>
                <div class="contenido description" data-id="${task.id}">${taskdescription}</div>
                <div class="contenido date" data-id="${task.id}">${task.date}</div>
                <div class="contenido actions" data-id="${task.id}">
                    <a id="button-edit-${task.id}" href="" class="boton-editar" title="Editar" data-id="${task.id}">
                        <i id="icon-edit-${task.id}" class="icono-editar fas fa-pen" data-id="${task.id}"></i>
                    </a>
                    <a id="button-delete-${task.id}" href="" class="boton-eliminar" title="Eliminar" data-id="${task.id}">
                        <i id="icon-delete-${task.id}" class="icono-eliminar fas fa-trash" data-id="${task.id}"></i>
                    </a>
                </div>
            </div>
        `;
        cards += card;
    }

    return cards;
}

function crearTarjetaFinal() {
    const finalcard = `
        <div id="end-card" class="tarjeta-final">
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
