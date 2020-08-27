import { _save } from "./variables.js";
import { save_name, save_button, save_id, save_form, save_description } from "./elementos.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento, enfocarElemento } from "./funciones.js";
import { desactivarEstadoEditar } from "./estadoEditar.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { listarTareas } from "./listarTareas.js";

/* Agregar/Actualizar Tareas */
export async function guardarTareas() {
    iniciarEstadoGuardando();

    const task = generarTarea();
    const url = _save.type == 'update' ? 'tasks-update.php' : 'tasks-add.php';
    const message = await guardar(task, url);

    if (message.error) console.log(message.error);
    else listarTareas();

    desactivarEstadoGuardar();
    terminarEstadoGuardando();
    enfocarElemento(save_name);
    mostrarNotificacion(message.content, message.type);
}

function generarTarea() {
    const id = save_id.value;
    const name = save_name.value;
    const description = save_description.value;
    const task = { id, name, description };
    return task;
}

async function guardar(tarea, direccion) {
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

function desactivarEstadoGuardar() {
    if (_save.type == 'update') {
        const editcard = document.querySelector('.tarjeta.edit');
        desactivarEstadoEditar(editcard);
    }
    else save_form.reset();
}
