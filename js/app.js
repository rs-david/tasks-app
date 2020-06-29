//*---------- VARIABLES ----------*//

let actual_limit = 100;
let actual_sort = 'DESC';
let actual_column = 'created';
let actual_editcard = 'No Edit Card';
let delete_keys;

//*---------- ELEMENTOS ----------*//

/* Interfaz */
const overlay = document.querySelector('#overlay');
const checkboxmaster = document.querySelector('#checkbox-master');
const cardscontainer = document.querySelector('#tasks-container');

/* Contadores */
const count_selected = document.querySelector('#selected-tasks');
const count_results = document.querySelector('#search-results');
const count_total = document.querySelector('#total-tasks');

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
const up_form = document.querySelector('#form-upload-list');
const up_input = document.querySelector('#input-upload-list');
const up_field = document.querySelector('#field-upload-list');
const up_fieldtext = document.querySelector('#field-upload-list span');
const up_button = document.querySelector('#button-upload-list');
const up_icon = document.querySelector('#icon-upload-list');

/* Eliminar Tareas */
const del_alert = document.querySelector('#alert-delete');
const del_form = document.querySelector('#form-delete');
const del_button = document.querySelector('#button-delete');
const del_icon = document.querySelector('#icon-delete');
const del_buttoncancel = document.querySelector('#button-cancel-delete');
const del_buttonclose = document.querySelector('#button-close-alert-delete');

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
    save_name.focus();
}

async function listarTareas(limite, columna, orden) {
    const id = search_id.value;
    const name = search_name.value;
    const description = search_description.value;
    const limit = limite ? limite : actual_limit;
    const column = columna ? columna : actual_column;
    const order = orden ? orden : actual_sort == 'ASC' ? 'DESC' : 'ASC';
    const data = JSON.stringify({ id, name, description, limit, column, order });

    const response = await fetch('task-list.php', { method: 'post', body: data });
    const tasks = await response.json();

    actual_limit = limit;
    actual_column = column;
    actual_sort = order;

    crearListaTareas(tasks);
}

function crearListaTareas(tareas) {
    const total = tareas[0] ? tareas[0].total : tareas.total;
    const results = tareas[0] ? tareas[0].results : tareas.results;

    if (results == 0) {
        const background = total == 0 ? 'bg-green-tea' : 'bg-happy-cup';
        cardscontainer.innerHTML = '';
        cardscontainer.classList.add(`${background}`);
        actualizarContadores(total, results);
    }
    else {
        cardscontainer.classList.remove('bg-green-tea', 'bg-happy-cup');

        const template = crearTemplate(tareas);
        cardscontainer.innerHTML = template;
        agregarTarjetaFinal(results);

        const card = document.querySelector(`#tarjeta-${actual_editcard}`);
        if (card != null) agregarEstado(card, 'edit');
        
        alternarSeleccionarTodosLosCheckbox();
        actualizarContadores(total, results);
    }

    console.log('Tareas Listadas');
}

function crearTemplate(tareas) {
    let template = '<div id="inicio-lista"></div>';

    for (const tarea of tareas) {
        const tarjeta = `
            <div id="tarjeta-${tarea.id}" class="tarjeta" data-id="${tarea.id}">
                <div class="contenido seleccionar" data-id="${tarea.id}">
                    <input id="checkbox-${tarea.id}" type="checkbox" class="checkbox" value="${tarea.id}">
                    <label for="checkbox-${tarea.id}" class="check-delete"></label>
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
        template += tarjeta;
    }

    return template;
}

function agregarTarjetaFinal(resultados) {
    if (actual_limit >= resultados && resultados > 7) {
        const endcard = `
            <div id="end-card" class="tarjeta-final p-3">
                <i class="fas fa-flag fa-sm"></i>
                <i class="fas fa-flag fa-lg" title="Final"></i>
                <i class="fas fa-flag fa-sm"></i>
            </div>
        `;
        agregarContenido(cardscontainer, endcard)
    }
    else if (actual_limit <= resultados) {
        const showbutton = `
            <button id="button-show" class="boton boton-mostrar active" title="Mostrar Más Tareas">
                <i id="icon-show" class="fas fa-plus fa-lg"></i>
            </button>
        `;
        agregarContenido(cardscontainer, showbutton)
    }
}

/* --------------- SELECCIONAR TARJETAS --------------- */

/* Listeners */
cardscontainer.addEventListener('click', e => {
    const element = e.target;
    const firstclass = element.classList[0];
    const ecs_class = /^tarjeta$|^seleccionar$|^contenido$/.test(firstclass);

    if (ecs_class) alternarEstadoSeleccionarTarjeta(element);
});

document.addEventListener('keydown', e => desplazarseEntreTarjetas(e));

/* Funciones */
function alternarEstadoSeleccionarTarjeta(elemento) {
    const card = document.querySelector(`#tarjeta-${elemento.dataset.id}`);
    if (card.classList.contains('select')) { quitarEstado(card, 'select'); return }

    const activecard = document.querySelector('.tarjeta.select');
    if (activecard != null) quitarEstado(activecard, 'select');

    agregarEstado(card, 'select');
}

function desplazarseEntreTarjetas(e) {
    const activecard = document.querySelector('.tarjeta.select');

    if (e.code == 'ArrowUp' && activecard != null) {
        e.preventDefault();
        const cards = document.querySelectorAll('.tarjeta');

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (card.classList.contains('select') && i != 0) {
                const card = cards[i - 1];
                quitarEstado(activecard, 'select');
                agregarEstado(card, 'select');
                return;
            }
        }

    }

    if (e.code == 'ArrowDown' && activecard != null) {
        e.preventDefault();
        const cards = document.querySelectorAll('.tarjeta');

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (card.classList.contains('select') && i != cards.length - 1) {
                const card = cards[i + 1];
                quitarEstado(activecard, 'select');
                agregarEstado(card, 'select');
                return;
            }
        }
    }
}

/* --------------- MOSTRAR MÁS TAREAS --------------- */

/* Listeners */
cardscontainer.addEventListener('click', e => {
    const element = e.target;
    if (element.id == 'icon-show' || element.id == 'button-show') mostrarMasTareas();
});

/* Funciones */
function mostrarMasTareas() {
    agregarEstadoMostrando();
    const limit = actual_limit + 100;
    listarTareas(limit, undefined, actual_sort);
}

function agregarEstadoMostrando() {
    const button = document.querySelector('#button-show');
    const icon = document.querySelector('#icon-show');
    desactivarElemento(button);
    cambiarIcono(icon, 'fa-plus', ['fa-cog', 'fa-spin']);
}

/* ---------- ACTUALIZAR CONTADORES ---------- */

/* Funciones */
function actualizarContadores(total, resultados) {
    actualizarContadorTareasSeleccionadas();
    actualizarContadorTareasEncontradas(resultados);
    actualizarContadorTareasTotales(total);
}

function actualizarContadorTareasSeleccionadas() {
    const quantity = document.querySelectorAll('.tarjeta .checkbox:checked').length;
    cambiarContenido(count_selected, quantity);
}

function actualizarContadorTareasEncontradas(resultados) {
    cambiarContenido(count_results, resultados);
}

function actualizarContadorTareasTotales(total) {
    cambiarContenido(count_total, total);
}

/* --------------- FILTRAR/BUSCAR TAREAS --------------- */

/* Variables */
const search_fields = [search_id, search_name, search_description];

/* Listeners */
for (const field of search_fields) field.addEventListener('keyup', () => filtrarTareas());
for (const field of search_fields) field.addEventListener('search', () => filtrarTareas());

/* Funciones */
function filtrarTareas() {
    listarTareas(undefined, undefined, actual_sort);
}

/* --------------- ORDENAR TAREAS --------------- */

/* Variables */
const sort_headers = [sort_id, sort_name, sort_description, sort_date];

/* Listeners */
for (const header of sort_headers) header.addEventListener('click', e => { ordenarTareas(e), e.preventDefault() });

/* Funciones */
async function ordenarTareas(e) {
    quitarEstadoOrdenar();

    const column = e.target.name;
    await listarTareas(undefined, column, undefined);

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
    console.log(message);

    await listarTareas(undefined, undefined, actual_sort);

    const card = document.querySelector('.tarjeta.edit');
    if (save_button.name == 'update' && card != null) desactivarEstadoEditar(); 
    else if (save_button.name == 'update' && card == null) { desactivarEstadoEditarFormulario(); actual_editcard = 'No Edit Card' } 
    else vaciarFormulario(save_form);

    enfocarElemento(save_name);
    quitarEstadoGuardando();
}

function agregarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    desactivarElemento(save_button);
    cambiarIcono(icon, 'fa-save', ['fa-cog', 'fa-spin']);
}

function quitarEstadoGuardando() {
    const icon = document.querySelector('#icon-save');
    activarElemento(save_button);
    cambiarIcono(icon, ['fa-cog', 'fa-spin'], 'fa-save');
}

/* --------------- EDITAR TAREAS --------------- */

/* Listeners */
cardscontainer.addEventListener('click', e => {
    const element = e.target;

    if (element.classList.contains('button-edit') || element.classList.contains('icon-edit')) {
        const id = element.dataset.id;
        const card = document.querySelector(`#tarjeta-${id}`);
        alternarEstadoEditar(card);
        e.preventDefault();
    }
});
document.addEventListener('keydown', e => {
    const editcard = document.querySelector(`.tarjeta.edit`);

    if (e.code == 'Escape' && save_button.name == 'update' && !overlay.classList.contains('active')) { 
        if (editcard == null) { desactivarEstadoEditarFormulario();  actual_editcard = 'No Edit Card' }
        else desactivarEstadoEditar();
    }
});

/* Funciones */
function alternarEstadoEditar(tarjeta) {
    const card = document.querySelector('.tarjeta.edit');

    if (!tarjeta.classList.contains('edit') && save_button.name == 'save') activarEstadoEditar(tarjeta);
    else if (!tarjeta.classList.contains('edit') && save_button.name == 'update') { 
        if (card != null) quitarEstado(card, 'edit'); activarEstadoEditar(tarjeta) 
    }
    else desactivarEstadoEditar();
}

function activarEstadoEditar(tarjeta) {
    llenarFormularioGuardar(tarjeta);
    agregarEstado(tarjeta, 'edit');
    cambiarName(save_button, 'update');
    cambiarTitle(save_button, 'Guardar Cambios');
    agregarEstado(save_button, 'edit');
    enfocarElemento(save_name);
    actual_editcard = tarjeta.dataset.id;
}

function desactivarEstadoEditar() {
    const card = document.querySelector('.tarjeta.edit');
    quitarEstado(card, 'edit');
    desactivarEstadoEditarFormulario();    
    actual_editcard = 'No Edit Card';
}

function desactivarEstadoEditarFormulario() {
    vaciarFormulario(save_form);
    cambiarName(save_button, 'save');
    cambiarTitle(save_button, 'Guardar');
    quitarEstado(save_button, 'edit');
}

function llenarFormularioGuardar(tarjeta) {
    const id = tarjeta.dataset.id;
    const name = tarjeta.children[2].textContent;
    const description = tarjeta.children[3].textContent;
    cambiarValue(save_id, id);
    cambiarValue(save_name, name);
    cambiarValue(save_description, description);
}

/* ---------- ELIMINAR TAREAS ---------- */

/* Listeners */
cardscontainer.addEventListener('click', e => {
    const element = e.target;

    if (element.classList.contains('button-delete') || element.classList.contains('icon-delete')) {
        const id = element.dataset.id;
        const key = [{ id }];
        activarEstadoEliminar(key);
        e.preventDefault();
    }
});
del_form.addEventListener('submit', e => { eliminarTareas(); e.preventDefault() });
del_buttonclose.addEventListener('click', e => { desactivarEstadoEliminar(); e.preventDefault() });
del_buttoncancel.addEventListener('click', e => { desactivarEstadoEliminar(); e.preventDefault() });
document.addEventListener('keydown', e => {
    if (e.code == 'Escape' && del_alert.classList.contains('active') && del_button.classList.contains('active')) desactivarEstadoEliminar();
});

/* Funciones */
async function eliminarTareas() {
    agregarEstadoEliminando();

    if (save_button.name == 'update') desactivarEstadoEditar();

    const data = JSON.stringify(delete_keys);
    const response = await fetch('task-delete.php', { method: 'post', body: data });
    const message = await response.text();

    console.log(message)

    desactivarElemento(multiple_button);
    desmarcarElemento(checkboxmaster);

    await listarTareas(undefined, undefined, actual_sort);

    quitarEstadoEliminando();
    desactivarEstadoEliminar();
}

function activarEstadoEliminar(claves) {
    delete_keys = claves;
    abrirAlertaEliminar();
}

function desactivarEstadoEliminar() {
    delete_keys = NaN;
    cerrarAlertaEliminar();
}

function agregarEstadoEliminando() {
    desactivarElementos([del_buttonclose, del_button, del_buttoncancel]);
    cambiarIcono(del_icon, 'fa-trash', ['fa-cog', 'fa-spin']);
}

function quitarEstadoEliminando() {
    cambiarIcono(del_icon, ['fa-cog', 'fa-spin'], 'fa-trash');
}

function abrirAlertaEliminar() {
    activarElementos([overlay, del_alert, del_buttonclose, del_button, del_buttoncancel]);
}

function cerrarAlertaEliminar() {
    desactivarElementos([overlay, del_alert, del_buttonclose, del_button, del_buttoncancel]);
}

/* ---------- ELIMINAR TAREAS MÚLTIPLES ---------- */

/* Listeners */
multiple_form.addEventListener('submit', e => {
    const keys = obtenerClavesDeCheckboxSeleccionados();
    activarEstadoEliminar(keys);
    e.preventDefault();
});

/* Funciones */
function obtenerClavesDeCheckboxSeleccionados() {
    const checkboxes = document.querySelectorAll('.tareas .checkbox:checked');
    const claves = [];

    for (const checkbox of checkboxes) {
        const id = checkbox.value;
        claves.push({ id });
    }

    return claves;
}

/* ---------- SELECCIONAR TAREAS MÚLTIPLES ---------- */

/* Listeners */
checkboxmaster.addEventListener('change', () => {
    alternarSeleccionarTodosLosCheckbox();
    alternarEstadoEliminarMultiple();
});
document.addEventListener('keydown', e => {
    const activecard = document.querySelector('.tarjeta.select');

    if (e.code == 'Space' && activecard != null) {
        e.preventDefault();
        const checkbox = activecard.children[0].children[0];

        alternarSeleccionarCheckbox(checkbox);
        alternarEstadoEliminarMultiple();
    }
});
cardscontainer.addEventListener('change', e => {
    const element = e.target;

    if (element.classList.contains('checkbox')) {
        alternarEstadoEliminarMultiple();
    }
});

/* Funciones */
function alternarSeleccionarCheckbox(checkbox) {
    checkbox.checked = checkbox.checked == true ? false : true;
}

function alternarEstadoEliminarMultiple() {
    actualizarContadorTareasSeleccionadas();
    alternarEstadoActivoBotonEliminacionMultiple();
}

function alternarSeleccionarTodosLosCheckbox() {
    const checkboxes = document.querySelectorAll('.tareas .checkbox');
    const state = checkboxmaster.checked;

    for (const checkbox of checkboxes) { checkbox.checked = state }
}

function alternarEstadoActivoBotonEliminacionMultiple() {
    const active = verificarSiHayCheckboxActivados();
    active == true ? activarElemento(multiple_button) : desactivarElemento(multiple_button);
}

function verificarSiHayCheckboxActivados() {
    const checkboxes = document.querySelectorAll('.tareas .checkbox:checked');
    return checkboxes.length > 0 ? true : false;
}

/* ---------- SUBIR LISTA ---------- */

/* Listeners */
up_input.addEventListener('change', () => alternarEstadoSubir());
up_form.addEventListener('submit', e => { subirLista(); e.preventDefault() });

/* Funciones */
async function subirLista() {
    activarEstadoSubiendo();

    const file = up_input.files[0];
    const data = new FormData();
    data.append('file', file);

    const response = await fetch('list-upload.php', { method: 'post', body: data });
    const message = await response.text();
    console.log(message);

    if (message == 'Tareas Guardadas') await listarTodasLasTareas();

    desactivarEstadoSubiendo();
    desactivarEstadoSubir();
}

function alternarEstadoSubir() {
    const file = up_input.files[0] ? up_input.files[0] : 'No File';
    file == 'No File' ? desactivarEstadoSubir() : activarEstadoSubir(file);
}

function activarEstadoSubir(file) {
    activarElemento(up_field);
    activarElemento(up_button);
    cambiarTitle(up_field, file.name);
    cambiarTitle(up_fieldtext, file.name);
    cambiarTexto(up_fieldtext, file.name);
}

function desactivarEstadoSubir() {
    vaciarFormulario(up_form);
    desactivarElemento(up_field);
    desactivarElemento(up_button);
    cambiarTitle(up_field, 'Buscar Lista');
    cambiarTitle(up_fieldtext, 'Buscar Lista');
    cambiarTexto(up_fieldtext, 'Buscar Lista');
}

function activarEstadoSubiendo() {
    cambiarIcono(up_icon, 'fa-paper-plane', ['fa-cog', 'fa-spin']);
    agregarEstado(up_field, 'upload')
    agregarEstado(up_button, 'upload')
}

function desactivarEstadoSubiendo() {
    cambiarIcono(up_icon, ['fa-cog', 'fa-spin'], 'fa-paper-plane');
    quitarEstado(up_field, 'upload')
    quitarEstado(up_button, 'upload')
}

/* --------------- LIMPIAR FILTROS --------------- */

/* Listeners */
clean_button.addEventListener('click', e => { limpiarFiltros(); e.preventDefault() });

/* Functions */
async function limpiarFiltros() {
    activarEstadoLimpiando();

    vaciarFormulario(search_form);

    await listarTareas(100, undefined, actual_sort);

    desactivarEstadoLimpiando();
    enfocarElemento(search_name);
}

function activarEstadoLimpiando() {
    cambiarIcono(clean_icon, 'fa-eraser', ['fa-cog', 'fa-spin']);
    desactivarElemento(clean_button);
}

function desactivarEstadoLimpiando() {
    cambiarIcono(clean_icon, ['fa-cog', 'fa-spin'], 'fa-eraser');
    activarElemento(clean_button);
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
