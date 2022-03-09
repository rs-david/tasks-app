import { delete_buttonclose, delete_button, delete_buttoncancel, delete_icon, delete_modal, delete_form } from "./elementos.js";
import { _tables } from "./variables.js";
import { cambiarIcono, enableElement, disableElement } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { cancelUpdate } from "./prepareUpdate.js";
import { listRecords } from "./listRecords.js";
import { closeDeleteModal } from "./prepareDelete.js";


delete_form.addEventListener('submit', e => {
    deleteRecords(_tables.current);
    e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Enter' && !e.repeat && delete_modal.classList.contains('active') && !delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        deleteRecords(_tables.current);
    }
});

/* Eliminar Tareas */
async function deleteRecords(table) {
    startDeletingMode();

    const deletetype = _tables[table].delete.type;
    /* Obtener Claves De Delete Data */
    const keys = _tables[table].delete.keys[deletetype];
    /* Eliminar Registros En La Base De Datos */
    const message = await deleteRecordsOnDB(keys, table);
    if (!message.error) {
        /* Cancel Record Updating If Record Was Deleted */
        if (_tables[table].savedata.savemode == 'update' && keys.includes(_tables[table].savedata.cardid)) cancelUpdate(table);
        updateDeleteData(table, deletetype, keys);
        await listRecords();
        mostrarNotificacion(message.content, message.type);
    } else {
        mostrarNotificacion('Error En El Servidor: Delete Records', 'danger');
    }

    finishDeletingMode();
    closeDeleteModal();
}

async function deleteRecordsOnDB(keys, table) {
    const data = new FormData();
    data.append('data', JSON.stringify({ keys, table }));
    const response = await fetch('tasks-delete.php', { method: 'post', body: data });
    const message = await response.json();
    return message;
}

function updateDeleteData(table, deletetype, deletedkeys) {
    /* Update Memory Keys */
    if (deletetype === 'individual' || deletetype === 'list') {
        /* Remove Deleted Keys Inside Memory Keys */
        for (const deletedkey of deletedkeys) {
            // filtered memory keys
            const fmk = _tables[table].delete.keys.memory.filter((memorykey) => memorykey != deletedkey);
            _tables[table].delete.keys.memory = fmk;
        }
    }
    /* Remove Corresponding Keys  */
    _tables[table].delete.keys[deletetype] = [];
    /* Reset Delete Type */
    _tables[table].delete.type = '';
}

function startDeletingMode() {
    disableElement(delete_buttonclose);
    disableElement(delete_button);
    disableElement(delete_buttoncancel);
    cambiarIcono(delete_icon, 'fa-trash', ['fa-cog', 'fa-spin']);
}

function finishDeletingMode() {
    enableElement(delete_buttonclose);
    enableElement(delete_button);
    enableElement(delete_buttoncancel);
    cambiarIcono(delete_icon, ['fa-cog', 'fa-spin'], 'fa-trash');
}
