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
            <link rel="stylesheet" href="css/styles.css">

            <!-- Scripts -->
            <script defer src="js/app.js"></script>
        </head>

        <body>

            <!-- Navegación -->
            <nav class="navegacion">
                <div class="contenedor-navegacion">
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
            <main class="main">
                <!-- Formulario Guardar & Contadores -->
                <div class="formulario">
                    <!-- Formulario Guardar -->
                    <form id="save-form" class="formulario-guardar">
                        <!-- Campo: ID -->
                        <input id="save-id" class="guardar-id form-field" type="number" placeholder="Clave:" name="id" disabled>
                        <!-- Campo: Nombre -->
                        <input id="save-name" class="guardar-nombre form-field" type="text" placeholder="Nombre:" name="name" required>
                        <!-- Campo: Descripción -->
                        <textarea id="save-description" class="guardar-descripcion form-field" placeholder="Descripción:" name="description" required></textarea>
                        <!-- Botón: Guardar -->
                        <button id="button-save" type="submit" class="boton-guardar boton success" title="Guardar" name="save">
                            <i id="icon-save" class="fas fa-save"></i>
                        </button>
                    </form>

                    <!-- Contadores -->
                    <div class="contadores">
                        <!-- Formulario Eliminación Multiple -->
                        <form id="form-multiple-delete" class="formulario-eliminacion-multiple">
                            <div class="contador-seleccion">
                                <span>Seleccionadas</span>
                                <span id="counter-selection" class="tareas-seleccionadas"></span>
                            </div>
                            <button id='button-multiple-delete' class="boton-eliminacion-multiple boton danger" type="submit" title="Eliminar Tareas | Delete" disabled>
                                <i id='icon-multiple-delete' class="fas fa-trash-alt"></i>
                            </button>
                        </form>

                        <!-- Contador: Resultados de Búsqueda -->
                        <div class="contador-busqueda">
                            <div>
                                <span class="text-grey">Tareas</span> Encontradas
                            </div>
                            <span id="counter-results" class="resultados-busqueda"></span>
                        </div>

                        <!-- Contador: Tareas Totales -->
                        <div class="contador-totales">
                            <div>
                                <span class="text-grey">Tareas</span> Totales
                            </div>
                            <span id="counter-totals" class="total-tareas"></span>
                        </div>

                        <!-- Formulario Subir Lista -->
                        <form id="form-upload-list" class="formulario-subir-lista">
                            <input id="input-upload-list" type="file" class="file" accept="application/json">
                            <label id="field-upload-list" for="input-upload-list" class="campo-subir-lista custom-file" title="Buscar Lista">
                                <span class="file-name">Buscar Lista</span>
                            </label>
                            <button id='button-upload-list' class="boton-subir-lista boton warning" type="submit" title="Subir Lista" disabled>
                                <i id="icon-upload-list" class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Lista Tareas -->
                <div class="lista">
                    <!-- Encabezados -->
                    <div class="encabezados">
                        <div class="encabezado seleccionar">
                            <input id="checkbox-master" type="checkbox" class="checkbox">
                            <label for="checkbox-master" class="check-all custom-checkbox"></label>
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
                                Acciones
                            </span>
                        </div>
                    </div>

                    <!-- Tareas -->
                    <div id="cards-container" class="tareas"></div>

                    <!-- Botón Subir -->
                    <a id="button-top-list" href="" class="boton-inicio-lista" title="Arriba">
                        <i class="fas fa-chevron-up fa-lg"></i>
                    </a>
                </div>
            </main>

            <!-- Alertas -->
            <div id="overlay" class="overlay">
                <!-- Alerta: Eliminar Tareas -->
                <div id="alert-delete" class="alerta">
                    <!-- Head -->
                    <div class="cabecera-alerta">
                        <button id="button-close-alert-delete" href="" class="cerrar-alerta" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <!-- Body -->
                    <div class="cuerpo-alerta">
                        <span>¿Eliminar Tareas?</span>
                    </div>
                    <!-- Footer -->
                    <div class="pie-alerta">
                        <!-- Formulario Eliminar -->
                        <form id="form-delete" class="formulario-eliminar">
                            <button id="button-delete" type="submit" class="boton-eliminar boton danger">
                                <i id="icon-delete" class="icono fas fa-trash"></i>
                                <span>Eliminar</span>
                            </button>
                            <button id="button-cancel-delete" class="boton-cancelar boton success">
                                <span>Cancelar</span>
                            </button>
                        </form>
                    </div>
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