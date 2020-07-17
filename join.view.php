<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="lib/css/bootstrap.min.css">

    <!-- Fontawesome -->
    <link rel="stylesheet" href="lib/css/all.css">

    <!-- CSS -->
    <link rel="stylesheet" href="css/custom.css">
    <link rel="stylesheet" href="css/join.css">
    <link rel="stylesheet" href="css/styles.css">
</head>

<body>
    <div class="contenedor">
        <!-- Logo -->
        <figure class="logo">
            <i class="icono fas fa-address-book"></i>
            <span class="nombre"><strong>Tasks</strong> App</span>
        </figure>

        <!-- Formulario Registrar -->
        <form class="formulario-join" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="POST">
            <h1 class="titulo-join">Registro</h1>
            <!-- Campo: Usuario -->
            <input class="usuario-join form-control" type="text" placeholder="Usuario:" name="user" title="Sólo Puedes Usar Letras, Números, '_', '-' y '.'" pattern="[\w\-.]+" maxlength="50" required autofocus>
            <!-- Campo: Correo -->
            <input class="correo-join form-control" type="email" placeholder="Correo:" name="email" title="Ingresa Un Email" maxlength="255" required>
            <!-- Campo: Contraseña -->
            <input class="contrasena-join form-control" type="password" placeholder="Contraseña:" name="password" title="Longitud Mínima 3 Caracteres. No Usar Espacios" pattern="[^\s]+" minlength="3" maxlength="100" required>
            <!-- Campo: Verificar Contraseña -->
            <input class="confirmacion-join form-control" type="password" placeholder="Repetir Contraseña:" name="confirmation" title="Longitud Mínima 3 Caracteres. No Usar Espacios" pattern="[^\s]+" minlength="3" maxlength="100" required>
            <!-- Botón: Registrar -->
            <button class="boton boton-join" type="submit" title="Registrarme" name="join">
                <i class="fas fa-user-plus"></i>
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

        <!-- Iniciar Sesión -->
        <a href="login.php" class="link-iniciar-sesion">Iniciar Sesión</a>
    </div>
</body>

</html>