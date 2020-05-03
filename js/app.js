const xhr = new XMLHttpRequest();
let actualid;
let limiteactual = 100;
let actualorder = 'DESC';
let actualcolumn = 'created';
listarTareas();

/*** EVENTOS ***/
/* Cancelar Edición. */
window.addEventListener('keydown', (e) => cancelarEdicionTecla(e));

/* Filtrar Tareas. */
document.querySelector('#search-id').addEventListener('keyup', () => filtrarTareas());
document.querySelector('#search-title').addEventListener('keyup', () => filtrarTareas());
document.querySelector('#search-description').addEventListener('keyup', () => filtrarTareas());

/* Buscar Tareas*/
document.querySelector('#search-id').addEventListener('search', () => filtrarTareas());
document.querySelector('#search-title').addEventListener('search', () => filtrarTareas());
document.querySelector('#search-description').addEventListener('search', () => filtrarTareas());

/* Ordenar Tareas & Agregar Indicador de Orden. */
document.querySelector('#column-id').addEventListener('click', (e) => ordenarTareas(e, 'id'));
document.querySelector('#column-name').addEventListener('click', (e) => ordenarTareas(e, 'title'));
document.querySelector('#column-description').addEventListener('click', (e) => ordenarTareas(e, 'description'));
document.querySelector('#column-date').addEventListener('click', (e) => ordenarTareas(e, 'created'));

/* Guardar Tareas */
document.querySelector('#tasks-form').addEventListener('submit', guardarTareas);

/* Reiniciar Filtros & Lista */
document.querySelector('#button-reload').addEventListener('click', reiniciarFiltros);

/*** FUNCIONES ***/
/* Tareas */
function listarTareas() {
    xhr.open('post', 'task-list.php', true);
    xhr.send();
    xhr.onload = () => crearListaTareas(xhr.response);
}

function crearListaTareas(list) {
    const tasks = JSON.parse(list);
    const taskscontainer = document.querySelector('#tasks');

    if (tasks.message == 'No Tasks') {
        taskscontainer.innerHTML = '';
        taskscontainer.classList.add('bg-happycup');
        actualizarContador(tasks.all, 0);
    }
    else {
        taskscontainer.classList.remove('bg-happycup');

        // Crear Template.
        let template = '';
        tasks.forEach(task => {
            template += `
            <div id="tarjeta-${task.id}" class="tarjeta p-3 mb-2 bd-grey bd-radius text-center">
                <div id="id-${task.id}" class="id text-bold text-grey">${task.id}</div>
                <div id="name-${task.id}" class="name">${task.title}</div>
                <div id="description-${task.id}" class="description">${task.description}</div>
                <div id="date-${task.id}" class="date">${task.date}</div>
                <div id="actions-${task.id}" class="actions">
                    <a id="${task.id}" href="#" class="btn-edit text-transparent" title="Editar">
                        <i class="fas fa-pen"></i>
                    </a>
                    <a id="${task.id}" href="#" class="btn-delete text-transparent" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </div>
            `;
        });

        // Llenar Lista Tareas con el Template.
        taskscontainer.innerHTML = template;

        // Agregar Tarjeta Final a la Lista.
        const message = tasks[0].meta.message;
        const results = tasks[0].meta.results;
        agregarTarjetaFinal(message, results);

        //Actualizar Datos del Contador.
        const total = tasks[0].meta.total;
        actualizarContador(total, results);

        // Agregar Función: Editar Tareas.
        const editbuttons = document.querySelectorAll('.btn-edit');
        agregarFuncionEditar(editbuttons);

        // Agregar Borde a Tarjeta en Edición.
        const savebutton = document.querySelector('#button-save');
        const editcard = document.querySelector(`#tarjeta-${actualid}`);
        if (savebutton.name == 'update' && editcard != null)
            editcard.classList.add('bd-gold');

        // Agregar Función: Eliminar Tareas.
        const deletebuttons = document.querySelectorAll('.btn-delete');
        agregarFuncionEliminar(deletebuttons);

        // Agregar Hover: Tarjetas.
        const tarjetas = document.querySelectorAll('.tarjeta');
        agregarHoverEffect(tarjetas);
    }

    //Mensajes de Consola.
    console.log('Tareas Listadas');
}

function ordenarTareas(e, columna) {
    const id = document.querySelector('#search-id').value;
    const title = document.querySelector('#search-title').value;
    const description = document.querySelector('#search-description').value;
    const limit = limiteactual ? limiteactual : 100;
    const column = columna ? columna : actualcolumn;
    const order = actualorder == 'ASC' ? 'DESC' : 'ASC';
    const data = JSON.stringify({ id, title, description, limit, column, order });

    xhr.open('post', 'task-list.php', true);
    xhr.send(data);
    xhr.onload = () => {
        crearListaTareas(xhr.response);
        if (e)
            agregarIndicadorDeOrden(e);
        ;
    };

    actualorder = order;
    actualcolumn = column;
    if (e)
        e.preventDefault();
}

function guardarTareas(e) {
    const savebutton = document.querySelector('#button-save');
    const saveicon = document.querySelector('#icon-save');

    const id = document.querySelector('#field-id').value;
    const title = document.querySelector('#field-title').value;
    const description = document.querySelector('#field-description').value;
    const data = JSON.stringify({ id, title, description });
    const url = savebutton.name == 'update' ? 'task-update.php' : 'task-add.php';

    savebutton.setAttribute('disabled', 'true');
    saveicon.classList.remove('fa-save');
    saveicon.classList.add('fa-cog', 'fa-spin');
    if (savebutton.name == 'update')
        cancelarEdicion();

    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';

    xhr.open('post', url, true);
    xhr.send(data);
    xhr.onload = () => {
        console.log(xhr.response);
        ordenarTareas();
        document.querySelector('#button-save').removeAttribute('disabled', 'true');
        document.querySelector('#icon-save').classList.remove('fa-cog', 'fa-spin');
        document.querySelector('#icon-save').classList.add('fa-save');
        document.querySelector('#tasks-form').reset();
        document.querySelector('#field-title').focus();
    };

    e.preventDefault();
}

function eliminarTareas(id) {
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';

    xhr.open('post', 'task-delete.php', true);
    xhr.send(JSON.stringify({ id }));
    xhr.onload = () => {
        console.log(xhr.response);
        ordenarTareas();
    };
}

function editarTareas(id) {
    const savebutton = document.querySelector('#button-save');
    const titlefield = document.querySelector('#field-title');
    const card = document.querySelector(`#tarjeta-${id}`);
    const actualcard = document.querySelector(`#tarjeta-${actualid}`);

    if (id !== actualid) {
        actualid = id;
        if (savebutton.name == 'save') {
            llenarFormulario(id);
            cambiarEstadoBotonGuardar();
            card.classList.add('bd-gold');
            titlefield.focus();
        }
        else {
            llenarFormulario(id);
            actualcard.classList.remove('bd-gold');
            card.classList.add('bd-gold');
            titlefield.focus();
        }
    }
    else {
        if (savebutton.name == 'save') {
            llenarFormulario(id);
            cambiarEstadoBotonGuardar();
            card.classList.add('bd-gold');
            titlefield.focus();
        }
        else {
            cancelarEdicion();
        }
    }
}

/* Interfaz */
function filtrarTareas() {
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    ordenarTareas();
}

function mostrarMasTareas() {
    const showbutton = document.querySelector('#btn-show');
    const showicon = document.querySelector('#icon-show');
    showbutton.setAttribute('disabled', 'true');
    showicon.classList.remove('fa-plus');
    showicon.classList.add('fa-cog', 'fa-spin');
    
    limiteactual = limiteactual ? limiteactual + 100 : 200;
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    ordenarTareas();
}

function ordenarTareas(e, columna) {
    const id = document.querySelector('#search-id').value;
    const title = document.querySelector('#search-title').value;
    const description = document.querySelector('#search-description').value;
    const limit = limiteactual ? limiteactual : 100;
    const column = columna ? columna : actualcolumn;
    const order = actualorder == 'ASC' ? 'DESC' : 'ASC';
    const data = JSON.stringify({id, title, description, limit, column, order});

    xhr.open('post', 'task-list.php', true);
    xhr.send(data);
    xhr.onload = () => {
        crearListaTareas(xhr.response);
        if (e) agregarIndicadorDeOrden(e);
        ;
    }

    actualorder = order;
    actualcolumn = column;
    if (e) e.preventDefault();
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

function agregarFuncionEliminar(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const id = button.id;
        button.addEventListener('click', () => eliminarTareas(id));
    }
}

function agregarHoverEffect(tarjetas) {
    for (let i = 0; i < tarjetas.length; i++) {
        const tarjeta = tarjetas[i];
        const editbutton = tarjeta.childNodes[9].childNodes[1];
        const deletebutton = tarjeta.childNodes[9].childNodes[3];
        // Mouse Over.
        tarjeta.addEventListener('mouseover', () => {
            tarjeta.classList.add('bg-transparent');
            editbutton.classList.remove('text-transparent');
            deletebutton.classList.remove('text-transparent');
            editbutton.classList.add('text-yellow', 'scale-one-five');
            deletebutton.classList.add('text-red', 'scale-one-five');
        });
        // Mouse Out.
        tarjeta.addEventListener('mouseout', () => {
            tarjeta.classList.remove('bg-transparent');
            editbutton.classList.remove('text-yellow', 'scale-one-five');
            deletebutton.classList.remove('text-red', 'scale-one-five');
            editbutton.classList.add('text-transparent');
            deletebutton.classList.add('text-transparent');
        });
    }
}

function agregarTarjetaFinal(message, results) {
    if (message == 'All Results' && results > 6) {
        const endcard = `
            <div id="end-card" class="tarjeta-final bd-grey bd-radius p-3 text-bold text-center text-grey bg-transparent">
                <i class="icono fas fa-flag fa-sm"></i>
                <i class="icono fas fa-flag fa-lg"></i>
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

        // Agregar Función Mostrar Más Tareas.
        document.querySelector('#btn-show').addEventListener('click', () => mostrarMasTareas());
    }
}

function agregarIndicadorDeOrden(e) {
    const link = e.target;
    const linkcontainer = e.target.parentNode;
    
    document.querySelector('#column-id').classList.remove('text-green');
    document.querySelector('#column-name').classList.remove('text-green');
    document.querySelector('#column-description').classList.remove('text-green');
    document.querySelector('#column-date').classList.remove('text-green');
    
    link.classList.add('text-green');
    
    document.querySelector('.encabezados .id').classList.remove('ascendente', 'descendente');
    document.querySelector('.encabezados .name').classList.remove('ascendente', 'descendente');
    document.querySelector('.encabezados .description').classList.remove('ascendente', 'descendente');
    document.querySelector('.encabezados .date').classList.remove('ascendente', 'descendente');
    
    const indicador = actualorder == 'ASC' ? 'ascendente' : 'descendente';
    linkcontainer.classList.add(`${indicador}`);
}

function llenarFormulario(id) {
    const title = document.querySelector(`#name-${id}`).textContent;
    const description = document.querySelector(`#description-${id}`).textContent;
    document.querySelector('#field-id').value = id;
    document.querySelector('#field-title').value = title;
    document.querySelector('#field-description').value = description;
}

function vaciarFormulario() {
    const tasksform = document.querySelector('#tasks-form');
    tasksform.reset();
}

function restablecerBotonGuardar() {
    const savebutton = document.querySelector('#button-save');
    savebutton.name = 'save';
    savebutton.classList.remove('btn-warning');
    savebutton.classList.add('btn-success');
}

function cambiarEstadoBotonGuardar() {
    const savebutton = document.querySelector('#button-save');
    savebutton.name = 'update';
    savebutton.classList.remove('btn-success');
    savebutton.classList.add('btn-warning');
}

function reiniciarFiltros(e) {
    document.querySelector('#search-form').reset();

    limiteactual = 100;
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    ordenarTareas();

    document.querySelector('#search-title').focus();
    e.preventDefault();
}

function cancelarEdicionTecla(e) {
    if (e.code == 'Escape') {
        cancelarEdicion();
    }
}

function cancelarEdicion() {
    const savebutton = document.querySelector('#button-save');

    if (savebutton.name == 'update') {
        vaciarFormulario();
        restablecerBotonGuardar();
        document.querySelector(`#tarjeta-${actualid}`).classList.remove('bd-gold');
    }
}
