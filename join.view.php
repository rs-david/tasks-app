<?php if ($session_started) : ?>
    <?php if ($_SESSION["user"]) : ?>
        <?php header('location: index.php');
        exit ?>
    <?php else : ?>

        <!DOCTYPE html>
        <html lang="es">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" href="favicon.svg" type="image/svg">
            <title>Registro</title>

            <!-- Fontawesome -->
            <link rel="stylesheet" href="./assets/fontawesome/css/all.css">

            <!-- CSS -->
            <link rel="stylesheet" href="css/custom.css">
            <link rel="stylesheet" href="css/join.css">
        </head>

        <body>
            <main class="contenedor">
                <!-- Logo -->
                <figure class="logo">
                    <i class="icono fas fa-address-book"></i>
                    <span class="nombre"><strong>Tasks</strong> App</span>
                </figure>

                <!-- Formulario Registrar -->
                <form class="formulario-join" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="POST">
                    <h1 class="titulo-join">Registro</h1>
                    <!-- Campo: Usuario -->
                    <input class="usuario-join form-input" type="text" placeholder="Usuario:" name="user" title="Ingresa Un Nombre De Usuario: Puedes Usar Letras, Números, '_', '-' y '.'" pattern="[\w\-.]+" maxlength="50" required autofocus>
                    <!-- Campo: Correo -->
                    <input class="correo-join form-input" type="email" placeholder="Correo:" name="email" title="Ingresa Un Email" maxlength="255" required>
                    <!-- Campo: Contraseña -->
                    <input class="contrasena-join form-input" type="password" placeholder="Contraseña:" name="password" title="Ingresa Una Contraseña: Longitud Mínima 3 Caracteres. No Usar Espacios" pattern="[^\s]+" minlength="3" maxlength="100" required>
                    <!-- Campo: Verificar Contraseña -->
                    <input class="confirmacion-join form-input" type="password" placeholder="Repetir Contraseña:" name="confirmation" title="Ingresa Una Vez Más Tu Contraseña" pattern="[^\s]+" minlength="3" maxlength="100" required>
                    <!-- Botón: Registrar -->
                    <button class="boton boton-join" type="submit" title="Registrarme" name="join">
                        <i class="icono fas fa-user-plus"></i>
                    </button>
                </form>

                <!-- Notificaciones -->
                <div class="notificaciones-join">

                    <?php if ($errors) : ?>
                        <?php foreach ($errors as $error) : ?>
                            <li><?php echo $error ?></li>
                        <?php endforeach ?>
                    <?php else : ?>
                        <p><?php echo $notification ?></p>
                    <?php endif ?>

                </div>

                <!-- Enlace: Iniciar Sesión -->
                <a href="login.php" class="link-iniciar-sesion">Iniciar Sesión</a>
            </main>
        </body>

        </html>

    <?php endif ?>
<?php else : ?>
    <?php header('location: error.php') ?>
<?php endif ?>