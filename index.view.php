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
      <link rel="stylesheet" href="./assets/fontawesome/css/all.css">

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

          <!-- Filter Foem -->
          <form id="search-form" class="search-form">
            <!-- Filtro: ID -->
            <input name="id" id="search-id" class="search-id form-input" type="number" placeholder="Buscar: Clave" min="1">
            <!-- Filtro: Nombre -->
            <input name="name" id="search-name" class="search-name form-input" type="search" placeholder="Buscar: Nombre">
            <!-- Filtro: Descripción -->
            <input name="description" id="search-description" class="search-description form-input" type="search" placeholder="Buscar: Descripción">
            <!-- Botón: Limpiar -->
            <button id='clean-filters-button' class="clean-filters-button boton primary" title="Limpiar Filtros">
              <i id="clean-filters-icon" class="fas fa-eraser"></i>
            </button>

            <!-- Botón: Cerrar Sesión (Ubicación Temporal) -->
            <a id="button-logout" href="logout.php" class="boton boton-logout" title="Cerrar Sesión">
              <i class="fas fa-user-alt-slash"></i>
            </a>
          </form>
        </div>
      </nav>

      <!-- Save Form & List -->
      <main>
        <!-- Save Form & Counters -->
        <section class="formulario-y-contadores">
          <!-- SAVE FORM -->
          <form id="save-form" class="save-form">
            <!-- Save Input: ID -->
            <div class="form-group">
              <label for="save-id">Clave:</label>
              <input id="save-id" class="save-id form-input" type="number" placeholder="" name="id" disabled>
            </div>
            <!-- Save Input: Nombre -->
            <div class="form-group">
              <label for="save-name">Nombre:</label>
              <input id="save-name" class="save-name form-input" type="text" placeholder="" name="name" required>
            </div>
            <!-- Save Input: Descripción -->
            <div class="form-group">
              <label for="save-description">Descripción:</label>
              <input id="save-description" class="save-description form-input" placeholder="" name="description" required></input>
            </div>
            <!-- Save Button -->
            <button id="save-button" type="submit" class="save-button boton success" title="Guardar">
              <i id="icon-save" class="fas fa-save"></i>
            </button>
          </form>

          <!-- Counters++ -->
          <div class="contadores">

            <!-- MULTIPLE DELETE FORM -->
            <form id="multiple-delete-form" class="multiple-delete-form">

              <!-- Multiple Delete Radios -->
              <div class="selection-radios">
                <div class="radio-group">
                  <input id="memory-selection" type="radio" name="multiple-delete-radio" data-deletetype="memory">
                  <label for="memory-selection" title="Registros Almacenados En Memoria">
                    <span>Mem</span>
                    <span id="memory-selection-counter" class="selection-counter"></span>
                  </label>
                </div>

                <span class="middle-line">❘</span>

                <div class="radio-group">
                  <input id="list-selection" type="radio" name="multiple-delete-radio" data-deletetype="list" checked>
                  <label for="list-selection" title="Registros Seleccionados En Lista">
                    <span>List</span>
                    <span id="list-selection-counter" class="selection-counter"></span>
                  </label>
                </div>
              </div>

              <!-- Multiple Delete Button -->
              <button id='multiple-delete-button' class="multiple-delete-button boton danger" type="submit" title="Eliminar Registros" disabled>
                <i class="fas fa-trash-alt"></i>
              </button>
            </form>

            <!-- RESULTS COUNTER -->
            <div class="contador-busqueda">
              <div>
                <span>Registros</span> Encontrados
              </div>
              <strong id="counter-results" class="resultados-busqueda"></strong>
            </div>

            <!-- TOTALS COUNTER -->
            <div class="contador-totales">
              <div>
                <span>Registros</span> Totales
              </div>
              <strong id="counter-totals" class="total-tareas"></strong>
            </div>

            <!-- UPLOAD JSON LIST FORM -->
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

          <!-- Headers -->
          <nav id="headers" class="headers">
            <ul>
              <li class="header headers-checkbox perm-header">
                <input id="headers-checkbox" class="custom-checkbox" type="checkbox" name="master">
                <label for="headers-checkbox" class="custom-label"></label>
              </li>
              <li class="header id-header temp-header">
                <a id="id-header" class="header-link" name="id" href="" title="Ordenar × Clave">#</a>
              </li>
              <li class="header name-header temp-header">
                <a id="name-header" class="header-link" name="name" href="" title="Ordenar × Nombre">Nombre</a>
              </li>
              <li class="header description-header temp-header">
                <a id="description-header" class="header-link" name="description" href="" title="Ordenar × Descripción">Descripción</a>
              </li>
              <li class="header created-header temp-header">
                <a id="created-header" class="header-link descendente active" name="created" href="" title="Ordenar × Creado">Creado</a>
              </li>
              <li id="actions-header" class="header actions-header perm-header"></li>
            </ul>
          </nav>

          <!-- Cards -->
          <div id="cards" class="cards"></div>

          <!-- Botón Subir -->
          <a id="button-top-list" href="" class="boton-inicio-lista" title="Al Principio">
            <i class="fas fa-chevron-up fa-lg"></i>
          </a>
        </section>

        <!-- Pestañas -->
        <nav id="table-tabs" class="table-tabs">
          <ul>
            <li><a name="tasks" id="tasks-tab" class="table-tab active" href="" title="Tareas"><span class="tab-text">Tasks</span></a></li>
            <li><a name="products" id="products-tab" class="table-tab" href="" title="Productos"><span class="tab-text">Products</span></a></li>
            <li><a name="customers" id="customers-tab" class="table-tab" href="" title="Clientes"><span class="tab-text">Customers</span></a></li>
            <li class="complementary-border"></li>
          </ul>
        </nav>

        <!-- Título De La Tabla -->
        <div id="table-title" class="table-title">Tasks</div>
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