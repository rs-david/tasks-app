<?php if ($session_started) : ?>
    <?php if ($_SESSION["user"]) : ?>

        <!DOCTYPE html>
        <html lang="es">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" href="favicon.svg" type="image/svg">
            <title>Tasks App</title>

            <!-- Fontawesome -->
            <link rel="stylesheet" href="lib/css/all.css">

            <!-- CSS -->
            <link rel="stylesheet" href="css/custom.css">
            <link rel="stylesheet" href="css/app.css">

            <!-- Scripts -->
            <script type="module" src="js/app.js"></script>
        </head>

        <body>
            <!-- Navegación -->
            <nav class="navegacion">
                <div class="contenedor">
                    <!-- Logo -->
                    <a href="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" class="logo" title="Home">
                        <i class="icono fas fa-address-book"></i>
                        <strong>Tasks</strong> App
                    </a>

                    <!-- Formulario Búsqueda -->
                    <form id="search-form" class="formulario-buscar">
                        <!-- Filtro: ID -->
                        <input id="search-id" class="buscar-id form-field" type="number" placeholder="Buscar: Clave" min="1">
                        <!-- Filtro: Nombre -->
                        <input id="search-name" class="buscar-nombre form-field" type="search" placeholder="Buscar: Nombre">
                        <!-- Filtro: Descripción -->
                        <input id="search-description" class="buscar-descripcion form-field" type="search" placeholder="Buscar: Descripción">
                        <!-- Botón: Limpiar -->
                        <button id='button-clean' class="boton-limpiar boton primary" title="Limpiar Filtros">
                            <i id="icon-clean" class="fas fa-eraser"></i>
                        </button>
                    </form>

                    <!-- Botón: Cerrar Sesión -->
                    <a id="button-logout" href="logout.php" class="boton boton-logout" title="Cerrar Sesión">
                        <i class="fas fa-user-alt-slash"></i>
                    </a>
                </div>
            </nav>

            <!-- Formulario & Lista Tareas -->
            <main>
                <!-- Formulario Guardar & Contadores -->
                <section class="formulario-y-contadores">
                    <!-- Formulario Guardar -->
                    <form id="save-form" class="formulario-guardar">
                        <!-- Campo: ID -->
                        <input id="save-id" class="guardar-id form-field" type="number" placeholder="Clave:" name="id" disabled>
                        <!-- Campo: Nombre -->
                        <input id="save-name" class="guardar-nombre form-field" type="text" placeholder="Nombre:" name="name" required>
                        <!-- Campo: Descripción -->
                        <textarea id="save-description" class="guardar-descripcion form-field" placeholder="Descripción:" name="description" required></textarea>
                        <!-- Botón: Guardar -->
                        <button id="button-save" type="submit" class="boton-guardar boton success" title="Guardar">
                            <i id="icon-save" class="fas fa-save"></i>
                        </button>
                    </form>

                    <!-- Contadores -->
                    <div class="contadores">
                        <!-- Formulario Eliminación Múltiple -->
                        <form id="form-multiple-delete" class="formulario-eliminacion-multiple">
                            <div class="contadores-seleccion">
                                <span>Selección</span>
                                <div class="radios-seleccion">
                                    <input id="memory-selection" type="radio" name="multiple-delete-selection">
                                    <label id="counter-memory-selection" for="memory-selection" class="" title="En Memoria"></label>
                                    <span>l</span>
                                    <input id="list-selection" type="radio" name="multiple-delete-selection" checked>
                                    <label id="counter-list-selection" for="list-selection" class="" title="En Lista"></label>
                                </div>
                            </div>
                            <button id='button-multiple-delete' class="boton-eliminacion-multiple boton danger" type="submit" title="Eliminar Tareas | Delete" disabled>
                                <i id='icon-multiple-delete' class="fas fa-trash-alt"></i>
                            </button>
                        </form>

                        <!-- Contador: Resultados de Búsqueda -->
                        <div class="contador-busqueda">
                            <div>
                                <span>Tareas</span> Encontradas
                            </div>
                            <strong id="counter-results" class="resultados-busqueda"></strong>
                        </div>

                        <!-- Contador: Tareas Totales -->
                        <div class="contador-totales">
                            <div>
                                <span>Tareas</span> Totales
                            </div>
                            <strong id="counter-totals" class="total-tareas"></strong>
                        </div>

                        <!-- Formulario Subir Lista -->
                        <form id="form-upload-list" class="formulario-subir-lista">
                            <input id="input-upload-list" type="file" class="custom-file" accept="application/json">
                            <label id="field-upload-list" for="input-upload-list" class="custom-label" title="Buscar Lista">
                                <span id="filename-upload-list" class="file-name">Buscar Lista</span>
                            </label>
                            <button id='button-upload-list' class="boton warning" type="submit" title="Subir Lista" disabled>
                                <i id="icon-upload-list" class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </section>

                <!-- Lista De Tareas -->
                <section id="list" class="lista">
                    <!-- Encabezados -->
                    <div id="headers" class="encabezados">
                        <div class="encabezado marcar">
                            <input id="checkbox-master" class="checkbox" type="checkbox">
                            <label for="checkbox-master" class="custom-checkbox"></label>
                        </div>
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
                                
                            </span>
                        </div>
                    </div>

                    <!-- Tareas -->
                    <div id="cards-container" class="tareas"></div>

                    <!-- Botón Subir -->
                    <a id="button-top-list" href="" class="boton-inicio-lista" title="Al Principio">
                        <i class="fas fa-chevron-up fa-lg"></i>
                    </a>
                </section>

                <!-- Pestañas -->
                <nav class="table-tabs">
                    <ul>
                        <li><a id="tasks-tab" class="table-tab" href="#" title="Tareas"><span class="tab-text">Tareas</span></a></li>
                        <li><a id="products-tab" class="table-tab" href="#" title="Productos"><span class="tab-text">Productos</span></a></li>
                        <li><a id="customers-tab" class="table-tab" href="#" title="Clientes"><span class="tab-text">Clientes</span></a></li>
                        <li class="complementary-border"></li>
                    </ul>
                </nav>
            </main>

            <!-- Overlay -->
            <div id="overlay" class="overlay">
                <!-- Modal: Eliminar Tareas -->
                <div id="modal-delete" class="modal">
                    <!-- Header -->
                    <header class="cabecera-modal">
                        <h1 id="title-modal-delete" class="titulo-modal"></h1>
                        <button id="button-close-modal" class="boton-cerrar-modal" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </header>
                    <!-- Body -->
                    <div class="cuerpo-modal">
                        <p>¿Eliminar <span id="quantity-delete" class="cantidad-eliminar"></span> tareas?</p>
                    </div>
                    <!-- Footer -->
                    <footer class="pie-modal">
                        <!-- Formulario Eliminar -->
                        <form id="form-delete" class="formulario-eliminar">
                            <button id="button-delete" class="boton-eliminar boton danger" type="submit">
                                <i id="icon-delete" class="icono fas fa-trash"></i> Eliminar
                            </button>
                            <button id="button-cancel-delete" class="boton-cancelar boton success">
                                Cancelar
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </body>

        </html>

    <?php else : ?>
        <?php header('location: login.php');
        exit ?>
    <?php endif ?>
<?php else : ?>
    <?php header('location: error.php') ?>
<?php endif ?>