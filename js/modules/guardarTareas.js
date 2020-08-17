import { save } from "./variables.js";
import { save_name, save_button, save_id, save_form, save_description } from "./elementos.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento, enfocarElemento } from "./funciones.js";
import { desactivarEstadoEditar } from "./estadoEditar.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { listarTareas } from "./listarTareas.js";

/* Guardar/Actualizar Tareas */
export async function guardarTareas() {
    iniciarEstadoGuardando();

    const task = crearTarea();
    const url = save.state == 'update' ? 'tasks-update.php' : 'tasks-add.php';
    const message = await registrarTarea(task, url);

    if (!message.error) await listarTareas();
    else console.log(message.error);

    desactivarEstadoGuardar();
    terminarEstadoGuardando();
    enfocarElemento(save_name);
    mostrarNotificacion(message.content, message.type);
}

function crearTarea() {
    const id = save_id.value;
    const name = save_name.value;
    const description = save_description.value;
    const task = JSON.stringify({ id, name, description });
    return task;
}

async function registrarTarea(tarea, direccion) {
    const data = new FormData();
    data.append('data', tarea);
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
    if (save.state == 'update') {
        const editcard = document.querySelector('.tarjeta.edit');
        desactivarEstadoEditar(editcard);
    }
    else save_form.reset();
}
