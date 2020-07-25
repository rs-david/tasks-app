<?php

$session_started = session_start();

if ($_SESSION["user"]) {
    header('location: index.php');
    exit;
} else {
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST) {
        require 'functions/functions.php';

        $user = filtrarDatos($_POST['user']);
        $email = filtrarDatos($_POST['email']);
        $password = htmlspecialchars($_POST['password']);
        $confirmation = htmlspecialchars($_POST['confirmation']);

        // Revisar Campos Vacíos.
        if (empty($email) || empty($user) || empty($password) || empty($confirmation)) $errors[] = 'Llenar Todos Los Campos';

        // Validar Usuario.
        $valid_user = preg_match('/^[\w\-.]+$/', $user);
        if (!$valid_user) $errors[] = 'Nombre De Usuario Inválido';
        if (strlen($user) > 50) $errors[] = 'Longitud Del Nombre De Usuario Superior Al Límite';

        // Validar Email.
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Formato De Correo Inválido';
        if (strlen($email) > 255) $errors[] = 'No Se Admiten Emails Con Longitud Mayor A 255 Caracteres';

        // Validar Contraseña
        $password_spaces = preg_match('/[\s]/', $password);
        if ($password_spaces) $errors[] = 'No Se Admiten Espacios En La Contraseña';
        if (strlen($password) < 3 && strlen($password) > 0) $errors[] = 'Contraseña Demasiado Corta';
        if (strlen($password) > 100) $errors[] = 'Contraseña Demasiado Larga';

        // Validar Contraseña & Confirmación.
        if ($password !== $confirmation) $errors[] = 'Contraseñas No Coinciden';

        try {
            require 'connection.php';

            // Verificar Si Usuario Existe.
            $user_exists = verificarUsuario($conn, $user);
            if ($user_exists) $errors[] = 'Nombre De Usuario En Uso';

            // Verificar Si Email Existe.
            $email_exists = verificarEmail($conn, $email);
            if ($email_exists) $errors[] = 'Éste Email Ya Está Registrado';

            if (!$errors) {
                $correct_join = registrarUsuario($conn, $user, $email, $password);
                $notification = $correct_join ? "¡Usuario <strong>$user</strong> Registrado Con Éxito!" : 'Registro Fallido';
            }
        } catch (PDOException $e) {
            echo 'ERROR: ' . $e->getMessage();  /* Ocultar */
            $notification = 'Ocurrio Un Error: Registro Fallido';
        }
    }

    require 'join.view.php';
}
