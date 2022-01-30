import { _save } from "./variables.js";
import { save_name, save_button, save_id, save_form, save_description } from "./elementos.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento, enfocarElemento } from "./funciones.js";
import { desactivarEstadoEditar } from "./estadoEditarTareas.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { buscarTareas } from "./buscarTareas.js";

/* Agregar/Actualizar Tareas */
export async function guardarTareas() {
    const task = crearTarea();
    
    if (task) {
        iniciarEstadoGuardando();

        const url = _save.type == 'update' ? 'tasks-update.php' : 'tasks-add.php';
        const response = await guardarTarea(task, url);
        
        if (response.error) console.log(response.error);
        else await buscarTareas();
        
        if (_save.type == 'update') desactivarEstadoEditar();
        else save_form.reset();
        
        terminarEstadoGuardando();
        enfocarElemento(save_name);
        mostrarNotificacion(response.content, response.type);
        
    } else {
        mostrarNotificacion('¡Llenar Todos Los Campos!', 'warning');
    }
}

function crearTarea() {
    const id = save_id.value;
    const name = save_name.value != '' ? save_name.value : false;
    const description = save_description.value != '' ? save_description.value : false;

    const task = name && description ? { id, name, description } : false;
    return task;
}

async function guardarTarea(tarea, direccion) {
    const data = new FormData();
    data.append('data', JSON.stringify(tarea));
    const response = await fetch(direccion, { method: 'post', body: data });
    const message = await response.json();
    return message;
}

function iniciarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    deshabilitarElemento(save_button);
    cambiarIcono(icon, 'fa-save', ['fa-cog', 'fa-spin']);
}

function terminarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    habilitarElemento(save_button);
    cambiarIcono(icon, ['fa-cog', 'fa-spin'], 'fa-save');
}

// function desactivarEstadoGuardar() {
//     if (_save.type == 'update') desactivarEstadoEditar();
//     else save_form.reset();
// }
