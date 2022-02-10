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
            <title>Iniciar Sesión</title>

            <!-- Fontawesome -->
            <link rel="stylesheet" href="lib/css/all.css">

            <!-- CSS -->
            <link rel="stylesheet" href="css/custom.css">
            <link rel="stylesheet" href="css/login.css">
        </head>

        <body>
            <main class="contenedor">
                <!-- Logo -->
                <figure class="logo">
                    <i class="icono fas fa-address-book"></i>
                    <span class="nombre"><strong>Tasks</strong> App</span>
                </figure>

                <!-- Formulario Login -->
                <form class="formulario-login" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="POST">
                    <h1 class="titulo-login">Iniciar Sesión</h1>
                    <!-- Campo: Usuario -->
                    <input class="usuario-login form-input" type="text" placeholder="Usuario:" name="user" title="Ingresa Tu Nombre De Usuario" required autofocus>
                    <!-- Campo: Contraseña -->
                    <input class="contrasena-login form-input" type="password" placeholder="Contraseña:" name="password" title="Ingresa Tu Contraseña" required>
                    <!-- Botón: Iniciar Sesión -->
                    <button class="boton-login boton success" type="submit" title="Iniciar Sesión" name="login">
                        <i class="fas fa-user"></i>
                    </button>
                </form>

                <!-- Notificaciones -->
                <div class="notificaciones-login">

                    <?php if ($errors) : ?>
                        <?php foreach ($errors as $error) : ?>
                            <li><?php echo $error ?></li>
                        <?php endforeach ?>
                    <?php else : ?>
                        <p><?php echo $notification ?></p>
                    <?php endif ?>

                </div>

                <!-- Enlace: Página Registro -->
                <a href="join.php" class="link-registrar" title="Crear Una Cuenta">Registrarme</a>
            </main>
        </body>

        </html>

    <?php endif ?>
<?php else : ?>
    <?php header('location: error.php') ?>
<?php endif ?>