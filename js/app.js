const xhr = new XMLHttpRequest();
let lastid;
let limiteactual = 100;
let actualorder = 'DESC';
let actualcolumn = 'created';
listarTareas();

/*** EVENTOS ***/
/* Filtrar Tareas. */
document.querySelector('#search-id').addEventListener('keyup', () => filtrarTareas());
document.querySelector('#search-title').addEventListener('keyup', () => filtrarTareas());
document.querySelector('#search-description').addEventListener('keyup', () => filtrarTareas());

/* Buscar Tareas*/
document.querySelector('#search-id').addEventListener('search', () => filtrarTareas());
document.querySelector('#search-title').addEventListener('search', () => filtrarTareas());
document.querySelector('#search-description').addEventListener('search', () => filtrarTareas());

/* Ordenar Tareas. */
document.querySelector('#column-id').addEventListener('click', () => ordenarTareas('id'));
document.querySelector('#column-name').addEventListener('click', () => ordenarTareas('title'));
document.querySelector('#column-description').addEventListener('click', () => ordenarTareas('description'));
document.querySelector('#column-date').addEventListener('click', () => ordenarTareas('created'));

//* Agregar Indicador de Orden *//
document.querySelector('#column-id').addEventListener('click', agregarIndicadorDeOrden);
document.querySelector('#column-name').addEventListener('click', agregarIndicadorDeOrden);
document.querySelector('#column-description').addEventListener('click', agregarIndicadorDeOrden);
document.querySelector('#column-date').addEventListener('click', agregarIndicadorDeOrden);

/* Guardar Tareas */
document.querySelector('#tasks-form').addEventListener('submit', guardarTareas);

/* Reiniciar Filtros & Lista */
document.querySelector('#btn-reload').addEventListener('click', reiniciarFiltros);

/*** FUNCIONES ***/
/* Tareas */
function listarTareas() {
    xhr.open('post', 'task-list.php', true);
    xhr.send();
    xhr.onload = () => crearListaTareas(xhr.response);
}

function crearListaTareas(list) {
    vaciarFormulario();
    reiniciarBotonGuardar();
    const taskscontainer = document.querySelector('#tasks');

    if (list == 'No Tasks') {
        taskscontainer.innerHTML = '';
        taskscontainer.classList.add('bg-happycup');
        mostrarCantidadTareas(0);
    } else {
        taskscontainer.classList.remove('bg-happycup');
        const tasks = JSON.parse(list);

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

        // Llenar Lista Tareas.
        taskscontainer.innerHTML = template;

        // Agregar Botón Mostrar Más Tareas o Tarjeta Final en La Lista.
        const message = tasks[0].mensaje;
        const totaltasks = tasks[0].totaltasks;
        agregarTarjetaFinal(message, totaltasks);

        // Agregar Función: Editar Tareas.
        const editbuttons = document.querySelectorAll('.btn-edit');
        agregarFuncionEditar(editbuttons);

        // Agregar Función: Eliminar Tareas.
        const deletebuttons = document.querySelectorAll('.btn-delete');
        agregarFuncionEliminar(deletebuttons);

        // Agregar Hover: Tarjetas.
        const tarjetas = document.querySelectorAll('.tarjeta');
        agregarHoverEffect(tarjetas);

        //Actualizar Datos del Contador.
        mostrarCantidadTareas(totaltasks);
    }

    //Mensajes de Consola.
    console.log('Tareas Listadas');
}

function guardarTareas(e) {
    const savebutton = document.querySelector('#btn-save');
    const saveicon = document.querySelector('#icon-save');

    const id = document.querySelector('#field-id').value;
    const title = document.querySelector('#field-title').value;
    const description = document.querySelector('#field-description').value;
    const data = JSON.stringify({id, title, description});
    const url = savebutton.name == 'update' ? 'task-update.php' : 'task-add.php';
    
    savebutton.setAttribute('disabled', 'true');
    saveicon.classList.remove('fa-save');
    saveicon.classList.add('fa-cog', 'fa-spin');

    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    
    xhr.open('post', url, true);
    xhr.send(data);
    xhr.onload = () => {
        console.log(xhr.response);
        ordenarTareas();
        savebutton.removeAttribute('disabled', 'true');
        document.querySelector('#icon-save').classList.remove('fa-cog', 'fa-spin');
        document.querySelector('#icon-save').classList.add('fa-save');
        document.querySelector('#field-title').focus();
    }
    
    e.preventDefault();
}

function eliminarTareas(id) {
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';

    xhr.open('post', 'task-delete.php', true);
    xhr.send(JSON.stringify({id}));
    xhr.onload = () => {
        console.log(xhr.response);
        ordenarTareas();
    }
}

function editarTareas(id) {
    const savebutton = document.querySelector('#btn-save');
    const titlefield = document.querySelector('#field-title');
    const mode = savebutton.name;

    /* En Caso que se Presione un Botón "Editar" por Primera Vez o se Presione uno Diferente. */
    if (id !== lastid) {
        lastid = id;
        /* Cuando se Presiona un Botón por Primera Vez. */
        if (mode == 'save') {
            llenarFormulario(id);
            savebutton.classList.remove('btn-success');
            savebutton.classList.add('btn-warning');
            titlefield.focus();
            savebutton.name = 'update';
            /* Cuando se Presiona un Botón Distinto al Último Presionado. */
        } else {
            llenarFormulario(id);
            titlefield.focus();
        }
        /* Cuando Se Presiona El Mismo Botón */
    } else {
        /* Cuando El Formulario Esta Vacío */
        if (mode == 'save') {
            llenarFormulario(id);
            savebutton.classList.remove('btn-success');
            savebutton.classList.add('btn-warning');
            titlefield.focus();
            savebutton.name = 'update';
            /* Cuando Esta Lleno El Formulario */
        } else {
            vaciarFormulario();
            reiniciarBotonGuardar();
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

function ordenarTareas(columna) {
    const id = document.querySelector('#search-id').value;
    const title = document.querySelector('#search-title').value;
    const description = document.querySelector('#search-description').value;
    const limit = limiteactual ? limiteactual : 100;
    const column = columna ? columna : actualcolumn;
    const order = actualorder == 'ASC' ? 'DESC' : 'ASC';
    const data = JSON.stringify({id, title, description, limit, column, order});

    xhr.open('post', 'task-list.php', true);
    xhr.send(data);
    xhr.onload = () => crearListaTareas(xhr.response);

    actualorder = order;
    actualcolumn = column;
    console.log(column, order);
}

function mostrarCantidadTareas(cantidad) {
    const contador = document.querySelector('#contador');
    const mensaje = 'Totales';
    contador.innerHTML = `
        <p class="cantidad m-none p-1 text-bold font-large">${cantidad}</p>
        <p class="mensaje m-none p-1">Tareas <span class="text-grey">${mensaje}</span></p>
    `;
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
            editbutton.classList.add('text-warning', 'scale-one-five');
            deletebutton.classList.add('text-danger', 'scale-one-five');
        });
        // Mouse Out.
        tarjeta.addEventListener('mouseout', () => {
            tarjeta.classList.remove('bg-transparent');
            editbutton.classList.remove('text-warning', 'scale-one-five');
            deletebutton.classList.remove('text-danger', 'scale-one-five');
            editbutton.classList.add('text-transparent');
            deletebutton.classList.add('text-transparent');
        });
    }
}

function agregarTarjetaFinal(message, totaltasks) {
    if (message == 'All Tasks' && totaltasks > 6) {
        const endcard = `
            <div id="end-card" class="bd-grey bd-radius p-3 text-grey text-bold text-center">
                End
            </div>
        `;
        document.querySelector('#tasks').innerHTML += endcard;
    } else if (message == 'Not All Tasks') {
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

function agregarIndicadorDeOrden() {
    document.querySelector('#column-id').classList.remove('text-green');
    document.querySelector('#column-name').classList.remove('text-green');
    document.querySelector('#column-description').classList.remove('text-green');
    document.querySelector('#column-date').classList.remove('text-green');

    this.classList.add('text-green');
    
    document.querySelector('.encabezados .id').classList.remove('ascendente', 'descendente');
    document.querySelector('.encabezados .name').classList.remove('ascendente', 'descendente');
    document.querySelector('.encabezados .description').classList.remove('ascendente', 'descendente');
    document.querySelector('.encabezados .date').classList.remove('ascendente', 'descendente');

    const indicador = actualorder == 'ASC' ? 'ascendente' : 'descendente';
    this.parentNode.classList.add(`${indicador}`);
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

function reiniciarBotonGuardar() {
    const savebutton = document.querySelector('#btn-save');

    if (savebutton.name == 'update') {
        savebutton.name = 'save';
        savebutton.classList.remove('btn-warning');
        savebutton.classList.add('btn-success');
    }
}

function reiniciarFiltros(e) {
    document.querySelector('#search-form').reset();
    limiteactual = 100;
    actualorder = actualorder == 'ASC' ? 'DESC' : 'ASC';
    ordenarTareas();
    document.querySelector('#search-title').focus();
    e.preventDefault();
}

