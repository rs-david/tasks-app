import { save } from "./variablesInterfaz.js";
import { save_name, save_button, save_id, save_form, save_description } from "./elementosInterfaz.js";
import { cambiarIcono, deshabilitarElemento, enfocarElemento, habilitarElemento, vaciarFormulario } from "./funcionesInterfaz.js";
import { desactivarEstadoEditar } from "./estadoEditar.js";
import { mostrarNotificacion } from "./mostrarNotificaciones.js";
import { listarTareas } from "./listarTareas.js";

/* Guardar/Actualizar Tareas */
export async function guardarTareas() {
    agregarEstadoGuardando();

    const id = save_id.value;
    const name = save_name.value;
    const description = save_description.value;
    const json = JSON.stringify({ id, name, description });
    const url = save.state == 'update' ? 'tasks-update.php' : 'tasks-add.php';

    const data = new FormData();
    data.append('data', json);
    const response = await fetch(url, { method: 'post', body: data });
    const message = await response.json();

    if (message.error) console.log(message.error);
    else await listarTareas();

    if (save.state == 'update') {
        const editcard = document.querySelector('.tarjeta.edit');
        if (editcard) desactivarEstadoEditar(editcard);
        else desactivarEstadoEditar();
    }
    else vaciarFormulario(save_form);

    quitarEstadoGuardando();
    enfocarElemento(save_name);
    mostrarNotificacion(message.content, message.type);
}

function agregarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    deshabilitarElemento(save_button);
    cambiarIcono(icon, 'fa-save', ['fa-cog', 'fa-spin']);
}

function quitarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    habilitarElemento(save_button);
    cambiarIcono(icon, ['fa-cog', 'fa-spin'], 'fa-save');
}
