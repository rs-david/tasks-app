import { _delete } from "./variables.js";
import { cambiarContenido, deshabilitarElemento, habilitarElemento } from "./funciones.js";
import { multiple_delete_button, multiple_delete_listselection, multiple_delete_memoryselection, checkbox_master, counter_listselection, counter_memoryselection } from "./elementos.js";

/* Actualizar Estado "Eliminar Múltiples Tareas" */
export function actualizarEstadoEliminarVariasTareas(checkbox, checkboxes) {
    if (checkbox) {
        if (checkbox.id == 'checkbox-master') {
            checkbox.classList.remove('minus');
            alternarEstadoCheckboxesLista(checkboxes);
            actualizarDatosEnMemoria(checkbox, checkboxes);
        }
        else {
            alternarEstadoCheckboxMaster();
            actualizarDatosEnMemoria(checkbox);
        }
    }
    else alternarEstadoCheckboxMaster();

    alternarEstadoBotonEliminarVariasTareas();
    actualizarContadorTareasSeleccionadasEnLista();
    actualizarContadorTareasEnMemoria();
}

function alternarEstadoCheckboxesLista(checkboxes) {
    for (const checkbox of checkboxes) checkbox.checked = checkbox_master.checked;
}

function actualizarDatosEnMemoria(checkbox, checkboxes) {
    if (checkbox.id == 'checkbox-master') {
        if (checkbox_master.checked) agregarClaves(checkboxes);
        else removerClaves(checkboxes);
    }
    else {
        if (checkbox.checked) _delete.keys.memory.push(checkbox.dataset.id);
        else _delete.keys.memory = _delete.keys.memory.filter(key => key != checkbox.dataset.id);
    }
}

function agregarClaves(checkboxes) {
    for (const checkbox of checkboxes) _delete.keys.memory.push(checkbox.dataset.id);
}

function removerClaves(checkboxes) {
    for (const checkbox of checkboxes) _delete.keys.memory = _delete.keys.memory.filter(key => key != checkbox.dataset.id);
}

export function alternarEstadoBotonEliminarVariasTareas() {
    if (multiple_delete_listselection.checked) {
        const checkedcheckboxes = document.querySelectorAll('.tarjeta .checkbox:checked');
        if (checkedcheckboxes.length > 0) habilitarElemento(multiple_delete_button);
        else if (!multiple_delete_button.hasAttribute('disabled')) deshabilitarElemento(multiple_delete_button);
    }
    else if (multiple_delete_memoryselection.checked) {
        if (_delete.keys.memory.length > 0) habilitarElemento(multiple_delete_button);
        else if (!multiple_delete_button.hasAttribute('disabled')) deshabilitarElemento(multiple_delete_button);
    }
}

export function alternarEstadoCheckboxMaster() {
    const checkboxes = document.querySelectorAll('.tareas .checkbox');
    const checkedcheckboxes = document.querySelectorAll('.tareas .checkbox:checked');

    if (checkboxes.length > 0 && checkboxes.length == checkedcheckboxes.length) {
        checkbox_master.checked = true;
        checkbox_master.classList.remove('minus');
    }
    else if (checkedcheckboxes.length == 0) checkbox_master.checked = false;
    else if (checkboxes.length > checkedcheckboxes.length) {
        checkbox_master.checked = true;
        checkbox_master.classList.add('minus');
    }
}

function actualizarContadorTareasSeleccionadasEnLista() {
    const checked = document.querySelectorAll('.tarjeta .checkbox:checked');
    cambiarContenido(counter_listselection, checked.length);
}

function actualizarContadorTareasEnMemoria() {
    cambiarContenido(counter_memoryselection, _delete.keys.memory.length)
}
