<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tasks App</title>
    
    <!-- Fontawesome -->
    <script src="lib/js/all.min.js"></script>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="lib/css/bootstrap.css">

    <!-- CSS -->
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/styles.css">
</head>

<body>

    <!-- Navegación -->
    <nav class="navegacion">
        <div class="contenedor px-1 py-3">
            <!-- Logo -->
            <a href="" class="logo">
                <i class="fas fa-address-book text-primary"></i><strong> Tasks </strong>App
            </a>

            <!-- Filtros -->
            <div class="filtros ml-auto">
                <form id="search-form" action="" class="form-inline">
                    <!-- Filtro: ID -->
                    <input type="number" id="search-id" class="form-control mr-2" placeholder="Buscar: Clave">
                    <!-- Filtro: Tarea -->
                    <input type="search" id="search-title" class="form-control mr-2" placeholder="Buscar: Nombre">
                    <!-- Filtro: Descripción -->
                    <input type="search" id="search-description" class="form-control mr-2" placeholder="Buscar: Descripción">
                    <!-- Botón: Reiniciar -->
                    <button type="button" id='btn-reload' class="btn btn-primary" title="Reiniciar Filtros">
                        <i id="icon-reload" class="fas fa-redo-alt"></i>
                    </button>
                </form>
            </div>
        </div>
    </nav>

    <!-- Formulario & Lista Tareas -->
    <main class="main px-1 py-2">
        <!-- Formulario & Contador -->
        <div class="formulario p-4">
            <!-- Formulario -->
            <form id="tasks-form">
                <!-- Campo: ID -->
                <div hidden class="form-group">
                    <input id="field-id" class="form-control" type="number" placeholder="ID" disabled>
                </div>
                <!-- Campo: Title -->
                <div class="form-group">
                    <input id="field-title" class="form-control" type="text" placeholder="Nombre" autofocus required>
                </div>
                <!-- Campo: Description -->
                <div class="form-group">
                    <textarea id="field-description" class="form-control" placeholder="Descripción" required></textarea>
                </div>
                <!-- Botón: Guardar -->
                <button id="btn-save" type="submit" class="btn btn-success btn-lg btn-block text-center" title="Guardar" name="save">
                    <i id="icon-save" class="fas fa-save"></i>
                </button>
            </form>

            <!-- Contador -->
            <div id="contador" class="contador p-2 mt-3 text-success"></div>
        </div>

        <!-- Lista Tareas -->
        <div class="lista p-4">
            <!-- Encabezados -->
            <div class="encabezados p-3">
                <div class="id">
                    <a id="column-id" href="#" class="" title="Ordenar * Clave">
                        <i class="fas fa-hashtag"></i>
                    </a>
                </div>
                <div class="name">
                    <a id="column-name" href="#" class="" title="Ordenar * Nombre">
                        Nombre
                    </a>
                </div>
                <div class="description">
                    <a id="column-description" href="#" class="" title="Ordenar * Descripción">
                        Descripción
                    </a>
                </div>
                <div class="date">
                    <a id="column-date" href="#" class="" title="Ordenar * Fecha">
                        Fecha
                    </a>
                </div>
                <div class="actions">
                    <span id="column-actions" class="">
                        Acciones
                    </span>
                </div>
            </div>

            <!-- Tareas-->
            <div id="tasks" class="tareas mt-2"></div>
        </div>
    </main>

    <!-- Scripts -->
    <script src="js/app.js"></script>

</body>

</html>