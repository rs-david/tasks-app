import { save } from "./variablesInterfaz.js";
import { search_id, search_name, search_description, cards_container, checkbox_master, top_button, sort_id, sort_name, sort_description, sort_date, save_form, overlay, delete_form, delete_buttonclose, delete_buttoncancel, delete_button, delete_alert, multiple_form, multiple_button, upload_input, upload_form, upload_button, clean_button, save_name } from "./elementosInterfaz.js";
import { deshabilitarElemento } from "./funcionesInterfaz.js";
import { listarTareas } from "./listarTareas.js";
import { activarEstadoEliminar, eliminarTareas, desactivarEstadoEliminar, obtenerClavesDeCasillasSeleccionadas } from "./eliminarTareas.js";
import { guardarTareas } from "./guardarTareas.js";
import { alternarEstadoEditar, desactivarEstadoEditar } from "./estadoEditar.js";
import { alternarEstadoSubir, subirLista } from "./subirLista.js";
import { limpiarFiltros } from "./limpiarFiltros.js";
import { mostrarNotificacion } from "./mostrarNotificaciones.js";
import { alternarEstadoEliminarVariasTareas } from "./estadoEliminarVariasTareas.js";
import { alternarEstadoSeleccionarTarjeta, desplazarseEntreTarjetas } from "./estadoSeleccionarTarjeta.js";
import { mostrarMasTareas } from "./mostrarMasTareas.js";
import { ordenarTareas } from "./ordenarTareas.js";

//* --------------------------------------------------------------------------------- FUNCIONES DE INICIO *//

listarTareas();
save_name.focus();

//* ------------------------------------------------------------------------------ FILTRAR/BUSCAR TAREAS *//

search_id.addEventListener('keyup', () => listarTareas());
search_name.addEventListener('keyup', () => listarTareas());
search_description.addEventListener('keyup', () => listarTareas());

search_id.addEventListener('search', () => listarTareas());
search_name.addEventListener('search', () => listarTareas());
search_description.addEventListener('search', () => listarTareas());

//* ----------------------------------------------------------------------------------- ORDENAR TAREAS *//

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

//* --------------------------------------------------------------------------- GUARDAR/EDITAR TAREAS *//

save_form.addEventListener('submit', e => {
    guardarTareas();
    e.preventDefault();
});

//* --------------------------------------------------------- ACTIVAR/DESACTIVAR ESTADO EDITAR TAREAS *//

cards_container.addEventListener('click', e => {
    const element = e.target;

    if (element.classList.contains('button-edit') || element.classList.contains('icon-edit')) {
        const card = document.querySelector(`#tarjeta-${element.dataset.id}`);
        alternarEstadoEditar(card);
        e.preventDefault();
    }

});
document.addEventListener('keydown', e => {
    if (e.key == 'Escape' && save.state == 'update' && !overlay.classList.contains('active')) {
        const editcard = document.querySelector(`.tarjeta.edit`);
        if (editcard) desactivarEstadoEditar(editcard);
        else desactivarEstadoEditar();
    }
});

//* --------------------------------------------------------------------------------- ELIMINAR TAREAS *//

delete_form.addEventListener('submit', e => {
    eliminarTareas();
    e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Enter' && delete_alert.classList.contains('active') && !delete_button.hasAttribute('disabled')) eliminarTareas();
});

//* ------------------------------------------------------- ACTIVAR/DESACTIVAR ESTADO ELIMINAR TAREAS *//

/* Desde: Botón Eliminar */
cards_container.addEventListener('click', e => {
    const element = e.target;

    if (element.classList.contains('button-delete') || element.classList.contains('icon-delete')) {
        const id = [element.dataset.id];
        activarEstadoEliminar(id);
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
    if (e.target.id == 'overlay' && !delete_button.hasAttribute('disabled')) desactivarEstadoEliminar();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Escape' && delete_alert.classList.contains('active') && !delete_button.hasAttribute('disabled')) desactivarEstadoEliminar();
});

/* Desde: Botón Eliminar Varias Tareas */
multiple_form.addEventListener('submit', e => {
    const keys = obtenerClavesDeCasillasSeleccionadas();

    if (keys) activarEstadoEliminar(keys);
    else {
        mostrarNotificacion('No Hay Casillas Seleccionadas', 'warning');
        deshabilitarElemento(multiple_button);
    }

    e.preventDefault();
});
document.addEventListener('keydown', e => {
    if (e.key == 'Delete' && !overlay.classList.contains('active') && !multiple_button.hasAttribute('disabled')) {
        e.preventDefault();
        const keys = obtenerClavesDeCasillasSeleccionadas();

        if (keys) activarEstadoEliminar(keys);
        else {
            mostrarNotificacion('No Hay Casillas Seleccionadas', 'warning');
            deshabilitarElemento(multiple_button);
        }
    }
});

//* ---------------------------------------------- ACTIVAR/DESACTIVAR ESTADO ELIMINAR VARIAS TAREAS *//

checkbox_master.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.tarjeta .checkbox');
    for (const checkbox of checkboxes) checkbox.checked = checkbox_master.checked;

    alternarEstadoEliminarVariasTareas();
});
cards_container.addEventListener('click', e => {
    const element = e.target;
    if (element.classList.contains('checkbox') || element.classList.contains('custom-checkbox')) {
        alternarEstadoEliminarVariasTareas();
    }
});
document.addEventListener('keydown', e => {
    const selectcard = document.querySelector('.tarjeta.select');

    if (e.code == 'Space' && selectcard) {
        e.preventDefault();
        const checkbox = selectcard.children[0].children[0];
        checkbox.checked = checkbox.checked ? false : true;
        alternarEstadoEliminarVariasTareas();
    }
});

//* ----------------------------------------------------------------------------------- SUBIR LISTA *//

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

//* ------------------------------------------------------------------------------- LIMPIAR FILTROS *//

clean_button.addEventListener('click', e => {
    limpiarFiltros();
    e.preventDefault();
});

//* -------------------------------------------------------------------------- SELECCIONAR TARJETAS *//

cards_container.addEventListener('click', e => {
    const element = e.target;
    const firstclass = element.classList[0];
    const ecs_class = /^tarjeta$|^contenido$/.test(firstclass);

    if (ecs_class) alternarEstadoSeleccionarTarjeta(element);
});
document.addEventListener('keydown', e => desplazarseEntreTarjetas(e));

//* -------------------------------------------------------------------------------- TOP SCROLLING *//

top_button.addEventListener('click', e => {
    cards_container.scrollTop = 0;
    e.preventDefault();
});

//* --------------------------------------------------------------------------- MOSTRAR MÁS TAREAS *//

cards_container.addEventListener('click', e => {
    const element = e.target;
    if (element.id == 'icon-show' || element.id == 'button-show') mostrarMasTareas();
});

