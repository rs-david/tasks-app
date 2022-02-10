import { _actualtable, _tables } from "./variables.js";
import { save_form, save_button } from "./elementos.js";
import { mostrarNotificacion } from "./notificaciones.js";

/* Alternar (Activar/Desactivar) Estado Editar */
export async function alternarEstadoEditar(id) {
    const table = _actualtable.name;

    /* Obtener Todos Los Datos Pertenecientes Al Registro Que Editaremos */

    if (_tables[table].savedata.type == 'add') {
        activarEstadoEditar(table, id);
    }
    else if (_tables[table].savedata.type == 'update') {
        const card = document.querySelector(`#cards #card-${id}`);
        if (!card.classList.contains('edit')) {
            restablecerTarjetaEnEdicion(table);
            activarEstadoEditar(table, id);
        }
        else {
            desactivarEstadoEditar(table)
        }
    }
}

async function obtenerTodaLaInformacionDelRegistro(table, id) {
    const data = new FormData();
    data.append('data', JSON.stringify({ id, table }));
    const response = await fetch('record-info.php', { method: 'post', body: data });
    const json = await response.json();
    return json;
}

/* Estado Editar: Save Button & Card In Yellow, Save Form Full, Save Data Full */
export async function activarEstadoEditar(table, id) {
    /* Obtener Todos Los Datos Pertenecientes Al Registro Que Editaremos */
    const record = await obtenerTodaLaInformacionDelRegistro(table, id);
    if (!record.error) {
        /* Cambiar Estado De La Tarjeta */
        const card = document.querySelector(`#card-${record.id}`);
        if (card && !card.classList.contains('edit')) card.classList.add('edit');

        /* Cambiar Estado Del Botón */
        activarEstadoEditarBoton();

        /* Llenar Formulario */
        llenarFormulario(record, table);

        /* Modificar Save Data */
        modificarSaveData(table, id);
    } else mostrarNotificacion(record.message, record.type);
}

function activarEstadoEditarBoton() {
    if (!save_button.classList.contains('warning')) {
        save_button.classList.remove('success');
        save_button.classList.add('warning');
        save_button.title = 'Guardar Cambios';
    }
}

function llenarFormulario(record, table) {
    const saveinputs = _tables[table].saveinputs;

    /* Llenar Los Save Inputs Con La Información Del Registro (Record Info) */
    const recordentries = Object.entries(record);
    for (const [key, value] of recordentries) {
        if (saveinputs.includes(key)) {
            const saveinput = document.querySelector(`#save-${key}`);
            saveinput.value = value;
        }
    }
}

function modificarSaveData(table, id) {
    /* Modificar El Tipo De Save: Update */
    _tables[table].savedata.type = 'update';

    /* Modificar Card ID */
    _tables[table].savedata.cardid = id;
}

export function desactivarEstadoEditar(table, keepmemorydata) {
    restablecerTarjetaEnEdicion();
    restablecerSaveButton();
    save_form.reset();
    if (!keepmemorydata) restablecerUpdateData(table);
}

function restablecerTarjetaEnEdicion() {
    const editcard = document.querySelector('.card.edit');
    if (editcard) editcard.classList.remove('edit');
}

function restablecerSaveButton() {
    if (save_button.classList.contains('warning')) {
        save_button.classList.remove('warning');
        save_button.classList.add('success');
        save_button.title = 'Guardar';
    }
}

function restablecerUpdateData(table) {
    /* Restablecer El Tipo De Save: Add */
    _tables[table].savedata.type = 'add';

    /* Restablecer Card ID */
    _tables[table].savedata.cardid = false;
}
