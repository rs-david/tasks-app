import { delete_buttonclose, delete_button, delete_buttoncancel, delete_icon, overlay, delete_modal, multiple_delete_button, delete_quantity, delete_modaltitle } from "./elementos.js";
import { _save, _delete } from "./variables.js";
import { cambiarIcono, habilitarElemento, deshabilitarElemento } from "./funciones.js";
import { listarTareas } from "./listarTareas.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { desactivarEstadoEditar } from "./estadoEditarTareas.js";

/* Eliminar Tareas */
export async function eliminarTareas() {
    iniciarEstadoEliminando();

    const keys = _delete.type == 'list' ? _delete.keys.list : _delete.type == 'memory' ? _delete.keys.memory : _delete.keys.individual;
    if (_save.type == 'update' && keys.includes(_save.id)) desactivarEstadoEditar();
    const message = await eliminar(keys);

    if (message.error) console.log(message.error);

    terminarEstadoEliminando();
    desactivarEstadoEliminar();
    listarTareas(50);
    mostrarNotificacion(message.content, message.type);
}

async function eliminar(claves) {
    const data = new FormData();
    data.append('data', JSON.stringify(claves));
    const response = await fetch('tasks-delete.php', { method: 'post', body: data });
    const message = await response.json();
    return message;
}

export function activarEstadoEliminar(tipo, clave) {
    _delete.type = tipo;
    const keys = agregarClaves(tipo, clave);
    if (keys.error) {
        deshabilitarElemento(multiple_delete_button);
        mostrarNotificacion(keys.message, 'warning');
    }
    else {
        prepararModal(keys, tipo);
        abrirModal();
    }
}

export function desactivarEstadoEliminar(origen) {
    removerClaves(origen);
    cerrarModal();
}

function agregarClaves(tipo, clave) {
    if (tipo == 'individual') {
        _delete.keys.individual = clave;
        return _delete.keys.individual;
    }
    else if (tipo == 'list') {
        const checkedcheckboxes = [...document.querySelectorAll('.tarjeta .checkbox:checked')];
        if (checkedcheckboxes.length > 0) {
            _delete.keys.list = checkedcheckboxes.map(checkbox => checkbox.dataset.id);
            return _delete.keys.list;
        }
        else return { error: true, message: 'No Hay Tareas Seleccionadas' };
    }
    else if (tipo == 'memory') {
        if (_delete.keys.memory.length > 0) {
            return _delete.keys.memory;
        }
        else return { error: true, message: 'No Hay Tareas En Memoria' };
    }
}

function removerClaves(origen) {
    if (origen == 'UI') {
        if (_delete.type == 'list') _delete.keys.list = [];
        else if (_delete.type == 'individual') _delete.keys.individual = [];
    }
    else {
        if (_delete.type == 'list') {
            for (const listkey of _delete.keys.list) _delete.keys.memory = _delete.keys.memory.filter(memorykey => memorykey != listkey);
            _delete.keys.list = [];
        }
        else if (_delete.type == 'individual') {
            _delete.keys.memory = _delete.keys.memory.filter(memorykey => memorykey != _delete.keys.individual[0]);
            _delete.keys.individual = [];
        }
        else _delete.keys.memory = [];
    }
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

function prepararModal(claves, tipo) {
    delete_quantity.textContent = claves.length;
    delete_modaltitle.textContent = tipo == 'list' ? 'Lista' : tipo == 'memory' ? 'Memoria' : tipo == 'individual' ? 'Individual' : false;
}

function abrirModal() {
    overlay.classList.add('active');
    delete_modal.classList.add('active');
}

function cerrarModal() {
    overlay.classList.remove('active');
    delete_modal.classList.remove('active');
}
