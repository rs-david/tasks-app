import { _tables, _actualtable } from "./variables.js";
import { cambiarContenido, deshabilitarElemento, habilitarElemento } from "./funciones.js";
import { multiple_delete_button, multiple_delete_listselection, multiple_delete_memoryselection, headers_checkbox, counter_listselection, counter_memoryselection } from "./elementos.js";

/* Actualizar Estado "Eliminar Múltiples Tareas" */
export function actualizarEstadoEliminarVariasTareas(executorcheckbox, checkboxes) {
    const table = _actualtable.name;
    if (executorcheckbox) {
        if (executorcheckbox.id == 'headers-checkbox') {
            /* Eliminamos La Pequeña Línea Horizontal */
            if (executorcheckbox.classList.contains('minus')) executorcheckbox.classList.remove('minus');
            /* Activamos/Desactivamos Todos Los Checkbox De La Lista */
            for (const checkbox of checkboxes) checkbox.checked = headers_checkbox.checked;
            /* Agregamos/Eliminamos Las Claves En La Memoria */
            actualizarDatosEnMemoria(executorcheckbox, checkboxes, table);
        }
        else if (executorcheckbox.parentElement.classList.contains('card-checkbox')) {
            /* Agregamos/Eliminamos Las Claves En La Memoria */
            actualizarEstadoDeHeadersCheckbox();
            /* Agregamos/Eliminamos Las Claves En La Memoria */
            actualizarDatosEnMemoria(executorcheckbox, checkboxes, table);
        }
    }

    actualizarEstadoDeHeadersCheckbox();
    actualizarEstadoBotonEliminarVariasTareas(table);
    actualizarContadorTareasSeleccionadasEnLista();
    actualizarContadorTareasEnMemoria(table);
}

function actualizarDatosEnMemoria(checkbox, checkboxes, table) {
    if (checkbox.checked) agregarClaves(checkboxes, table);
    else removerClaves(checkboxes, table);
}

function agregarClaves(checkboxes, table) {
    for (const checkbox of checkboxes) _tables[table].deletedata.keys.memory.push(checkbox.dataset.id);
}

function removerClaves(checkboxes, table) {
    for (const checkbox of checkboxes) _tables[table].deletedata.keys.memory = _tables[table].deletedata.keys.memory.filter(key => key != checkbox.dataset.id);
}

export function actualizarEstadoBotonEliminarVariasTareas(table) {
    if (multiple_delete_listselection.checked) {
        const checkedcheckboxes = document.querySelectorAll('#cards input[type="checkbox"]:checked');
        if (checkedcheckboxes.length > 0) habilitarElemento(multiple_delete_button);
        else if (checkedcheckboxes.length <= 0) {
            if (!multiple_delete_button.hasAttribute('disabled')) multiple_delete_button.setAttribute('disabled', true);
        }
    }
    else if (multiple_delete_memoryselection.checked) {
        if (_tables[table].deletedata.keys.memory.length > 0) habilitarElemento(multiple_delete_button);
        else if (_tables[table].deletedata.keys.memory.length <= 0) {
            if (!multiple_delete_button.hasAttribute('disabled')) multiple_delete_button.setAttribute('disabled', true);
        }
    }
}

function actualizarEstadoDeHeadersCheckbox() {
    const checkboxes = document.querySelectorAll('.cards .custom-checkbox');
    const checkedcheckboxes = document.querySelectorAll('.cards .custom-checkbox:checked');

    /* Si Hay Checkboxes En La Lista & Todos Ellos Están Seleccionados Marcamos El Headers Checkbox */
    if (checkboxes.length > 0 && checkboxes.length == checkedcheckboxes.length) {
        headers_checkbox.checked = true;
        headers_checkbox.classList.remove('minus');
    }
    /* Si No Hay Checkboxes En La Lista Desmarcamos El Headers Checkbox */
    else if (checkedcheckboxes.length == 0) headers_checkbox.checked = false;
    /* Si Son Menos Checkboxes Marcados Que Los Existentes Marcamos Headers Checkbos Y Agregamos Una Pequeña Línea Horizontal */
    else if (checkboxes.length > checkedcheckboxes.length) {
        headers_checkbox.checked = true;
        headers_checkbox.classList.add('minus');
    }
}

function actualizarContadorTareasSeleccionadasEnLista() {
    const checkedcheckboxes = document.querySelectorAll('.card .custom-checkbox:checked');
    counter_listselection.innerHTML = checkedcheckboxes.length;
}

function actualizarContadorTareasEnMemoria(table) {
    counter_memoryselection.innerHTML = _tables[table].deletedata.keys.memory.length;
}
