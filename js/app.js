//*---------- VARIABLES ----------*//

let actual_limit = 100;
let actual_sort = 'DESC';
let actual_column = 'created';
let delete_keys;

//*---------- ELEMENTOS ----------*//

/* Interfaz */
const overlay = document.querySelector('#overlay');
const checkbox_master = document.querySelector('#checkbox-master');
const cards_container = document.querySelector('#cards-container');
const notification = document.querySelector('#notification');

/* Contadores */
const counter_selection = document.querySelector('#counter-selection');
const counter_results = document.querySelector('#counter-results');
const counter_totals = document.querySelector('#counter-totals');

/* Filtrar/Buscar Tareas */
const search_form = document.querySelector('#search-form');
const search_id = document.querySelector('#search-id');
const search_name = document.querySelector('#search-name');
const search_description = document.querySelector('#search-description');

/* Ordenar Tareas */
const sort_id = document.querySelector('#column-id');
const sort_name = document.querySelector('#column-name');
const sort_description = document.querySelector('#column-description');
const sort_date = document.querySelector('#column-date');

/* Guardar Tareas */
const save_form = document.querySelector('#save-form');
const save_id = document.querySelector('#save-id');
const save_name = document.querySelector('#save-name');
const save_description = document.querySelector('#save-description');
const save_button = document.querySelector('#button-save');

/* Subir Lista */
const upload_form = document.querySelector('#form-upload-list');
const upload_input = document.querySelector('#input-upload-list');
const upload_field = document.querySelector('#field-upload-list');
const upload_fieldtext = document.querySelector('#field-upload-list span');
const upload_button = document.querySelector('#button-upload-list');
const upload_icon = document.querySelector('#icon-upload-list');

/* Eliminar Tareas */
const delete_alert = document.querySelector('#alert-delete');
const delete_form = document.querySelector('#form-delete');
const delete_button = document.querySelector('#button-delete');
const delete_icon = document.querySelector('#icon-delete');
const delete_buttoncancel = document.querySelector('#button-cancel-delete');
const delete_buttonclose = document.querySelector('#button-close-alert-delete');

/* Eliminar Varias Tareas */
const multiple_form = document.querySelector('#form-multiple-delete');
const multiple_button = document.querySelector('#button-multiple-delete');

/* Limpiar Filtros */
const clean_button = document.querySelector('#button-clean');
const clean_icon = document.querySelector('#icon-clean');

//*---------- FUNCIONES DE INICIO: ----------*//

listarTodasLasTareas();

//*---------- FUNCIONES ----------*//

/* --------------- LISTAR TAREAS --------------- */

async function listarTodasLasTareas() {
    const response = await fetch('task-list.php');
    const list = await response.json();

    crearListaTareas(list);
    enfocarElemento(save_name);
    console.log('Tareas Listadas');
}

async function listarTareas(limite, columna, orden) {
    const id = search_id.value;
    const name = search_name.value;
    const description = search_description.value;
    const limit = limite ? limite : actual_limit;
    const column = columna ? columna : actual_column;
    const sort = orden ? orden : actual_sort;

    actual_limit = limit;
    actual_column = column;
    actual_sort = sort;

    const data = JSON.stringify({ id, name, description, limit, column, sort });
    const response = await fetch('task-list.php', { method: 'post', body: data });
    const tasks = await response.json();

    crearListaTareas(tasks);
    console.log('Tareas Listadas');
}

function crearListaTareas(tareas) {
    const total = tareas[0] ? tareas[0].total : tareas.total;
    const results = tareas[0] ? tareas[0].results : tareas.results;

    if (results == 0) {
        const background = total == 0 ? 'bg-green-tea' : 'bg-happy-cup';
        cambiarContenido(cards_container, '');
        cards_container.classList.add(`${background}`);
    }
    else {
        cards_container.classList.remove('bg-green-tea', 'bg-happy-cup');

        const initialcard = crearTarjetaInicial();
        cambiarContenido(cards_container, initialcard);

        const cards = crearTarjetas(tareas);
        agregarContenido(cards_container, cards);

        const finalcard = crearTarjetaFinal(results);
        if (finalcard) agregarContenido(cards_container, finalcard);

        if (save_button.name == 'update') {
            const editcard = document.querySelector(`#tarjeta-${save_id.value}`);
            if (editcard) agregarEstado(editcard, 'edit');
        }

        if (checkbox_master.checked) {
            const checkboxes = document.querySelectorAll('.tarjeta .checkbox');
            marcarElementos(checkboxes);
        }
    }

    const checkboxes = document.querySelectorAll('.tarjeta .checkbox:checked');
    actualizarContadores(total, results, checkboxes.length);
}

function crearTarjetaInicial() {
    const initialcard = `<div id="inicio-lista"></div>`;
    return initialcard;
}

function crearTarjetas(tareas) {
    let cards = '';

    for (const tarea of tareas) {
        const card = `
            <div id="tarjeta-${tarea.id}" class="tarjeta" data-id="${tarea.id}">
                <div class="contenido seleccionar" data-id="${tarea.id}">
                    <input id="checkbox-${tarea.id}" type="checkbox" class="checkbox" data-id="${tarea.id}">
                    <label for="checkbox-${tarea.id}" class="check-delete" data-id="${tarea.id}"></label>
                </div>
                <div class="contenido id" data-id="${tarea.id}">${tarea.id}</div>
                <div class="contenido name" data-id="${tarea.id}">${tarea.name}</div>
                <div class="contenido description" data-id="${tarea.id}">${tarea.description}</div>
                <div class="contenido date" data-id="${tarea.id}">${tarea.date}</div>
                <div class="contenido actions" data-id="${tarea.id}">
                    <a id="button-edit-${tarea.id}" href="" class="button-edit mr-4" title="Editar" data-id="${tarea.id}">
                        <i id="icon-edit-${tarea.id}" class="icon-edit fas fa-pen" data-id="${tarea.id}"></i>
                    </a>
                    <a id="button-delete-${tarea.id}" href="" class="button-delete" title="Eliminar" data-id="${tarea.id}">
                        <i id="icon-delete-${tarea.id}" class="icon-delete fas fa-trash" data-id="${tarea.id}"></i>
                    </a>
                </div>
            </div>
        `;
        cards += card;
    }

    return cards;
}

function crearTarjetaFinal(resultados) {
    if (actual_limit >= resultados && resultados > 7) {
        const finalcard = `
            <div id="end-card" class="tarjeta-final">
                <i class="fas fa-flag fa-sm"></i>
                <i class="fas fa-flag fa-lg" title="Final"></i>
                <i class="fas fa-flag fa-sm"></i>
            </div>
        `;
        return finalcard;
    }
    if (actual_limit <= resultados) {
        const showbutton = `
            <button id="button-show" class="boton boton-mostrar active" title="Mostrar Más Tareas">
                <i id="icon-show" class="fas fa-plus fa-lg"></i>
            </button>
        `;
        return showbutton;
    }
}

/* --------------- SELECCIONAR TARJETAS --------------- */

/* Listeners */
cards_container.addEventListener('click', e => {
    const element = e.target;
    const firstclass = element.classList[0];
    const ecs_class = /^tarjeta$|^contenido$/.test(firstclass);

    if (ecs_class) alternarEstadoSeleccionarTarjeta(element);
});
document.addEventListener('keydown', e => desplazarseEntreTarjetas(e));

/* Funciones */
function alternarEstadoSeleccionarTarjeta(elemento) {
    const card = document.querySelector(`#tarjeta-${elemento.dataset.id}`);

    if (card.classList.contains('select')) quitarEstado(card, 'select');
    else {
        const selectcard = document.querySelector('.tarjeta.select');
        if (selectcard) quitarEstado(selectcard, 'select');
        agregarEstado(card, 'select');
    }
}

function desplazarseEntreTarjetas(e) {
    const selectedcard = document.querySelector('.tarjeta.select');
    const cards = document.querySelectorAll('.tarjeta');

    if (e.key == 'ArrowUp' && selectedcard) {
        e.preventDefault();

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (card.classList.contains('select') && i > 0) {
                const cardup = cards[i - 1];
                quitarEstado(selectedcard, 'select');
                agregarEstado(cardup, 'select');
                return;
            }
        }
    }

    if (e.key == 'ArrowDown' && selectedcard) {
        e.preventDefault();

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (card.classList.contains('select') && i < cards.length - 1) {
                const carddown = cards[i + 1];
                quitarEstado(selectedcard, 'select');
                agregarEstado(carddown, 'select');
                return;
            }
        }
    }
}

/* --------------- MOSTRAR MÁS TAREAS --------------- */

/* Listeners */
cards_container.addEventListener('click', e => {
    const element = e.target;
    if (element.id == 'icon-show' || element.id == 'button-show') mostrarMasTareas();
});

/* Funciones */
function mostrarMasTareas() {
    agregarEstadoMostrando();
    const limit = actual_limit + 100;
    listarTareas(limit, undefined, undefined);
}

function agregarEstadoMostrando() {
    const show_button = document.querySelector('#button-show');
    const show_icon = document.querySelector('#icon-show');
    desactivarElemento(show_button);
    cambiarIcono(show_icon, 'fa-plus', ['fa-cog', 'fa-spin']);
}

/* ---------- ACTUALIZAR CONTADORES ---------- */

/* Funciones */
function actualizarContadores(total, resultados, seleccion) {
    actualizarContadorTareasSeleccionadas(seleccion);
    actualizarContadorTareasEncontradas(resultados);
    actualizarContadorTareasTotales(total);
}

function actualizarContadorTareasSeleccionadas(cantidad) {
    cambiarContenido(counter_selection, cantidad);
}

function actualizarContadorTareasEncontradas(resultados) {
    cambiarContenido(counter_results, resultados);
}

function actualizarContadorTareasTotales(total) {
    cambiarContenido(counter_totals, total);
}

/* --------------- FILTRAR/BUSCAR TAREAS --------------- */

/* Variables */
const search_fields = [search_id, search_name, search_description];

/* Listeners */
for (const field of search_fields) field.addEventListener('keyup', () => listarTareas());
for (const field of search_fields) field.addEventListener('search', () => listarTareas());

/* --------------- ORDENAR TAREAS --------------- */

/* Variables */
const sort_headers = [sort_id, sort_name, sort_description, sort_date];

/* Listeners */
for (const header of sort_headers) header.addEventListener('click', e => { ordenarTareas(e), e.preventDefault() });

/* Funciones */
async function ordenarTareas(e) {
    quitarEstadoOrdenar();

    const column = e.target.name;
    const sort = actual_sort == 'DESC' ? 'ASC' : 'DESC';
    await listarTareas(undefined, column, sort);

    agregarEstadoOrdenar(e);
}

function agregarEstadoOrdenar(e) {
    const link = e.target;
    const header = link.parentElement;
    const indicador = actual_sort == 'ASC' ? 'ascendente' : 'descendente';

    agregarEstado(link, 'active')
    header.classList.add(`${indicador}`);
}

function quitarEstadoOrdenar() {
    const link = document.querySelector('.encabezado a.active');
    const indicador = actual_sort == 'ASC' ? 'ascendente' : 'descendente';
    const header = document.querySelector(`.encabezado.${indicador}`);

    quitarEstado(link, 'active')
    header.classList.remove(`${indicador}`);
}

/* ---------- GUARDAR TAREAS ---------- */

/* Listeners */
save_form.addEventListener('submit', e => { guardarTareas(); e.preventDefault() });

/* Funciones */
async function guardarTareas() {
    agregarEstadoGuardando();

    const id = save_id.value;
    const name = save_name.value;
    const description = save_description.value;
    const data = JSON.stringify({ id, name, description });
    const url = save_button.name == 'update' ? 'task-update.php' : 'task-add.php';

    const response = await fetch(url, { method: 'post', body: data });
    const message = await response.text();

    await listarTareas();

    if (save_button.name == 'update') {
        const editcard = document.querySelector('.tarjeta.edit');
        if (editcard) desactivarEstadoEditar(editcard);
        else desactivarEstadoEditar();
    }
    else vaciarFormulario(save_form);

    quitarEstadoGuardando();
    enfocarElemento(save_name);
    mostrarNotificacion(message);
}

function agregarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    deshabilitarElemento(save_button);
    cambiarIcono(icon, 'fa-save', ['fa-cog', 'fa-spin']);
}

function quitarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    habilitarElemento(save_button);
    cambiarIcono(icon, ['fa-cog', 'fa-spin'], 'fa-save');
}

/* --------------- EDITAR TAREAS --------------- */

/* Listeners */
cards_container.addEventListener('click', e => {
    const element = e.target;

    if (element.classList.contains('button-edit') || element.classList.contains('icon-edit')) {
        const card = document.querySelector(`#tarjeta-${element.dataset.id}`);
        alternarEstadoEditar(card);
        e.preventDefault();
    }
});
document.addEventListener('keydown', e => {
    if (e.key == 'Escape' && save_button.name == 'update' && !overlay.classList.contains('active')) {
        const editcard = document.querySelector(`.tarjeta.edit`);
        if (editcard) desactivarEstadoEditar(editcard);
        else desactivarEstadoEditar();
    }
});

/* Funciones */
function alternarEstadoEditar(tarjeta) {
    if (save_button.name == 'save') activarEstadoEditar(tarjeta, save_button);
    else {
        if (tarjeta.classList.contains('edit')) desactivarEstadoEditar(tarjeta);
        else {
            const editcard = document.querySelector('.tarjeta.edit');
            if (editcard) quitarEstado(editcard, 'edit');
            activarEstadoEditar(tarjeta);
        }
    }
}

function activarEstadoEditar(tarjeta, boton) {
    llenarFormularioGuardar(tarjeta);
    if (boton) activarEstadoEditarBoton(boton);
    agregarEstado(tarjeta, 'edit');
    enfocarElemento(save_name);
}

function llenarFormularioGuardar(tarjeta) {
    const id = tarjeta.dataset.id;
    const name = tarjeta.children[2].textContent;
    const description = tarjeta.children[3].textContent;
    cambiarValue(save_id, id);
    cambiarValue(save_name, name);
    cambiarValue(save_description, description);
}

function activarEstadoEditarBoton(boton) {
    cambiarName(boton, 'update');
    cambiarTitle(boton, 'Guardar Cambios');
    agregarEstado(boton, 'edit');
}

function desactivarEstadoEditar(tarjeta) {
    vaciarFormulario(save_form);
    desactivarEstadoEditarBoton(save_button);
    if (tarjeta) quitarEstado(tarjeta, 'edit');
}

function desactivarEstadoEditarBoton(boton) {
    cambiarName(boton, 'save');
    cambiarTitle(boton, 'Guardar');
    quitarEstado(boton, 'edit');
}

/* ---------- ELIMINAR TAREAS ---------- */

/* Listeners */
cards_container.addEventListener('click', e => {
    const element = e.target;

    if (element.classList.contains('button-delete') || element.classList.contains('icon-delete')) {
        const id = [element.dataset.id];
        activarEstadoEliminar(id);
        e.preventDefault();
    }
});
delete_form.addEventListener('submit', e => {
    eliminarTareas();
    e.preventDefault();
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
    if (e.key == 'Enter' && delete_alert.classList.contains('active') && !delete_button.hasAttribute('disabled')) eliminarTareas();
});

/* Funciones */
async function eliminarTareas() {
    agregarEstadoEliminando();

    if (save_button.name == 'update' && delete_keys.includes(save_id.value)) {
        const editcard = document.querySelector('.tarjeta.edit');
        if (editcard) desactivarEstadoEditar(editcard);
        else desactivarEstadoEditar();
    }

    const data = JSON.stringify(delete_keys);
    const response = await fetch('task-delete.php', { method: 'post', body: data });
    const message = await response.text();

    if (!multiple_button.hasAttribute('disabled')) deshabilitarElemento(multiple_button);
    if (checkbox_master.checked) desmarcarElemento(checkbox_master);

    await listarTareas();

    quitarEstadoEliminando();
    desactivarEstadoEliminar();
    mostrarNotificacion(message);
}

function activarEstadoEliminar(claves) {
    delete_keys = claves;
    abrirAlertaEliminar();
}

function desactivarEstadoEliminar() {
    delete_keys = false;
    cerrarAlertaEliminar();
}

function agregarEstadoEliminando() {
    deshabilitarElemento(delete_buttonclose);
    deshabilitarElemento(delete_button);
    deshabilitarElemento(delete_buttoncancel);
    cambiarIcono(delete_icon, 'fa-trash', ['fa-cog', 'fa-spin']);
}

function quitarEstadoEliminando() {
    habilitarElemento(delete_buttonclose);
    habilitarElemento(delete_button);
    habilitarElemento(delete_buttoncancel);
    cambiarIcono(delete_icon, ['fa-cog', 'fa-spin'], 'fa-trash');
}

function abrirAlertaEliminar() {
    activarElementos([overlay, delete_alert]);
}

function cerrarAlertaEliminar() {
    desactivarElementos([overlay, delete_alert]);
}

/* ---------- ELIMINAR MÚLTIPLES TAREAS---------- */

/* Listeners */
multiple_form.addEventListener('submit', e => {
    const keys = obtenerClavesDeCheckboxSeleccionados();
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
        const keys = obtenerClavesDeCheckboxSeleccionados();
        if (keys) activarEstadoEliminar(keys);
        else {
            mostrarNotificacion('No Hay Casillas Seleccionadas', 'warning');
            deshabilitarElemento(multiple_button);
        }
    }
});

/* Funciones */
function obtenerClavesDeCheckboxSeleccionados() {
    const checkboxes = document.querySelectorAll('.tareas .checkbox:checked');
    if (checkboxes.length > 0) {
        const keys = [];
        for (const checkbox of checkboxes) keys.push(checkbox.dataset.id);
        return keys;
    }
}

/* ---------- SELECCIONAR MÚLTIPLES TAREAS ---------- */

/* Listeners */
checkbox_master.addEventListener('change', () => {
    alternarSeleccionarTodosLosCheckbox();
    alternarEstadoEliminarMultiple();
});
document.addEventListener('keydown', e => {
    const selectcard = document.querySelector('.tarjeta.select');

    if (e.code == 'Space' && selectcard) {
        e.preventDefault();
        const checkbox = selectcard.children[0].children[0];
        alternarSeleccionarCheckbox(checkbox);
        alternarEstadoEliminarMultiple();
    }
});
cards_container.addEventListener('change', e => {
    const element = e.target;

    if (element.classList.contains('checkbox')) {
        alternarEstadoEliminarMultiple();
    }
});

/* Funciones */
function alternarEstadoEliminarMultiple() {
    const checkboxes = document.querySelectorAll('.tarjeta .checkbox:checked');
    actualizarContadorTareasSeleccionadas(checkboxes.length);
    alternarEstadoEliminarMultipleBoton(checkboxes);
}

function alternarEstadoEliminarMultipleBoton(checkboxes) {
    if (checkboxes.length > 0) habilitarElemento(multiple_button);
    else deshabilitarElemento(multiple_button);
}

function alternarSeleccionarCheckbox(checkbox) {
    checkbox.checked = checkbox.checked ? false : true;
}

function alternarSeleccionarTodosLosCheckbox() {
    const checkboxes = document.querySelectorAll('.tareas .checkbox');
    const state = checkbox_master.checked;
    for (const checkbox of checkboxes) checkbox.checked = state;
}

/* ---------- SUBIR LISTA ---------- */

/* Listeners */
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

/* Funciones */
async function subirLista(lista) {
    activarEstadoSubiendo();

    const data = new FormData();
    data.append('file', lista);

    const response = await fetch('list-upload.php', { method: 'post', body: data });
    const message = await response.text();

    if (message == 'Lista Guardada') await listarTareas();

    desactivarEstadoSubiendo();
    desactivarEstadoSubir();

    console.log(message);
    mostrarNotificacion(message);
}

function alternarEstadoSubir() {
    const file = upload_input.files[0] ? upload_input.files[0] : 'No File';
    file == 'No File' ? desactivarEstadoSubir() : activarEstadoSubir(file);
}

function activarEstadoSubir(file) {
    activarElemento(upload_field);
    habilitarElemento(upload_button);
    cambiarTitle(upload_field, file.name);
    cambiarTitle(upload_fieldtext, file.name);
    cambiarTexto(upload_fieldtext, file.name);
}

function desactivarEstadoSubir() {
    vaciarFormulario(upload_form);
    desactivarElemento(upload_field);
    deshabilitarElemento(upload_button);
    cambiarTitle(upload_field, 'Buscar Lista');
    cambiarTitle(upload_fieldtext, 'Buscar Lista');
    cambiarTexto(upload_fieldtext, 'Buscar Lista');
}

function activarEstadoSubiendo() {
    cambiarIcono(upload_icon, 'fa-paper-plane', ['fa-cog', 'fa-spin']);
    agregarEstado(upload_field, 'upload')
    agregarEstado(upload_button, 'upload')
}

function desactivarEstadoSubiendo() {
    cambiarIcono(upload_icon, ['fa-cog', 'fa-spin'], 'fa-paper-plane');
    quitarEstado(upload_field, 'upload')
    quitarEstado(upload_button, 'upload')
}

/* --------------- NOTIFICACIONES --------------- */

/* Funciones */
function mostrarNotificacion(mensaje, estado) {
    const contenido = `<strong>${mensaje}</strong>`;
    cambiarContenido(notification, contenido);
    agregarEstado(notification, estado);
    activarElemento(notification);
    setTimeout(() => cerrarNotificacion(estado), 2500);
}

function cerrarNotificacion(estado) {
    desactivarElemento(notification);
    if (estado) quitarEstado(notification, estado);
}

/* --------------- LIMPIAR FILTROS --------------- */

/* Listeners */
clean_button.addEventListener('click', e => {
    limpiarFiltros();
    e.preventDefault();
});

/* Functions */
async function limpiarFiltros() {
    activarEstadoLimpiando();

    vaciarFormulario(search_form);

    await listarTareas(100, undefined, undefined);

    desactivarEstadoLimpiando();
    enfocarElemento(search_name);
}

function activarEstadoLimpiando() {
    cambiarIcono(clean_icon, 'fa-eraser', ['fa-cog', 'fa-spin']);
    deshabilitarElemento(clean_button);
}

function desactivarEstadoLimpiando() {
    cambiarIcono(clean_icon, ['fa-cog', 'fa-spin'], 'fa-eraser');
    habilitarElemento(clean_button);
}

/* --------------- FUNCIONES INTERFAZ --------------- */

function cambiarIcono(elemento, quitar, agregar) {
    if (typeof quitar == 'object') for (const clase of quitar) elemento.classList.remove(clase);
    else elemento.classList.remove(quitar);

    if (typeof agregar == 'object') for (const clase of agregar) elemento.classList.add(clase);
    else elemento.classList.add(agregar);
}

function agregarEstado(elemento, estado) {
    elemento.classList.add(estado);
}

function quitarEstado(elemento, estado) {
    elemento.classList.remove(estado);
}

function habilitarElemento(elemento) {
    elemento.removeAttribute('disabled', true);
}

function deshabilitarElemento(elemento) {
    elemento.setAttribute('disabled', true);
}

function activarElemento(elemento) {
    elemento.classList.add('active');
}

function activarElementos(elementos) {
    for (const elemento of elementos) elemento.classList.add('active');
}

function desactivarElemento(elemento) {
    elemento.classList.remove('active');
}

function desactivarElementos(elementos) {
    for (const elemento of elementos) elemento.classList.remove('active');
}

function cambiarTexto(elemento, texto) {
    elemento.textContent = texto;
}

function cambiarTitle(elemento, titulo) {
    elemento.title = titulo;
}

function cambiarName(elemento, nombre) {
    elemento.name = nombre;
}

function cambiarValue(elemento, valor) {
    elemento.value = valor;
}

function vaciarFormulario(formulario) {
    formulario.reset();
}

function marcarElemento(elemento) {
    elemento.checked = true;
}

function marcarElementos(elementos) {
    for (const elemento of elementos) elemento.checked = true;
}

function desmarcarElemento(elemento) {
    elemento.checked = false;
}

function enfocarElemento(elemento) {
    elemento.focus();
}

function cambiarContenido(contenedor, contenido) {
    contenedor.innerHTML = contenido;
}

function agregarContenido(contenedor, contenido) {
    contenedor.innerHTML += contenido;
}
