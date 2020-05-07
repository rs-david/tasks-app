const xhr = new XMLHttpRequest();
let actualid, actuallimit = 100, actualorder = 'DESC', actualcolumn = 'created';
listarTareas();

/*** EVENTOS ***/
/* Cancelar Eventos. */
window.addEventListener('keydown', (e) => cancelarEventos(e));

/* Filtrar Tareas. */
document.querySelector('#search-id').addEventListener('keyup', filtrarTareas);
document.querySelector('#search-name').addEventListener('keyup', filtrarTareas);
document.querySelector('#search-description').addEventListener('keyup', filtrarTareas);

/* Buscar Tareas*/
document.querySelector('#search-id').addEventListener('search', filtrarTareas);
document.querySelector('#search-name').addEventListener('search', filtrarTareas);
document.querySelector('#search-description').addEventListener('search', filtrarTareas);

/* Ordenar Tareas & Agregar Indicador de Orden. */
document.querySelector('#column-id').addEventListener('click', (e) => { ordenarTareas(e); e.preventDefault() });
document.querySelector('#column-name').addEventListener('click', (e) => { ordenarTareas(e); e.preventDefault() });
document.querySelector('#column-description').addEventListener('click', (e) => { ordenarTareas(e); e.preventDefault() });
document.querySelector('#column-date').addEventListener('click', (e) => { ordenarTareas(e); e.preventDefault() });

/* Guardar Tareas */
document.querySelector('#tasks-form').addEventListener('submit', guardarTareas);

/* Reiniciar Filtros & Lista */
document.querySelector('#button-clean').addEventListener('click', (e) => { limpiarFiltros(); e.preventDefault() });

/* Eliminar Tareas. */
document.querySelector('#delete-task').addEventListener('click', eliminarTareas);

/* Cancelar: Eliminar Tarea. */
document.querySelector('#close-popup').addEventListener('click', (e) => { cerrarPopupEliminar(); e.preventDefault() });
document.querySelector('#cancel-delete-task').addEventListener('click', (e) => { cerrarPopupEliminar(); e.preventDefault() });

/*** FUNCIONES ***/
/* Tareas */
function listarTareas() {
    xhr.open('post', 'task-list.php', true);
    xhr.send();
    xhr.onload = () => {
        crearListaTareas(xhr.response);
        document.querySelector('#field-name').focus();
    }
}

function crearListaTareas(list) {
    const tasks = JSON.parse(list);
    const taskscontainer = document.querySelector('#tasks');

    if (tasks.message == 'No Results') {
        const background = tasks.all == 0 ? 'bg-green-tea' : 'bg-happy-cup';
        taskscontainer.innerHTML = '';
        taskscontainer.classList.add(`${background}`);
        actualizarContador(tasks.all, 0);
    }
    else {
        taskscontainer.classList.remove('bg-green-tea', 'bg-happy-cup');

        // Crear Template.
        const template = crearTemplate(tasks);

        // Llenar Lista Tareas con el Template.
        taskscontainer.innerHTML = template;

        // Agregar Tarjeta Final a la Lista.
        const message = tasks[0].meta.message;
        const results = tasks[0].meta.results;
        agregarTarjetaFinal(message, results);

        // Agregar Función: Editar Tareas.
        const editbuttons = document.querySelectorAll('.button-edit');
        agregarFuncionEditar(editbuttons);

        // Agregar Función: Eliminar Tareas.
        const deletebuttons = document.querySelectorAll('.button-delete');
        agregarFuncionAbrirPopupEliminar(deletebuttons);
        
        // Agregar Borde a Tarjeta en Edición.
        const savebutton = document.querySelector('#button-save');
        const card = document.querySelector(`#tarjeta-${actualid}`);
        if (savebutton.name == 'update' && card != null) agregarEstadoEdicionTarjeta(actualid);

        // Agregar Hover: Tarjetas.
        const cards = document.querySelectorAll('.tarjeta');
        agregarHoverEffect(cards);

        //Actualizar Datos del Contador.
        const total = tasks[0].meta.total;
        actualizarContador(total, results);
    }

    //Mensajes de Consola.
    console.log('Tareas Listadas');
}

function crearTemplate(tasks) {
    let template = '<div id="inicio-lista"></div>';
    tasks.forEach(task => {
        template += `
        <div id="tarjeta-${task.id}" class="tarjeta p-3 mb-2 bd-grey bd-radius text-center">
            <div id="id-${task.id}" class="id text-bold text-grey">${task.id}</div>
            <div id="name-${task.id}" class="name">${task.name}</div>
            <div id="description-${task.id}" class="description">${task.description}</div>
            <div id="date-${task.id}" class="date">${task.date}</div>
            <div id="actions-${task.id}" class="actions">
                <a id="${task.id}" href="#" class="button-edit text-transparent" title="Editar">
                    <i class="fas fa-pen"></i>
                </a>
                <a id="${task.id}" href="#" class="button-delete text-transparent" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </a>
            </div>
        </div>
        `;
    });
    return template;
}

function ordenarTareas(e) {
    const id = document.querySelector('#search-id').value;
    const name = document.querySelector('#search-name').value;
    const description = document.querySelector('#search-description').value;
    const limit = actuallimit ? actuallimit : 100;
    const column = e ? e.target.name : actualcolumn;
    const order = actualorder == 'ASC' ? 'DESC' : 'ASC';
    const data = JSON.stringify({ id, name, description, limit, column, order });

    xhr.open('post', 'task-list.php', true);
    xhr.send(data);
    xhr.onload = () => {
        crearListaTareas(xhr.response);
        if (e) agregarIndicadorDeOrden(e);
    }

    actualorder = order;
    actualcolumn = column;
}

function guardarTareas(e) {
    const savebutton = document.querySelector('#button-save');
    const id = document.querySelector('#field-id').value;
    const name = document.querySelector('#field-name').value;
    const description = document.querySelector('#field-description').value;
    const data = JSON.stringify({id, name, description});
    const url = savebutton.name == 'update' ? 'task-update.php' : 'task-add.php';
    
    agregarEstadoGuardando();
    
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';

    xhr.open('post', url, true);
    xhr.send(data);
    xhr.onload = () => {
        console.log(xhr.response);
        ordenarTareas();
        quitarEstadoGuardando();
        savebutton.name == 'update' ? cancelarEdicion() : vaciarFormulario();
        document.querySelector('#field-name').focus();
    };

    e.preventDefault();
}

function eliminarTareas() {
    const buttondelete = document.querySelector('#delete-task');
    const id = buttondelete.name;

    agregarEstadoEliminando();
    if (actualid == id) cancelarEdicion();

    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';

    xhr.open('post', 'task-delete.php', true);
    xhr.send(JSON.stringify({ id }));
    xhr.onload = () => {
        console.log(xhr.response);
        ordenarTareas();
        quitarEstadoEliminando();
        cerrarPopupEliminar();
    };
}

function editarTareas(id) {
    const savebutton = document.querySelector('#button-save');
    const namefield = document.querySelector('#field-name');

    if (id !== actualid) {
        if (savebutton.name == 'save') {
            llenarFormulario(id);
            agregarEstadoEdicionBotonGuardar();
            agregarEstadoEdicionTarjeta(id);
            namefield.focus();
        }
        else {
            llenarFormulario(id);
            quitarEstadoEdicionTarjeta(actualid);
            agregarEstadoEdicionTarjeta(id);
            namefield.focus();
        }
        actualid = id;
    }
    else {
        if (savebutton.name == 'save') {
            llenarFormulario(id);
            agregarEstadoEdicionBotonGuardar();
            agregarEstadoEdicionTarjeta(id);
            namefield.focus();
        }
        else {
            cancelarEdicion();
        }
    }
}

function filtrarTareas() {
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    ordenarTareas();
}

function mostrarMasTareas() {
    cambiarEstadoBotonMostrar();
    
    actuallimit = actuallimit ? actuallimit + 100 : actuallimit * 2;
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    ordenarTareas();
}

function cambiarEstadoBotonMostrar() {
    const showbutton = document.querySelector('#btn-show');
    const showicon = document.querySelector('#icon-show');
    showbutton.setAttribute('disabled', 'true');
    showicon.classList.remove('fa-plus');
    showicon.classList.add('fa-cog', 'fa-spin');
}

/* Interfaz */
function limpiarFiltros(e) {
    document.querySelector('#search-form').reset();

    actuallimit = 100;
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    ordenarTareas();

    document.querySelector('#search-name').focus();
}

function actualizarContador(totaltasks, results) {
    document.querySelector('#total-tasks').innerHTML = totaltasks;
    document.querySelector('#search-results').innerHTML = results;
}

function agregarFuncionEditar(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const id = button.id;
        button.addEventListener('click', () => editarTareas(id));
    }
}

function agregarFuncionAbrirPopupEliminar(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const id = button.id;
        button.addEventListener('click', () => abrirPopupEliminar(id));
    }
}

function agregarHoverEffect(tarjetas) {
    for (let i = 0; i < tarjetas.length; i++) {
        const tarjeta = tarjetas[i];
        const editbutton = tarjeta.childNodes[9].childNodes[1];
        const deletebutton = tarjeta.childNodes[9].childNodes[3];
        // Mouse Over.
        tarjeta.addEventListener('mouseover', () => {
            editbutton.classList.remove('text-transparent');
            deletebutton.classList.remove('text-transparent');
            editbutton.classList.add('text-yellow', 'scale-one-five');
            deletebutton.classList.add('text-red', 'scale-one-five');
        });
        // Mouse Out.
        tarjeta.addEventListener('mouseout', () => {
            editbutton.classList.remove('text-yellow', 'scale-one-five');
            deletebutton.classList.remove('text-red', 'scale-one-five');
            editbutton.classList.add('text-transparent');
            deletebutton.classList.add('text-transparent');
        });
    }
}

function agregarTarjetaFinal(message, results) {
    if (message == 'All Results' && results > 7) {
        const endcard = `
            <div id="end-card" class="tarjeta-final bd-grey bd-radius p-3 text-bold text-center text-grey bg-transparent">
                <i class="icono fas fa-flag fa-sm"></i>
                <i class="icono fas fa-flag fa-lg" title="Final"></i>
                <i class="icono fas fa-flag fa-sm"></i>
            </div>
        `;
        document.querySelector('#tasks').innerHTML += endcard;
    } else if (message == 'Not All Results') {
        const showbutton = `
            <button id="btn-show" class="btn btn-light btn-lg btn-block text-grey" title="Mostrar Más Tareas">
                <i id="icon-show" class="fas fa-plus fa-lg"></i>
            </button>
        `;
        document.querySelector('#tasks').innerHTML += showbutton;
        document.querySelector('#btn-show').addEventListener('click', () => mostrarMasTareas());
    }
}

function agregarIndicadorDeOrden(e) {
    const link = e.target;
    const header = e.target.parentElement;
    const indicador = actualorder == 'ASC' ? 'ascendente' : 'descendente';
    
    const links = document.querySelectorAll('.encabezado a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const header = links[i].parentElement;
        link.classList.remove('text-green');
        header.classList.remove('ascendente', 'descendente');
    }

    link.classList.add('text-green');
    header.classList.add(`${indicador}`);
}

function llenarFormulario(id) {
    const name = document.querySelector(`#name-${id}`).textContent;
    const description = document.querySelector(`#description-${id}`).textContent;
    document.querySelector('#field-id').value = id;
    document.querySelector('#field-name').value = name;
    document.querySelector('#field-description').value = description;
}

function vaciarFormulario() {
    const tasksform = document.querySelector('#tasks-form');
    tasksform.reset();
}

function agregarEstadoGuardando() {
    const savebutton = document.querySelector('#button-save');
    const saveicon = document.querySelector('#icon-save');

    savebutton.setAttribute('disabled', 'true');
    saveicon.classList.remove('fa-save');
    saveicon.classList.add('fa-cog', 'fa-spin');
}

function quitarEstadoGuardando() {
    const savebutton = document.querySelector('#button-save');
    const saveicon = document.querySelector('#icon-save');

    savebutton.removeAttribute('disabled', 'true');
    saveicon.classList.remove('fa-cog', 'fa-spin');
    saveicon.classList.add('fa-save');
}

function agregarEstadoEliminando() {
    const deletebutton = document.querySelector('#delete-task');
    const deleteicon = document.querySelector('#delete-task-icon');

    deletebutton.setAttribute('disabled', 'true');
    deleteicon.classList.remove('fa-trash');
    deleteicon.classList.add('fa-cog', 'fa-spin'); 
}

function quitarEstadoEliminando() {
    const deletebutton = document.querySelector('#delete-task');
    const deleteicon = document.querySelector('#delete-task-icon');

    deletebutton.removeAttribute('disabled', 'true');
    deleteicon.classList.add('fa-trash');
    deleteicon.classList.remove('fa-cog', 'fa-spin'); 
}

function agregarEstadoEdicionTarjeta(id) {
    document.querySelector(`#tarjeta-${id}`).classList.add('bd-edit', 'bg-edit');
}

function quitarEstadoEdicionTarjeta(id) {
    document.querySelector(`#tarjeta-${id}`).classList.remove('bd-edit', 'bg-edit');
}

function agregarEstadoEdicionBotonGuardar() {
    const savebutton = document.querySelector('#button-save');
    savebutton.name = 'update';
    savebutton.title = 'Actualizar';
    savebutton.classList.remove('btn-success');
    savebutton.classList.add('btn-warning');
}

function quitarEstadoEdicionBotonGuardar() {
    const savebutton = document.querySelector('#button-save');
    savebutton.name = 'save';
    savebutton.title = 'Guardar';
    savebutton.classList.remove('btn-warning');
    savebutton.classList.add('btn-success');
}

function cancelarEdicion() {
    const savebutton = document.querySelector('#button-save');
    if (savebutton.name == 'update') {
        vaciarFormulario();
        quitarEstadoEdicionBotonGuardar();
        quitarEstadoEdicionTarjeta(actualid);
    }
}

function abrirPopupEliminar(id) {
    document.querySelector('#overlay').classList.add('active');
    document.querySelector('#popup-delete').classList.add('active');
    document.querySelector('#delete-task').name = id;
}

function cerrarPopupEliminar() {
    document.querySelector('#overlay').classList.remove('active');
    document.querySelector('#popup-delete').classList.remove('active');
    document.querySelector('#delete-task').name = '';
}

function cancelarEventos(e) {
    const savebutton = document.querySelector('#button-save');
    const overlay = document.querySelector('#overlay');
    const response = overlay.classList.contains('active');

    if (e.code == 'Escape' && response == true) { cerrarPopupEliminar(); return };
    if (e.code == 'Escape' && savebutton.name == 'update') { cancelarEdicion(); return };
}
