<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="favicon.svg" type="image/svg">
    <title>Tasks App</title>

    <!-- Fontawesome -->
    <script src="lib/js/all.js"></script>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="lib/css/bootstrap.min.css">

    <!-- CSS -->
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/styles.css">
</head>

<body>

    <!-- Navegación -->
    <nav class="navegacion">
        <div class="contenedor px-1 py-3">
            <!-- Logo -->
            <a href="" class="logo" title="Home">
                <i class="fas fa-address-book text-primary"></i><strong> Tasks </strong>App
            </a>

            <!-- Filtros -->
            <div class="filtros ml-auto">
                <form id="search-form" action="" class="form-inline">
                    <!-- Filtro: ID -->
                    <input type="number" id="search-id" class="form-control mr-2" placeholder="Buscar: Clave">
                    <!-- Filtro: Nombre -->
                    <input type="search" id="search-name" class="form-control mr-2" placeholder="Buscar: Nombre">
                    <!-- Filtro: Descripción -->
                    <input type="search" id="search-description" class="form-control mr-2" placeholder="Buscar: Descripción">
                    <!-- Botón: Reiniciar -->
                    <button type="button" id='button-clean' class="btn btn-primary" title="Limpiar Filtros">
                        <i id="icon-clean" class="fas fa-hands-wash" data-fa-transform="grow-3"></i>
                    </button>
                </form>
            </div>
        </div>
    </nav>

    <!-- Formulario & Lista Tareas -->
    <main class="main px-1 py-2">
        <!-- Formulario & Contadores -->
        <div class="formulario p-4">
            <!-- Formulario -->
            <form id="tasks-form">
                <!-- Campo: ID -->
                <div hidden class="form-group">
                    <input id="field-id" class="form-control" type="number" placeholder="ID" disabled>
                </div>
                <!-- Campo: Nombre -->
                <div class="form-group">
                    <input id="field-name" class="form-control" type="text" placeholder="Nombre" required>
                </div>
                <!-- Campo: Descripción -->
                <div class="form-group">
                    <textarea id="field-description" class="form-control" placeholder="Descripción" required></textarea>
                </div>
                <!-- Botón: Guardar -->
                <button id="button-save" type="submit" class="boton-guardar btn btn-success btn-lg btn-block text-center" title="Guardar" name="save">
                    <i id="icon-save" class="fas fa-save"></i>
                </button>
            </form>

            <!-- Contadores -->
            <div class="contadores">
                <div id="" class="contador-busqueda p-2 mt-3">
                    <span>
                        <span class="text-grey">Tareas</span> Encontradas
                    </span>
                    <span id="search-results" class="resultados-busqueda text-bold"></span>
                </div>
                <div id="" class="contador-totales p-2 mt-3">
                    <span>
                        <span class="text-grey">Tareas</span> Totales
                    </span>
                    <span id="total-tasks" class="total-tareas text-bold"></span>
                </div>
            </div>
        </div>

        <!-- Lista Tareas -->
        <div class="lista p-4">
            <!-- Encabezados -->
            <div class="encabezados p-3">
                <div class="encabezado id">
                    <a id="column-id" href="" class="" name="id" title="Ordenar * Clave">
                        #
                    </a>
                </div>
                <div class="encabezado name">
                    <a id="column-name" href="" class="" name="name" title="Ordenar * Nombre">
                        Nombre
                    </a>
                </div>
                <div class="encabezado description">
                    <a id="column-description" href="" class="" name="description" title="Ordenar * Descripción">
                        Descripción
                    </a>
                </div>
                <div class="encabezado date descendente">
                    <a id="column-date" href="" class="active" name="created" title="Ordenar * Fecha">
                        Fecha
                    </a>
                </div>
                <div class="encabezado actions">
                    <span id="column-actions" class="">
                        Acciones
                    </span>
                </div>
            </div>

            <!-- Tareas-->
            <div id="tasks" class="tareas mt-2"></div>

            <!-- Botón Subir -->
            <a id="button-up" href="#inicio-lista" class="boton-subir" title="Principio">
                <i class="fas fa-chevron-up fa-lg"></i>
            </a>
        </div>
    </main>

    <!-- Popup: Eliminar Tarea -->
    <div id="overlay" class="overlay">
        <div id="popup-delete" class="popup-eliminar">
            <!-- Head -->
            <div id="head-popup" class="cabecera-popup">
                <a id="close-popup" href="" class="cerrar-popup">
                    <i class="fas fa-times"></i>
                </a>
            </div>
            <!-- Body -->
            <div id="body-popup" class="cuerpo-popup">
                <span>¿Eliminar Tarea?</span>
            </div>
            <!-- Footer -->
            <div id="footer-popup" class="pie-popup">
                <button id="delete-task" class="btn btn-outline-danger mr-2" name="">
                    <i id="delete-task-icon" class="fas fa-trash fa-sm mr-1"></i>Eliminar
                </button>
                <button id="cancel-delete-task" class="btn btn-success" name="">
                    Cancelar
                </button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="js/app.js"></script>

</body>

</html>