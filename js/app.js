const xhr = new XMLHttpRequest();
let lastid, orden;
let limite = 50;
listarTareas();

/*** EVENTOS ***/
/* Filtrar Tareas. */
document.querySelector('#search-id').addEventListener('keyup', filtrarTareas);
document.querySelector('#search-title').addEventListener('keyup', filtrarTareas);
document.querySelector('#search-description').addEventListener('keyup', filtrarTareas);

/* Buscar Tareas*/
document.querySelector('#search-id').addEventListener('search', filtrarTareas);
document.querySelector('#search-title').addEventListener('search', filtrarTareas);
document.querySelector('#search-description').addEventListener('search', filtrarTareas);

/* Ordenar Tareas. */
document.querySelector('#column-id').addEventListener('click', () => ordenarTareas('id'));
document.querySelector('#column-name').addEventListener('click', () => ordenarTareas('title'));
document.querySelector('#column-description').addEventListener('click', () => ordenarTareas('description'));
document.querySelector('#column-date').addEventListener('click', () => ordenarTareas('created'));

/* Guardar Tareas */
document.querySelector('#task-form').addEventListener('submit', guardarTareas);

/* Reiniciar Filtros & Lista */
document.querySelector('#btn-reload').addEventListener('click', reiniciarLista);

/*** FUNCIONES ***/
/* Tareas */
function listarTareas () {
    const id = document.querySelector('#search-id').value;
    const title = document.querySelector('#search-title').value;
    const description = document.querySelector('#search-description').value;
    const limit = limite ? limite : 50;
    const data = JSON.stringify({ id, title, description, limit });

    xhr.open('POST', 'task-list.php', true);
    xhr.send(data);
    xhr.onload = () => crearListaTareas(xhr.response);
}

function crearListaTareas(list) {
    vaciarFormulario();
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
            <div id="tarjeta-${task.id}" class="tarjeta p-3 mb-2 bd-light bd-radius text-center">
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
    const id = document.querySelector('#input-id').value;
    const title = document.querySelector('#input-title').value;
    const description = document.querySelector('#input-description').value;
    const url = savebutton.name == 'update' ? 'task-update.php' : 'task-add.php';
    const data = JSON.stringify({ id, title, description });
    limite = 50;
    
    savebutton.setAttribute('disabled', 'true');
    saveicon.classList.remove('fa-save');
    saveicon.classList.add('fa-cog', 'fa-spin');

    xhr.open('POST', url, true);
    xhr.send(data);
    xhr.onload = () => {
        console.log(xhr.response);
        listarTareas();
        savebutton.removeAttribute('disabled', 'true');
        document.querySelector('#icon-save').classList.remove('fa-cog', 'fa-spin');
        document.querySelector('#icon-save').classList.add('fa-save');
        vaciarFormulario();
        document.querySelector('#input-title').focus();
    }

    e.preventDefault();
}

function eliminarTareas(id) {
    xhr.open('POST', 'task-delete.php', true);
    xhr.send(JSON.stringify({id}));
    xhr.onload = () => {
        console.log(xhr.response);
        listarTareas();
    }
}

function editarTareas(id) {
    const savebutton = document.querySelector('#btn-save');
    const titlefield = document.querySelector('#input-title');
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
            vaciarFormulario(id);
        }
    }
}

/* Interfaz */
function filtrarTareas() {
    limite = 50;
    listarTareas();
}

function mostrarMasTareas() {
    limite = limite ? limite + 50 : 100;
    listarTareas();
}

function ordenarTareas(column) {
    const id = document.querySelector('#search-id').value;
    const title = document.querySelector('#search-title').value;
    const description = document.querySelector('#search-description').value;
    const limit = limite ? limite : 50;
    const order = orden ? orden : 'ASC';
    const data = JSON.stringify({ id, title, description, limit, column, order });

    xhr.open('POST', 'task-list.php', true);
    xhr.send(data);
    xhr.onload = () => {
        crearListaTareas(xhr.response);
        orden = order == 'ASC' ? 'DESC' : 'ASC';
    };
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
            tarjeta.classList.add('bg-clare');
            editbutton.classList.remove('text-transparent');
            deletebutton.classList.remove('text-transparent');
            editbutton.classList.add('text-warning', 'scale-one-five');
            deletebutton.classList.add('text-danger', 'scale-one-five');
        });
        // Mouse Out.
        tarjeta.addEventListener('mouseout', () => {
            tarjeta.classList.remove('bg-clare');
            editbutton.classList.remove('text-warning', 'scale-one-five');
            deletebutton.classList.remove('text-danger', 'scale-one-five');
            editbutton.classList.add('text-transparent');
            deletebutton.classList.add('text-transparent');
        });
    }
}

function agregarTarjetaFinal(message, totaltasks) {
    if (message == 'All Tasks' && totaltasks > 6) {
        const finalcard = `
            <div id="final-list" class="bd-light bd-radius p-3 text-grey text-bold text-center">
                End
            </div>
        `;
        document.querySelector('#tasks').innerHTML += finalcard;
    } else if (message == 'Not All Tasks') {
        const showbutton = `
            <button id="btn-show-down" class="btn btn-light btn-lg btn-block text-grey" title="Mostrar Más Tareas">
                <i class="fas fa-plus fa-lg"></i>
            </button>
        `;
        document.querySelector('#tasks').innerHTML += showbutton;

        // Agregar Función Mostrar Más Tareas.
        document.querySelector('#btn-show-down').addEventListener('click', () => mostrarMasTareas());
    }
}

function llenarFormulario(id) {
    const title = document.querySelector(`#name-${id}`).textContent;
    const description = document.querySelector(`#description-${id}`).textContent;
    document.querySelector('#input-id').value = id;
    document.querySelector('#input-title').value = title;
    document.querySelector('#input-description').value = description;
}

function vaciarFormulario() {
    const savebutton = document.querySelector('#btn-save');
    const taskform = document.querySelector('#task-form');
    if (savebutton.name == 'update') {
        taskform.reset();
        savebutton.name = 'save';
        savebutton.classList.remove('btn-warning');
        savebutton.classList.add('btn-success');
    } else {
        taskform.reset();
    }
}

function reiniciarLista(e) {
    // Vaciar Formulario & Focus a Campo "Title".
    document.querySelector('#search-form').reset();
    document.querySelector('#search-title').focus();
    limite = 50;

    // Enlistar Tareas.
    e.preventDefault();
    listarTareas();
}
