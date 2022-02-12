import { _tables, _actualtable } from "./modules/variables.js";
import { deshabilitarElemento, enfocarElemento } from "./modules/funciones.js";
import { cards_container, headers_checkbox, top_list_button, save_form, overlay, delete_form, delete_buttonclose, delete_buttoncancel, delete_button, delete_modal, multiple_delete_form, multiple_delete_button, upload_input, upload_form, upload_button, clean_button, save_name, list, search_form, headers, multiple_delete_listselection, multiple_delete_memoryselection, table_tabs } from "./modules/elementos.js";
import { listarRegistros } from "./modules/listarRegistros.js";
import { deleteRecords, openDeleteModal, closeDeleteModal } from "./modules/deleteRecords.js";
import { saveRecords } from "./modules/saveRecords.js";
import { activarEstadoEditar, alternarEstadoEditar, desactivarEstadoEditar } from "./modules/estadoEditarTareas.js";
import { activarEstadoSubir, desactivarEstadoSubir, subirLista } from "./modules/subirLista.js";
import { limpiarFiltros } from "./modules/limpiarFiltros.js";
import { mostrarNotificacion, cerrarNotificacion } from "./modules/notificaciones.js";
import { actualizarEstadoBotonEliminarVariasTareas, actualizarEstadoEliminarVariasTareas } from "./modules/estadoEliminarVariasTareas.js";
import { ordenarTareas } from "./modules/ordenarTareas.js";
import { mostrarMasTareas } from "./modules/mostrarMasTareas.js";
import { desplazarseALaTarjetaSiguiente } from "./modules/desplazarseEntreTarjetas.js";
import { changeSearchInputs } from "./modules/cambiarSearchInputs.js";
import { changeHeaders } from "./modules/cambiarHeaders.js";
import { crearSearchData } from "./modules/crearSearchData.js";
import { changeSaveInputs } from "./modules/cambiarSaveInputs.js";

//* -------------------------------------------------------------------------------------------------------------- FUNCIONES DE INICIO *//
listarRegistros();
enfocarElemento(save_name);

//* -------------------------------------------------------------------------------------------------------------- CAMBIAR DE TABLA *//
table_tabs.addEventListener('click', e => {
    const element = e.target;
    if (element.nodeName == 'A') {
        const tab = element;
        const table = tab.name;
        const lasttable = _actualtable.name;
        if (_tables[table]) {
            if (!tab.classList.contains('active')) {
                /* Activar/Desactivar Pestaña */
                const activetab = document.querySelector('a.table-tab.active');
                activetab.classList.remove('active');
                tab.classList.add('active');

                /* CAMBIAR SEARCH INPUTS */
                changeSearchInputs(table);

                /* CAMBIAR SAVE INPUTS */
                changeSaveInputs(table);

                /* CAMBIAR HEADERS */
                changeHeaders(table)

                /* CAMBIAR LISTA */
                const listdata = { table };
                listarRegistros(listdata);

                /* DESACTIVAR ESTADO EDITAR */
                if (_tables[lasttable].savedata.type == 'update') desactivarEstadoEditar(lasttable, true);

                /* ACTIVAR ESTADO EDITAR */
                if (_tables[table].savedata.type == 'update') {
                    const id = _tables[table].savedata.cardid;
                    activarEstadoEditar(table, id);
                }
            }
        } else {
            mostrarNotificacion('No Existe La Tabla o_O', 'danger');
        }
        e.preventDefault();
    }
});

//* -------------------------------------------------------------------------------------------------------------- FILTRAR/BUSCAR TAREAS *//
search_form.addEventListener('search', () => {
    const searchdata = crearSearchData();
    listarRegistros(false, searchdata);
});
search_form.addEventListener('keyup', e => {
    if (e.target.nodeName == 'INPUT') {
        const searchdata = crearSearchData();
        listarRegistros(false, searchdata);
    }
});

//* -------------------------------------------------------------------------------------------------------------- ORDENAR TAREAS *//
headers.addEventListener('click', e => {
    if (e.target.nodeName == 'A') {
        const headerlink = e.target;
        ordenarTareas(headerlink);
        e.preventDefault();
    }
});

//* -------------------------------------------------------------------------------------------------------------- GUARDAR/EDITAR REGISTROS *//
//* ----------------------------------- Alternar (Activar/Desactivar) Estado Editar Con Botón Ubicado En Tarjeta *//
cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('boton-editar') || e.target.classList.contains('icono-editar')) {
        const id = e.target.dataset.id;
        alternarEstadoEditar(id);
        e.preventDefault();
    }
});
//* ----------------------------------- Desactivar Estado Editar Con Tecla "Escape" *//
document.addEventListener('keydown', e => {
    const table = _actualtable.name;
    if (e.key == 'Escape' && _tables[table].savedata.type == 'update' && !overlay.classList.contains('active')) {
        e.preventDefault();
        if (!e.repeat) desactivarEstadoEditar(table);
    }
});

//* ----------------------------------- Guardar/Actualizar Registro *//
save_form.addEventListener('submit', e => {
    saveRecords();
    e.preventDefault();
});

//* -------------------------------------------------------------------------------------------------------------- ELIMINAR TAREAS (UNA & VARIAS) *//

//* ----------------------------------- Open Delete Modal (Prepare Delete) *//
/* Desde El Botón Eliminar Ubicado En Una Tarjeta */
cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('boton-eliminar') || e.target.classList.contains('icono-eliminar')) {
        const table = _actualtable.name;
        const key = e.target.dataset.id;
        const deletetype = 'individual';
        /* Cambiar El Tipo De Eliminación En La Memoria */
        _tables[table].deletedata.type = deletetype;
        /* Guardar Clave En La Memoria: Individual */
        _tables[table].deletedata.keys.individual.push(key);
        /* Abrir Modal */
        openDeleteModal(deletetype, 1);
        e.preventDefault();
    }
});
/* Desde El Botón "Eliminar Varias Tareas" */
multiple_delete_form.addEventListener('submit', e => {
    const table = _actualtable.name;
    const checkedradio = document.querySelector('#form-multiple-delete input[type="radio"]:checked')
    if (checkedradio) {
        const deletetype = checkedradio.dataset.deletetype;
        if (deletetype == 'list') {
            const checkedcheckboxes = [...document.querySelectorAll('#cards input[type="checkbox"]:checked')];
            if (checkedcheckboxes.length > 0) {
                /* Cambiar El Tipo De Eliminación En La Memoria */
                _tables[table].deletedata.type = deletetype;
                /* Obtener & Guardar Claves En La Memoria: Lista */
                const keysarray = checkedcheckboxes.map(checkbox => checkbox.dataset.id);
                _tables[table].deletedata.keys.list = keysarray;
                /* Abrir Delete Modal */
                openDeleteModal(deletetype, checkedcheckboxes.length);
            }
        } else if (deletetype == 'memory') {
            const totalkeys = _tables[table].deletedata.keys.memory.length;
            /* Cambiar El Tipo De Eliminación En La Memoria */
            _tables[table].deletedata.type = deletetype;
            /* Abrir Delete Modal */
            openDeleteModal(deletetype, totalkeys);
        }
    }
    e.preventDefault();
});
/* Desde Tecla "Delete" */
document.addEventListener('keydown', e => {
    if (e.key == 'Delete' && !overlay.classList.contains('active') && !multiple_delete_button.hasAttribute('disabled') && !e.repeat) {
        e.preventDefault();
        const table = _actualtable.name;
        const checkedradio = document.querySelector('#form-multiple-delete input[type="radio"]:checked')
        if (checkedradio) {
            const deletetype = checkedradio.dataset.deletetype;
            if (deletetype == 'list') {
                const checkedcheckboxes = [...document.querySelectorAll('#cards input[type="checkbox"]:checked')];
                if (checkedcheckboxes.length > 0) {
                    /* Cambiar El Tipo De Eliminación En La Memoria */
                    _tables[table].deletedata.type = deletetype;
                    /* Obtener & Guardar Claves En La Memoria: Lista */
                    const keysarray = checkedcheckboxes.map(checkbox => checkbox.dataset.id);
                    _tables[table].deletedata.keys.list = keysarray;
                    /* Abrir Delete Modal */
                    openDeleteModal(deletetype, checkedcheckboxes.length);
                }
            } else if (deletetype == 'memory') {
                const totalkeys = _tables[table].deletedata.keys.memory.length;
                /* Cambiar El Tipo De Eliminación En La Memoria */
                _tables[table].deletedata.type = deletetype;
                /* Abrir Delete Modal */
                openDeleteModal(deletetype, totalkeys);
            }
        }
    }
});

//* ----------------------------------- Close Delete Modal (Cancel Delete) *//
/* Desde Delete Modal: Botón Cerrar */
delete_buttonclose.addEventListener('click', e => {
    closeDeleteModal();
    e.preventDefault();
});
/* Desde Delete Modal: Botón Cancelar */
delete_buttoncancel.addEventListener('click', e => {
    closeDeleteModal();
    e.preventDefault();
});
/* Desde Overlay: Haciendo Click Sobre Él. */
overlay.addEventListener('click', e => {
    if (e.target.id == 'overlay' && !delete_button.hasAttribute('disabled')) {
        closeDeleteModal();
    }
});
/* Desde La Tecla "Escape" */
document.addEventListener('keydown', e => {
    if (e.key == 'Escape' && overlay.classList.contains('active') && !delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        if (!e.repeat) closeDeleteModal();
    }
});

//* ----------------------------------- ELIMINAR TAREAS *//
/* Eliminar Con Botón Eliminar Ubicado en Delete Modal */
delete_form.addEventListener('submit', e => {
    deleteRecords();
    e.preventDefault();
});
/* Eliminar Usando Tecla Enter */
document.addEventListener('keydown', e => {
    if (e.key == 'Enter' && !e.repeat && delete_modal.classList.contains('active') && !delete_button.hasAttribute('disabled')) {
        e.preventDefault();
        deleteRecords();
    }
});

//* ----------------------------------- ACTUALIZAR ESTADO ELIMINAR VARIAS TAREAS *//
/* Desde Headers Checkbox  */
headers_checkbox.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('#cards input[type="checkbox"]');
    if (checkboxes.length > 0) {
        actualizarEstadoEliminarVariasTareas(headers_checkbox, checkboxes);
    }
});
/* Desde Card Checkbox  */
cards_container.addEventListener('change', e => {
    const element = e.target;
    if (element.type == 'checkbox') {
        const checkbox = element;
        const checkboxarray = [checkbox];
        actualizarEstadoEliminarVariasTareas(checkbox, checkboxarray);
    }
});
/* Desde Tecla Space  */
document.addEventListener('keydown', e => {
    if (e.code == 'Space') {
        const selectedcard = document.querySelector('#cards .card.select');
        if (selectedcard) {
            e.preventDefault();
            if (!e.repeat) {
                const checkbox = document.querySelector('#cards .card.select input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                const checkboxarray = [checkbox];
                actualizarEstadoEliminarVariasTareas(checkbox, checkboxarray);
            }
        }
    }
});

//* ----------------------------------- ACTUALIZAR ESTADO DEL BOTÓN ELIMINAR VARIAS TAREAS *//
multiple_delete_listselection.addEventListener('change', () => {
    const table = _actualtable.name;
    actualizarEstadoBotonEliminarVariasTareas(table);
});
multiple_delete_memoryselection.addEventListener('change', () => {
    const table = _actualtable.name;
    actualizarEstadoBotonEliminarVariasTareas(table);
});

//* -------------------------------------------------------------------------------------------------------------- SUBIR (CARGAR) LISTA *//
upload_input.addEventListener('change', e => {
    const fileinput = e.target;
    const file = fileinput.files[0];
    if (file) activarEstadoSubir(file);
    else desactivarEstadoSubir();
});
upload_form.addEventListener('submit', e => {
    const file = upload_input.files[0];
    if (file) subirLista(file);
    else {
        mostrarNotificacion('Selecciona Antes Un Archivo', 'warning', 3500);
        if (!upload_button.hasAttribute('disabled')) deshabilitarElemento(upload_button);
    }
    e.preventDefault();
});

//* -------------------------------------------------------------------------------------------------------------- LIMPIAR FILTROS *//
clean_button.addEventListener('click', () => limpiarFiltros());

//* -------------------------------------------------------------------------------------------------------------- SELECCIONAR TARJETAS *//
cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('card') || e.target.classList.contains('card-content')) {
        const id = e.target.dataset.id;
        const card = document.querySelector(`#card-${id}`);

        if (card.classList.contains('select')) card.classList.remove('select');
        else {
            const selectedcard = document.querySelector('#cards .card.select');
            if (selectedcard) selectedcard.classList.remove('select');
            card.classList.add('select');
        }
    }
});

//* -------------------------------------------------------------------------------------------------------------- DESPLAZARSE ENTRE TARJETAS *//
document.addEventListener('keydown', e => {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        if (!e.repeat && !overlay.classList.contains('active')) {
            const selectedcard = document.querySelector('.card.select');
            if (selectedcard) {
                e.preventDefault();
                const direction = e.key == 'ArrowUp' ? 'up' : e.key == 'ArrowDown' ? 'down' : false;
                if (direction) desplazarseALaTarjetaSiguiente(selectedcard, direction);
            }
        }
    }
});

//* -------------------------------------------------------------------------------------------------------------- SCROLL TOP LIST *//
top_list_button.addEventListener('click', e => {
    cards_container.scrollTop = 0;
    e.preventDefault();
});

//* -------------------------------------------------------------------------------------------------------------- MOSTRAR MÁS TAREAS *//
cards_container.addEventListener('click', e => {
    if (e.target.id == 'icon-show' || e.target.id == 'button-show') {
        mostrarMasTareas();
    }
});

//* -------------------------------------------------------------------------------------------------------------- CERRAR NOTIFICACIONES *//
list.addEventListener('click', e => {
    if (e.target.classList.contains('notificacion')) {
        cerrarNotificacion(e.target);
    }
});
