import { save } from "./variablesInterfaz.js";
import { save_id, save_name, save_description, save_form, save_button } from "./elementosInterfaz.js";

/* Manipular Estado "Editar Tarea" */
export function alternarEstadoEditar(tarjeta) {
    if (save.state == 'save') activarEstadoEditar(tarjeta, true);
    else {
        if (tarjeta.classList.contains('edit')) desactivarEstadoEditar(tarjeta);
        else {
            const editcard = document.querySelector('.tarjeta.edit');
            if (editcard) editcard.classList.remove('edit');

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
    if (tarjeta) tarjeta.classList.remove('edit');
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
    save_button.classList.add('edit');
    save_button.title = 'Guardar Cambios';
}

function desactivarEstadoEditarBoton() {
    save_button.classList.remove('edit');
    save_button.title = 'Guardar';
}
