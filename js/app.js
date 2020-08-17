import { save, _delete } from "./modules/variables.js";
import { search_id, search_name, search_description, cards_container, checkbox_master, top_list_button, sort_id, sort_name, sort_description, sort_date, save_form, overlay, delete_form, delete_buttonclose, delete_buttoncancel, delete_button, delete_modal, multiple_delete_form, multiple_delete_button, upload_input, upload_form, upload_button, clean_button, save_name, list } from "./modules/elementos.js";
import { deshabilitarElemento } from "./modules/funciones.js";
import { listarTareas } from "./modules/listarTareas.js";
import { activarEstadoEliminar, eliminarTareas, desactivarEstadoEliminar, obtenerClavesDeCasillasSeleccionadas } from "./modules/eliminarTareas.js";
import { guardarTareas } from "./modules/guardarTareas.js";
import { alternarEstadoEditar, desactivarEstadoEditar, modificarSimultaneamenteTarjeta } from "./modules/estadoEditar.js";
import { alternarEstadoSubir, subirLista } from "./modules/subirLista.js";
import { limpiarFiltros } from "./modules/limpiarFiltros.js";
import { mostrarNotificacion } from "./modules/notificaciones.js";
import { alternarEstadoEliminarVariasTareas } from "./modules/estadoEliminarVariasTareas.js";
import { alternarEstadoSeleccionarTarjeta, desplazarseEntreTarjetas } from "./modules/seleccionarTarjetas.js";
import { mostrarMasTareas } from "./modules/mostrarMasTareas.js";
import { ordenarTareas } from "./modules/ordenarTareas.js";
import { cerrarNotificacion } from "./modules/notificaciones.js";


//* -------------------------------------------------------------------------------------------------------------- FUNCIONES DE INICIO *//

listarTareas();
save_name.focus();

//* -------------------------------------------------------------------------------------------------------------- FILTRAR/BUSCAR TAREAS *//

search_id.addEventListener('keyup', () => listarTareas());
search_name.addEventListener('keyup', () => listarTareas());
search_description.addEventListener('keyup', () => listarTareas());
search_id.addEventListener('search', () => listarTareas());
search_name.addEventListener('search', () => listarTareas());
search_description.addEventListener('search', () => listarTareas());

//* -------------------------------------------------------------------------------------------------------------- ORDENAR TAREAS *//

sort_id.addEventListener('click', e => {
    ordenarTareas(e);
    e.preventDefault();
})
sort_name.addEventListener('click', e => {
    ordenarTareas(e);
    e.preventDefault();
})
sort_description.addEventListener('click', e => {
    ordenarTareas(e);
    e.preventDefault();
})
sort_date.addEventListener('click', e => {
    ordenarTareas(e);
    e.preventDefault();
})

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
    if (e.key == 'Escape' && save.state == 'update' && !overlay.classList.contains('active')) {
        e.preventDefault();
        if (!e.repeat) {
            const editcard = document.querySelector('.tarjeta.edit');
            desactivarEstadoEditar(editcard);
        }
    }
});

//* ----------------------------------- MODIFICAR CONTENIDO DE TARJETA EN EDICIÓN *//

save_form.addEventListener('keyup', e => {
    if (save.state == 'update' && e.target.nodeName != 'BUTTON') {
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

cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('boton-eliminar') || e.target.classList.contains('icono-eliminar')) {
        const key = [e.target.dataset.id];
        activarEstadoEliminar(key);
        e.preventDefault();
    }
});
delete_buttonclose.addEventListener('click', e => {
    desactivarEstadoEliminar();
    e.preventDefault();
});
delete_buttoncancel.addEventListener('click', e => {
    desactivarEstadoEliminar();
    e.preventDefault();
});
overlay.addEventListener('click', e => {
    if (e.target.id == 'overlay' && !delete_button.hasAttribute('disabled')) {
        desactivarEstadoEliminar();
    }
});
document.addEventListener('keydown', e => {
    if (e.key == 'Escape' && overlay.classList.contains('active') && !delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        if (!e.repeat) desactivarEstadoEliminar();
    }
});
multiple_delete_form.addEventListener('submit', e => {
    const keys = obtenerClavesDeCasillasSeleccionadas();
    if (keys) activarEstadoEliminar(keys);
    else {
        mostrarNotificacion('No Hay Casillas Seleccionadas', 'warning');
        deshabilitarElemento(multiple_delete_button);
    }
    e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Delete' && !overlay.classList.contains('active') && !multiple_delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        if (!e.repeat) {
            const keys = obtenerClavesDeCasillasSeleccionadas();
            if (keys) activarEstadoEliminar(keys);
            else {
                mostrarNotificacion('No Hay Casillas Seleccionadas', 'warning');
                deshabilitarElemento(multiple_delete_button);
            }
        }
    }
});

//* ----------------------------------- ACTIVAR/DESACTIVAR ESTADO ELIMINAR VARIAS TAREAS *//

checkbox_master.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.tarjeta .checkbox');
    if (checkboxes.length > 0) {
        for (const checkbox of checkboxes) checkbox.checked = checkbox_master.checked;
        alternarEstadoEliminarVariasTareas();
    }
});
cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('checkbox') || e.target.classList.contains('custom-checkbox')) {
        alternarEstadoEliminarVariasTareas();
    }
});
document.addEventListener('keydown', e => {
    if (e.code == 'Space') {
        const selectcard = document.querySelector('.tarjeta.select');
        if (selectcard) {
            e.preventDefault();
            if (!e.repeat) {
                const checkbox = selectcard.children[0].children[0];
                checkbox.checked = !checkbox.checked;
                alternarEstadoEliminarVariasTareas();
            }
        }
    }
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

//* -------------------------------------------------------------------------------------------------------------- SCROLL TOP *//

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
