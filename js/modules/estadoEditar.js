import { _save } from "./variables.js";
import { save_id, save_name, save_description, save_form, save_button } from "./elementos.js";

/* Estado Editar Tareas */
export function alternarEstadoEditar(tarjeta) {
    if (_save.type == 'add') activarEstadoEditar(tarjeta, true);
    else {
        if (tarjeta.classList.contains('edit')) desactivarEstadoEditar(tarjeta);
        else {
            const editcard = document.querySelector('.tarjeta.edit');
            desactivarEstadoEditarTarjeta(editcard);
            activarEstadoEditar(tarjeta);
        }
    }
}

export function activarEstadoEditar(tarjeta, boton) {
    if (boton) activarEstadoEditarBoton();
    tarjeta.classList.add('edit');
    llenarFormulario(tarjeta);
    save_name.focus();
    _save.type = 'update';
    _save.key = tarjeta.dataset.id;
}

export function desactivarEstadoEditar(tarjeta) {
    desactivarEstadoEditarTarjeta(tarjeta);
    desactivarEstadoEditarBoton();
    save_form.reset();
    _save.type = 'add';
    _save.key = 0;
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

function desactivarEstadoEditarTarjeta(tarjeta) {
    if (tarjeta) tarjeta.classList.remove('edit');
}

export function modificarSimultaneamenteTarjeta(e) {
    const cardpart = document.querySelector(`#tarjeta-${_save.key} .contenido.${e.target.name}`);
    const content = e.target.value;
    if (cardpart) cardpart.textContent = content;
}
