import { _list, _save, _delete } from "./variables.js";
import { search_id, search_name, search_description, cards_container, counter_results, counter_totals, save_name, save_description } from "./elementos.js";
import { agregarClase, agregarContenido, cambiarContenido } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { actualizarEstadoEliminarVariasTareas } from "./estadoEliminarVariasTareas.js";

/* Listar Tareas */
export async function listarTareas(limite, columna, orden) {
    const request = generarPeticion(limite, columna, orden);
    const tasks = await obtenerTareas(request);

    if (!tasks.error) {
        actualizarVariables(request.limit, request.column, request.sort);
        const response = crearListaTareas(tasks);
        actualizarEstadoEliminarVariasTareas();
        actualizarContadorTareasTotales(response.total);
        actualizarContadorTareasEncontradas(response.results);
    }
    else {
        console.log(tasks.error);
        mostrarNotificacion(tasks.message, tasks.type);
    }
}

function generarPeticion(limite, columna, orden) {
    const id = search_id.value;
    const name = search_name.value;
    const description = search_description.value;

    const limit = limite ? limite : _list.limit;
    const column = columna ? columna : _list.column;
    const sort = orden ? orden : _list.sort;

    return { id, name, description, limit, column, sort }
}

async function obtenerTareas(peticion) {
    const data = new FormData();
    data.append('data', JSON.stringify(peticion));
    const response = await fetch('tasks-list.php', { method: 'post', body: data });
    const tasks = await response.json();
    return tasks;
}

function actualizarVariables(limite, columna, orden) {
    _list.limit = limite;
    _list.column = columna;
    _list.sort = orden;
}

function crearListaTareas(tareas) {
    const total = tareas[0] ? tareas[0].total : tareas.total;
    const results = tareas[0] ? tareas[0].results : tareas.results;

    if (results == 0) {
        const background = total == 0 ? 'bg-green-tea' : 'bg-happy-cup';
        cambiarContenido(cards_container, '');
        agregarClase(cards_container, background);
    }
    else {
        cards_container.classList.remove('bg-green-tea', 'bg-happy-cup');

        const cards = crearTarjetas(tareas);
        cambiarContenido(cards_container, cards);

        const finalcard = _list.limit >= results && results > 7 ? crearTarjetaFinal() : _list.limit <= results ? crearBotonMostrarMas() : false;
        if (finalcard) agregarContenido(cards_container, finalcard);
    }

    return { total, results }
}

function crearTarjetas(tareas) {
    let cards = '';

    for (const tarea of tareas) {
        const checkedattribute = _delete.keys.memory.length > 0 && _delete.keys.memory.includes(tarea.id) ? 'checked' : '';

        const editclass = _save.type == 'update' && _save.id == tarea.id ? 'edit' : '';
        const taskname = _save.type == 'update' && _save.id == tarea.id ? save_name.value : tarea.name;
        const taskdescription = _save.type == 'update' && _save.id == tarea.id ? save_description.value : tarea.description;

        const card = `
            <div id="tarjeta-${tarea.id}" class="tarjeta ${editclass}" data-id="${tarea.id}">
                <div class="contenido marcar" data-id="${tarea.id}">
                    <input id="checkbox-${tarea.id}" type="checkbox" class="checkbox" data-id="${tarea.id}" ${checkedattribute}>
                    <label for="checkbox-${tarea.id}" class="custom-checkbox" data-id="${tarea.id}"></label>
                </div>
                <div class="contenido id" data-id="${tarea.id}">${tarea.id}</div>
                <div class="contenido name" data-id="${tarea.id}">${taskname}</div>
                <div class="contenido description" data-id="${tarea.id}">${taskdescription}</div>
                <div class="contenido date" data-id="${tarea.id}">${tarea.date}</div>
                <div class="contenido actions" data-id="${tarea.id}">
                    <a id="button-edit-${tarea.id}" href="" class="boton-editar" title="Editar" data-id="${tarea.id}">
                        <i id="icon-edit-${tarea.id}" class="icono-editar fas fa-pen" data-id="${tarea.id}"></i>
                    </a>
                    <a id="button-delete-${tarea.id}" href="" class="boton-eliminar" title="Eliminar" data-id="${tarea.id}">
                        <i id="icon-delete-${tarea.id}" class="icono-eliminar fas fa-trash" data-id="${tarea.id}"></i>
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
            <i class="fas fa-flag fa-lg" title="Final"></i>
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

function actualizarContadorTareasEncontradas(resultados) {
    cambiarContenido(counter_results, resultados);
}

function actualizarContadorTareasTotales(total) {
    cambiarContenido(counter_totals, total);
}
