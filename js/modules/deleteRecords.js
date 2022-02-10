import { delete_buttonclose, delete_button, delete_buttoncancel, delete_icon, overlay, delete_modal, delete_quantity, delete_modaltitle } from "./elementos.js";
import { _tables, _actualtable } from "./variables.js";
import { cambiarIcono, habilitarElemento, deshabilitarElemento } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { desactivarEstadoEditar } from "./estadoEditarTareas.js";
import { listarRegistros } from "./listarRegistros.js";

/* Eliminar Tareas */
export async function deleteRecords() {
    iniciarEstadoEliminando();

    const table = _actualtable.name;
    const deletetype = _tables[table].deletedata.type;
    /* Obtener Claves De La Memoria */
    const keys = _tables[table].deletedata.keys[deletetype];
    /* Eliminar Registros En La Base De Datos */
    const message = await deleteRecordsOnDB(keys, table);
    if (!message.error) {
        /* Desactivar Estado Editar En Caso Que La Tarea En Edición Haya Sido Eliminada */
        if (_tables[table].savedata.type == 'update' && keys.includes(_tables[table].savedata.cardid)) desactivarEstadoEditar(table);
        /* Restablecer Memoria */
        restablecerMemoria(keys, table, deletetype);
        /* Listar Registros */
        await listarRegistros();

        mostrarNotificacion(message.content, message.type);
    } else {
        mostrarNotificacion('Ocurrio Un Error Al Intentar Eliminar El Registro', 'danger');
        console.log(message.error);
    }

    terminarEstadoEliminando();
    closeDeleteModal();
}

async function deleteRecordsOnDB(keys, table) {
    const data = new FormData();
    data.append('data', JSON.stringify({ keys, table }));
    const response = await fetch('tasks-delete.php', { method: 'post', body: data });
    const message = await response.json();
    return message;
}

function restablecerMemoria(keys, table, deletetype) {
    /* Eliminar De Memory Las Claves List O Individual Que Estén Ahí */
    if (deletetype == 'individual' || deletetype == 'list') {
        for (const key of keys) {
            _tables[table].deletedata.keys.memory = _tables[table].deletedata.keys.memory.filter(memorykey => memorykey != key);
        }
    }
    /* Restablecer Keys Correpondientes */
    _tables[table].deletedata.keys[deletetype] = [];
}

function iniciarEstadoEliminando() {
    deshabilitarElemento(delete_buttonclose);
    deshabilitarElemento(delete_button);
    deshabilitarElemento(delete_buttoncancel);
    cambiarIcono(delete_icon, 'fa-trash', ['fa-cog', 'fa-spin']);
}

function terminarEstadoEliminando() {
    habilitarElemento(delete_buttonclose);
    habilitarElemento(delete_button);
    habilitarElemento(delete_buttoncancel);
    cambiarIcono(delete_icon, ['fa-cog', 'fa-spin'], 'fa-trash');
}

export function openDeleteModal(deletetype, totalkeys) {
    cambiarContenidoDelModal(deletetype, totalkeys);
    overlay.classList.add('active');
    delete_modal.classList.add('active');
}

export function closeDeleteModal() {
    overlay.classList.remove('active');
    delete_modal.classList.remove('active');
}

function cambiarContenidoDelModal(deletetype, totalkeys) {
    delete_quantity.textContent = totalkeys;
    delete_modaltitle.textContent = deletetype == 'list' ? 'Lista' : deletetype == 'memory' ? 'Memoria' : deletetype == 'individual' ? 'Individual' : false;
}
