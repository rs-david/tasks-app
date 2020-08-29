import { _save } from "./variables.js";
import { save_id, save_name, save_description, save_form, save_button } from "./elementos.js";
import { enfocarElemento } from "./funciones.js";

/* Estado Editar Tareas */
export function alternarEstadoEditar(tarjeta) {
    if (_save.type == 'add') activarEstadoEditar(tarjeta, true);
    else if (_save.type == 'update') {
        if (tarjeta.classList.contains('edit')) desactivarEstadoEditar('UI');
        else {
            desactivarEstadoEditarTarjeta('UI');
            activarEstadoEditar(tarjeta);
        }
    }
}

export function activarEstadoEditar(tarjeta, boton) {
    if (boton) activarEstadoEditarBoton();
    tarjeta.classList.add('edit');
    llenarFormulario(tarjeta);
    modificarVariables(tarjeta);
    enfocarElemento(save_name);
}

export function desactivarEstadoEditar(origen) {
    desactivarEstadoEditarTarjeta(origen);
    desactivarEstadoEditarBoton();
    restablecerVariables();
    save_form.reset();
}

function modificarVariables(tarjeta) {
    _save.type = 'update';
    _save.id = tarjeta.dataset.id;
    _save.name = tarjeta.children[2].textContent;
    _save.description = tarjeta.children[3].textContent;
}

function restablecerVariables() {
    _save.type = 'add';
    _save.id = 0;
    _save.name = '';
    _save.description = '';
}

function llenarFormulario(tarjeta) {
    save_id.value = tarjeta.dataset.id;
    save_name.value = tarjeta.children[2].textContent;
    save_description.value = tarjeta.children[3].textContent;
}

function activarEstadoEditarBoton() {
    save_button.classList.remove('success');
    save_button.classList.add('warning');
    save_button.title = 'Guardar Cambios';
}

function desactivarEstadoEditarBoton() {
    save_button.classList.remove('warning');
    save_button.classList.add('success');
    save_button.title = 'Guardar';
}

function desactivarEstadoEditarTarjeta(origen) {
    const editcard = document.querySelector('.tarjeta.edit');
    if (editcard) {
        editcard.classList.remove('edit');
        if (origen == 'UI') restablecerContenidoTarjeta(editcard);
    }
}

function restablecerContenidoTarjeta(tarjeta) {
    tarjeta.children[1].textContent = _save.id;
    tarjeta.children[2].textContent = _save.name;
    tarjeta.children[3].textContent = _save.description;
}

export function modificarSimultaneamenteTarjeta(e) {
    const cardpart = document.querySelector(`#tarjeta-${_save.id} .contenido.${e.target.name}`);
    const content = e.target.value;
    if (cardpart) cardpart.textContent = content;
}
