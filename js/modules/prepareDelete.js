import { delete_buttonclose, delete_button, delete_buttoncancel, overlay, cards_container, mdelete_form, mdelete_button, delete_modal, delete_quantity, delete_modaltitle } from "./elementos.js";
import { _tables } from "./variables.js";
import { disableElement } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { $, $$ } from "./selectores.js";

//* ----------------------------------- Prepare Delete *//
cards_container.addEventListener('click', (e) => {
    if (e.target.classList.contains('boton-eliminar')) {
        const key = [e.target.dataset.id];
        prepareDelete(_tables.current, 'individual', key);
        e.preventDefault();
    }
});
//* ----------------------------------- Prepare Multiple Delete *//
mdelete_form.addEventListener('submit', e => {
    prepareMultipleDelete();
    e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Delete' && !overlay.classList.contains('active') && !mdelete_button.hasAttribute('disabled') && !e.repeat) {
        e.preventDefault();
        prepareMultipleDelete();
    }
});

//* ----------------------------------- Cancel Delete *//
delete_buttonclose.addEventListener('click', e => {
    closeDeleteModal();
    e.preventDefault();
});
delete_buttoncancel.addEventListener('click', e => {
    closeDeleteModal();
    e.preventDefault();
});
overlay.addEventListener('click', e => {
    if (e.target.id === 'overlay' && !delete_button.hasAttribute('disabled')) {
        closeDeleteModal();
    }
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active') && !delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        if (!e.repeat)
            closeDeleteModal();
    }
});

function prepareMultipleDelete() {
    // multiple delete radio checked
    const mdradio = $('#multiple-delete-form input[type="radio"]:checked');
    if (mdradio) {
        const table = _tables.current;
        const deletetype = mdradio.dataset.deletetype;
        const keys = getKeys(table, deletetype);
        if (keys) prepareDelete(table, deletetype, keys);
    } else {
        mostrarNotificacion('Selecciona Qué Registros Eliminar', 'warning');
        disableElement(mdelete_button);
    }
}

function getKeys(table, deletetype) {
    if (deletetype === 'list') {
        // checked checkboxes
        const checkboxes = $$('#cards input[type="checkbox"]:checked');
        if (checkboxes.length > 0) {
            // list keys
            const keys = [];
            for (const checkbox of checkboxes) {
                const key = checkbox.dataset.id;
                keys.push(key);
            }
            return keys;
        } else {
            mostrarNotificacion('Selecciona Registros En Lista Primero', 'warning');
            disableElement(mdelete_button);
            return false;
        }
    } else if (deletetype === 'memory') {
        // memory keys
        const keys = _tables[table].delete.keys[deletetype];
        if (keys.length > 0) {
            return keys;
        } else {
            mostrarNotificacion('Almacena Registros En Memoria Primero', 'warning');
            disableElement(mdelete_button);
            return false;
        }
    }
}

function prepareDelete(table, deletetype, keys) {
    updateDeleteData(table, deletetype, keys);
    openDeleteModal(deletetype, keys.length);
}

function updateDeleteData(table, deletetype, keys) {
    /* Update Delete Type */
    _tables[table].delete.type = deletetype;
    /* Store Keys */
    if (deletetype === 'individual' || deletetype === 'list') {
        _tables[table].delete.keys[deletetype] = keys;
    }
}

function openDeleteModal(deletetype, totaldeletions) {
    updateModalContent(deletetype, totaldeletions);
    overlay.classList.add('active');
    delete_modal.classList.add('active');
}

export function closeDeleteModal() {
    overlay.classList.remove('active');
    delete_modal.classList.remove('active');
}

function updateModalContent(deletetype, totaldeletions) {
    delete_quantity.textContent = totaldeletions;
    delete_modaltitle.textContent = deletetype;
}
