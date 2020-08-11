import { save_id, multiple_delete_button, checkbox_master, delete_buttonclose, delete_button, delete_buttoncancel, delete_icon, overlay, delete_modal } from "./elementosInterfaz.js";
import { keys, save } from "./variablesInterfaz.js";
import { cambiarIcono, habilitarElemento, deshabilitarElemento } from "./funcionesInterfaz.js";
import { listarTareas } from "./listarTareas.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { desactivarEstadoEditar } from "./estadoEditar.js";

/* Eliminar Tareas */
export async function eliminarTareas() {
    agregarEstadoEliminando();

    if (save.state == 'update' && keys.delete.includes(save_id.value)) {
        const editcard = document.querySelector('.tarjeta.edit');
        if (editcard) desactivarEstadoEditar(editcard);
        else desactivarEstadoEditar();
    }

    const json = JSON.stringify(keys.delete);
    const data = new FormData();
    data.append('data', json);
    const response = await fetch('tasks-delete.php', { method: 'post', body: data });
    const message = await response.json();

    if (!multiple_delete_button.hasAttribute('disabled')) deshabilitarElemento(multiple_delete_button);
    if (checkbox_master.checked) checkbox_master.checked = false;

    if (message.error) console.log(message.error);
    else await listarTareas();

    quitarEstadoEliminando();

    desactivarEstadoEliminar();
    mostrarNotificacion(message.content, message.type);
}

export function activarEstadoEliminar(claves) {
    abrirAlertaEliminar();
    keys.delete = claves;
}

export function desactivarEstadoEliminar() {
    cerrarAlertaEliminar();
    keys.delete = [];
}

function agregarEstadoEliminando() {
    deshabilitarElemento(delete_buttonclose);
    deshabilitarElemento(delete_button);
    deshabilitarElemento(delete_buttoncancel);
    cambiarIcono(delete_icon, 'fa-trash', ['fa-cog', 'fa-spin']);
}

function quitarEstadoEliminando() {
    habilitarElemento(delete_buttonclose);
    habilitarElemento(delete_button);
    habilitarElemento(delete_buttoncancel);
    cambiarIcono(delete_icon, ['fa-cog', 'fa-spin'], 'fa-trash');
}

function abrirAlertaEliminar() {
    overlay.classList.add('active');
    delete_modal.classList.add('active');
}

function cerrarAlertaEliminar() {
    overlay.classList.remove('active');
    delete_modal.classList.remove('active');
}

export function obtenerClavesDeCasillasSeleccionadas() {
    const checkboxes = document.querySelectorAll('.tareas .checkbox:checked');
    if (checkboxes.length > 0) {
        const keys = [];
        for (const checkbox of checkboxes) keys.push(checkbox.dataset.id);
        return keys;
    }
}
