import { actual, save } from "./variablesInterfaz.js";
import { search_id, search_name, search_description, cards_container, save_id, checkbox_master, multiple_delete_button } from "./elementosInterfaz.js";
import { agregarClase, agregarContenido, cambiarContenido, deshabilitarElemento, marcarCasillas } from "./funcionesInterfaz.js";
import { actualizarContadores } from "./actualizarContadores.js";
import { mostrarNotificacion } from "./notificaciones.js";

/* Listar Tareas */
export async function listarTareas(limite, columna, orden) {
    const id = search_id.value;
    const name = search_name.value;
    const description = search_description.value;
    const limit = limite ? limite : actual.limit;
    const column = columna ? columna : actual.column;
    const sort = orden ? orden : actual.sort;

    const data = JSON.stringify({ id, name, description, limit, column, sort });
    const tasks = await traerTareas(data);
    
    if (!tasks.error) {
        actualizarVariables(limit, column, sort);
        crearListaTareas(tasks);
    }
    else {
        mostrarNotificacion(tasks.message, tasks.type);
        console.log(tasks.error);
    }
}

async function traerTareas(datos) {
    const data = new FormData();
    data.append('data', datos);
    const response = await fetch('tasks-list.php', { method: 'post', body: data });
    const tasks = await response.json();
    return tasks;
}

function actualizarVariables(limite, columna, orden) {
    actual.limit = limite;
    actual.column = columna;
    actual.sort = orden;
    return actual;
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

        const finalcard = actual.limit >= results && results > 7 ? crearTarjetaFinal() : actual.limit <= results ? crearBotonMostrarMas() : false;
        if (finalcard) agregarContenido(cards_container, finalcard);

        if (save.state == 'update') {
            const editcard = document.querySelector(`#tarjeta-${save_id.value}`);
            if (editcard) editcard.classList.add('edit');
        }

        if (checkbox_master.checked) {
            const checkboxes = document.querySelectorAll('.tarjeta .checkbox');
            marcarCasillas(checkboxes);
        }
    }

    const checkedcheckboxes = document.querySelectorAll('.tarjeta .checkbox:checked');
    if (!multiple_delete_button.hasAttribute('disabled') && checkedcheckboxes.length < 1) deshabilitarElemento(multiple_delete_button);
    actualizarContadores(total, results, checkedcheckboxes.length);
}

function crearTarjetas(tareas) {
    let cards = '';

    for (const tarea of tareas) {
        const card = `
            <div id="tarjeta-${tarea.id}" class="tarjeta" data-id="${tarea.id}">
                <div class="contenido marcar" data-id="${tarea.id}">
                    <input id="checkbox-${tarea.id}" type="checkbox" class="checkbox" data-id="${tarea.id}">
                    <label for="checkbox-${tarea.id}" class="custom-checkbox" data-id="${tarea.id}"></label>
                </div>
                <div class="contenido id" data-id="${tarea.id}">${tarea.id}</div>
                <div class="contenido name" data-id="${tarea.id}">${tarea.name}</div>
                <div class="contenido description" data-id="${tarea.id}">${tarea.description}</div>
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
