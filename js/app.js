import { _save, _delete } from "./modules/variables.js";
import { deshabilitarElemento, enfocarElemento } from "./modules/funciones.js";
import { cards_container, checkbox_master, top_list_button, save_form, overlay, delete_form, delete_buttonclose, delete_buttoncancel, delete_button, delete_modal, multiple_delete_form, multiple_delete_button, upload_input, upload_form, upload_button, clean_button, save_name, list, search_form, headers, multiple_delete_listselection, multiple_delete_memoryselection } from "./modules/elementos.js";
import { listarTareas } from "./modules/listarTareas.js";
import { activarEstadoEliminar, eliminarTareas, desactivarEstadoEliminar } from "./modules/eliminarTareas.js";
import { guardarTareas } from "./modules/guardarTareas.js";
import { alternarEstadoEditar, desactivarEstadoEditar, modificarSimultaneamenteTarjeta } from "./modules/estadoEditarTareas.js";
import { alternarEstadoSubir, subirLista } from "./modules/subirLista.js";
import { limpiarFiltros } from "./modules/limpiarFiltros.js";
import { mostrarNotificacion, cerrarNotificacion } from "./modules/notificaciones.js";
import { alternarEstadoBotonEliminarVariasTareas, actualizarEstadoEliminarVariasTareas } from "./modules/estadoEliminarVariasTareas.js";
import { alternarEstadoSeleccionarTarjeta, desplazarseEntreTarjetas } from "./modules/seleccionarTarjetas.js";
import { ordenarTareas } from "./modules/ordenarTareas.js";
import { mostrarMasTareas } from "./modules/mostrarMasTareas.js";

//* -------------------------------------------------------------------------------------------------------------- FUNCIONES DE INICIO *//

listarTareas();
enfocarElemento(save_name);

//* -------------------------------------------------------------------------------------------------------------- FILTRAR/BUSCAR TAREAS *//

search_form.addEventListener('search', () => listarTareas());
search_form.addEventListener('keyup', e => {
    if (e.target.nodeName == 'INPUT') listarTareas();
});

//* -------------------------------------------------------------------------------------------------------------- ORDENAR TAREAS *//

headers.addEventListener('click', e => {
    if (e.target.nodeName == 'A') {
        ordenarTareas(e);
        e.preventDefault();
    }
});

//* -------------------------------------------------------------------------------------------------------------- GUARDAR/EDITAR TAREAS *//

save_form.addEventListener('submit', e => {
    guardarTareas();
    e.preventDefault();
});

//* ----------------------------------- ACTIVAR/DESACTIVAR ESTADO EDITAR TAREAS *//

cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('boton-editar') || e.target.classList.contains('icono-editar')) {
        const card = document.querySelector(`#tarjeta-${e.target.dataset.id}`);
        alternarEstadoEditar(card);
        e.preventDefault();
    }
});
document.addEventListener('keydown', e => {
    if (e.key == 'Escape' && _save.type == 'update' && !overlay.classList.contains('active')) {
        e.preventDefault();
        if (!e.repeat) desactivarEstadoEditar('UI');
    }
});

//* ----------------------------------- MODIFICAR CONTENIDO DE TARJETA EN EDICIÓN *//

save_form.addEventListener('keyup', e => {
    if (_save.type == 'update' && e.target.nodeName != 'BUTTON') {
        modificarSimultaneamenteTarjeta(e);
    }
});

//* -------------------------------------------------------------------------------------------------------------- ELIMINAR TAREAS *//

delete_form.addEventListener('submit', e => {
    eliminarTareas();
    e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Enter' && delete_modal.classList.contains('active') && !delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        if (!e.repeat) eliminarTareas();
    }
});

//* ----------------------------------- ACTIVAR/DESACTIVAR ESTADO ELIMINAR TAREAS *//

/* Activar */
cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('boton-eliminar') || e.target.classList.contains('icono-eliminar')) {
        const key = [e.target.dataset.id];
        activarEstadoEliminar('individual', key);
        e.preventDefault();
    }
});
multiple_delete_form.addEventListener('submit', e => {
    if (multiple_delete_listselection.checked) activarEstadoEliminar('list');
    else if (multiple_delete_memoryselection.checked) activarEstadoEliminar('memory');
    else {
        deshabilitarElemento(multiple_delete_button);
        multiple_delete_listselection.checked = true;
    }
    e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Delete' && !overlay.classList.contains('active') && !multiple_delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        if (!e.repeat) {
            if (multiple_delete_listselection.checked) activarEstadoEliminar('list');
            else if (multiple_delete_memoryselection.checked) activarEstadoEliminar('memory');
            else {
                deshabilitarElemento(multiple_delete_button);
                multiple_delete_listselection.checked = true;
            }
        }
    }
});

/* Desactivar */
delete_buttonclose.addEventListener('click', e => {
    desactivarEstadoEliminar('UI');
    e.preventDefault();
});
delete_buttoncancel.addEventListener('click', e => {
    desactivarEstadoEliminar('UI');
    e.preventDefault();
});
overlay.addEventListener('click', e => {
    if (e.target.id == 'overlay' && !delete_button.hasAttribute('disabled')) {
        desactivarEstadoEliminar('UI');
    }
});
document.addEventListener('keydown', e => {
    if (e.key == 'Escape' && overlay.classList.contains('active') && !delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        if (!e.repeat) desactivarEstadoEliminar('UI');
    }
});

//* ----------------------------------- ACTUALIZAR ESTADO ELIMINAR VARIAS TAREAS *//

checkbox_master.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.tarjeta .checkbox');
    if (checkboxes.length > 0) {
        actualizarEstadoEliminarVariasTareas(checkbox_master, checkboxes);
    }
});
cards_container.addEventListener('change', e => {
    if (e.target.classList.contains('checkbox')) {
        const checkbox = e.target;
        actualizarEstadoEliminarVariasTareas(checkbox);
    }
});

//* ----------------------------------- MARCAR CHECKBOXES DE LISTA CON TECLA "ESPACE" *//

document.addEventListener('keydown', e => {
    if (e.code == 'Space') {
        const selectcard = document.querySelector('.tarjeta.select');
        if (selectcard) {
            e.preventDefault();
            if (!e.repeat) {
                const checkbox = selectcard.children[0].children[0];
                checkbox.checked = !checkbox.checked;
                actualizarEstadoEliminarVariasTareas(checkbox);
            }
        }
    }
});

//* ----------------------------------- ALTERNAR ESTADO BOTON ELIMINAR VARIAS TAREAS *//

multiple_delete_listselection.addEventListener('change', () => {
    alternarEstadoBotonEliminarVariasTareas();
});
multiple_delete_memoryselection.addEventListener('change', () => {
    alternarEstadoBotonEliminarVariasTareas();
});

//* -------------------------------------------------------------------------------------------------------------- SUBIR LISTA *//

upload_input.addEventListener('change', () => alternarEstadoSubir());
upload_form.addEventListener('submit', e => {
    const file = upload_input.files[0];
    if (file) subirLista(file);
    else {
        mostrarNotificacion('Selecciona Antes Un Archivo', 'warning');
        deshabilitarElemento(upload_button);
    }
    e.preventDefault();
});

//* -------------------------------------------------------------------------------------------------------------- LIMPIAR FILTROS *//

clean_button.addEventListener('click', () => limpiarFiltros());

//* -------------------------------------------------------------------------------------------------------------- SELECCIONAR TARJETAS *//

cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('tarjeta') || e.target.classList.contains('contenido')) {
        alternarEstadoSeleccionarTarjeta(e.target.dataset.id);
    }
});
document.addEventListener('keydown', e => desplazarseEntreTarjetas(e));

//* -------------------------------------------------------------------------------------------------------------- SCROLL TOP LIST *//

top_list_button.addEventListener('click', e => {
    cards_container.scrollTop = 0;
    e.preventDefault();
});

//* -------------------------------------------------------------------------------------------------------------- MOSTRAR MÁS TAREAS *//

cards_container.addEventListener('click', e => {
    if (e.target.id == 'icon-show' || e.target.id == 'button-show') mostrarMasTareas();
});

//* -------------------------------------------------------------------------------------------------------------- CERRAR NOTIFICACIONES *//

list.addEventListener('click', e => {
    if (e.target.classList.contains('notificacion')) {
        cerrarNotificacion(e.target);
    }
});
