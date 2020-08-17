import { save } from "./variables.js";
import { save_id, save_name, save_description, save_form, save_button } from "./elementos.js";

/* Manipular Estado "Editar Tarea" */
export function alternarEstadoEditar(tarjeta) {
    if (save.state == 'save') activarEstadoEditar(tarjeta, true);
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
    save.state = 'update';
}

export function desactivarEstadoEditar(tarjeta) {
    desactivarEstadoEditarTarjeta(tarjeta);
    desactivarEstadoEditarBoton();
    save_form.reset();
    save.state = 'save';
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
    const id = save_id.value;
    const part = e.target.name;
    const element = document.querySelector(`#tarjeta-${id} .contenido.${part}`);
    const content = e.target.value;
    if (element) element.textContent = content;
}
